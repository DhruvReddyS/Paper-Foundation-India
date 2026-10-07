import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { z } from "zod";
import { currentAdmin, requireAdmin } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { recordAuditEvent } from "@/lib/content-history";
import { decryptMfaSecret, encryptMfaSecret, generateMfaSecret, generateRecoveryCodes, normalizeRecoveryCode, verifyTotp } from "@/lib/mfa";
import { AdminUser } from "@/lib/models/AdminUser";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("begin") }),
  z.object({ action: z.literal("enable"), code: z.string().trim().min(6).max(12) }),
  z.object({ action: z.literal("disable"), code: z.string().trim().min(6).max(32) }),
]);

async function account() {
  const admin = await currentAdmin();
  if (!admin || admin.id === "preview") return { admin, user: null };
  await connectDB();
  const user = await AdminUser.findById(admin.id).select("+mfaSecretEncrypted +pendingMfaSecretEncrypted +recoveryCodeHashes");
  return { admin, user };
}

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  const { user } = await account();
  return NextResponse.json({ configured: Boolean(user), enabled: Boolean(user?.mfaEnabled), recoveryCodesRemaining: user?.recoveryCodeHashes?.length ?? 0 });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI || !process.env.NEXTAUTH_SECRET) return NextResponse.json({ error: "Production authentication is not configured" }, { status: 503 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid two-factor request" }, { status: 400 });
  const { admin, user } = await account();
  if (!admin || !user) return NextResponse.json({ error: "Administrator account not found" }, { status: 404 });

  if (parsed.data.action === "begin") {
    const secret = generateMfaSecret();
    user.pendingMfaSecretEncrypted = encryptMfaSecret(secret);
    await user.save();
    const issuer = "Paper Foundation India";
    const uri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(user.username)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
    return NextResponse.json({ secret, qrCode: await QRCode.toDataURL(uri, { width: 280, margin: 1, errorCorrectionLevel: "M" }) });
  }

  if (parsed.data.action === "enable") {
    if (!user.pendingMfaSecretEncrypted) return NextResponse.json({ error: "Start setup again to generate a new secret" }, { status: 409 });
    const secret = decryptMfaSecret(user.pendingMfaSecretEncrypted);
    if (!verifyTotp(secret, parsed.data.code)) return NextResponse.json({ error: "That authenticator code is not valid" }, { status: 400 });
    const recoveryCodes = generateRecoveryCodes();
    user.mfaSecretEncrypted = encryptMfaSecret(secret);
    user.pendingMfaSecretEncrypted = "";
    user.recoveryCodeHashes = await Promise.all(recoveryCodes.map(code => bcrypt.hash(normalizeRecoveryCode(code), 10)));
    user.mfaEnabled = true;
    await user.save();
    await recordAuditEvent({ actor: admin, action: "administrator.mfa_enabled", resourceType: "administrator", resourceId: admin.id, resourceLabel: admin.name || admin.email || "Administrator", changedFields: ["mfaEnabled"] });
    return NextResponse.json({ enabled: true, recoveryCodes });
  }

  let valid = Boolean(user.mfaEnabled && user.mfaSecretEncrypted && verifyTotp(decryptMfaSecret(user.mfaSecretEncrypted), parsed.data.code));
  if (!valid) {
    const normalized = normalizeRecoveryCode(parsed.data.code);
    for (const hash of user.recoveryCodeHashes ?? []) if (normalized && await bcrypt.compare(normalized, hash)) { valid = true; break; }
  }
  if (!valid) return NextResponse.json({ error: "Enter a valid authenticator or recovery code" }, { status: 400 });
  user.mfaEnabled = false;
  user.mfaSecretEncrypted = "";
  user.pendingMfaSecretEncrypted = "";
  user.recoveryCodeHashes = [];
  await user.save();
  await recordAuditEvent({ actor: admin, action: "administrator.mfa_disabled", resourceType: "administrator", resourceId: admin.id, resourceLabel: admin.name || admin.email || "Administrator", changedFields: ["mfaEnabled"] });
  return NextResponse.json({ enabled: false });
}
