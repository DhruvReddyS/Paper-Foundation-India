import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { decryptMfaSecret, normalizeRecoveryCode, verifyTotp } from "@/lib/mfa";
import { consumeRateLimit } from "@/lib/rate-limit";

export function adminAuthConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.NEXTAUTH_SECRET);
}

export function adminPreviewEnabled() {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.ADMIN_PREVIEW_MODE === "true" || !adminAuthConfigured();
}

const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(80),
  // Existing administrators may have credentials created under the previous
  // policy. Enforce the 12-character rule on creation/reset without locking
  // those accounts out before an owner can rotate them.
  password: z.string().min(1).max(160),
  otp: z.string().trim().max(32).optional(),
});

async function bootstrapOwner(username: string, password: string) {
  const bootstrapUsername = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim().toLowerCase();
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!bootstrapUsername || !bootstrapPassword || username !== bootstrapUsername || password !== bootstrapPassword) return null;
  if (bootstrapPassword.length < 12 || !/[a-z]/.test(bootstrapPassword) || !/[A-Z]/.test(bootstrapPassword) || !/\d/.test(bootstrapPassword)) return null;
  if (await AdminUser.exists({})) return null;
  return AdminUser.create({
    username,
    name: "Foundation Owner",
    passwordHash: await bcrypt.hash(password, 12),
    role: "owner",
    createdBy: "environment bootstrap",
    lastLoginAt: new Date(),
  });
}

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({
    name: "Admin credentials",
    credentials: {
      username: { label: "User ID", type: "text" },
      password: { label: "Password", type: "password" },
      otp: { label: "Authenticator or recovery code", type: "text" },
    },
    async authorize(credentials, request) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success || !adminAuthConfigured()) return null;

      // The per-account lockout below stops repeated guesses at one user ID,
      // but it does nothing about guesses spread thinly across many of them,
      // because no single account ever reaches five failures. Limit the
      // source as well as the account.
      const headers = (request?.headers ?? {}) as Record<string, string | undefined>;
      const source = headers["x-forwarded-for"]?.split(",")[0]?.trim() || headers["x-real-ip"] || "unknown";
      const { limited } = await consumeRateLimit(source, "admin-signin", 10, 10 * 60_000);
      if (limited) throw new Error("TOO_MANY_ATTEMPTS");

      await connectDB();
      const { username, password } = parsed.data;
      let admin = await AdminUser.findOne({ username }).select("+passwordHash +failedAttempts +lockedUntil +sessionVersion +mfaSecretEncrypted +recoveryCodeHashes");
      if (!admin) admin = await bootstrapOwner(username, password);
      if (!admin || !admin.active) return null;
      if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) throw new Error("ACCOUNT_LOCKED");

      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        const attempts = (admin.failedAttempts ?? 0) + 1;
        admin.failedAttempts = attempts >= 5 ? 0 : attempts;
        admin.lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
        await admin.save();
        return null;
      }

      if (admin.mfaEnabled) {
        const otp = parsed.data.otp ?? "";
        let mfaValid = Boolean(otp && admin.mfaSecretEncrypted && verifyTotp(decryptMfaSecret(admin.mfaSecretEncrypted), otp));
        if (!mfaValid && otp) {
          const normalized = normalizeRecoveryCode(otp);
          for (let index = 0; index < (admin.recoveryCodeHashes ?? []).length; index += 1) {
            if (normalized && await bcrypt.compare(normalized, admin.recoveryCodeHashes[index])) {
              admin.recoveryCodeHashes.splice(index, 1);
              mfaValid = true;
              break;
            }
          }
        }
        if (!mfaValid) {
          const attempts = (admin.failedAttempts ?? 0) + 1;
          admin.failedAttempts = attempts >= 5 ? 0 : attempts;
          admin.lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
          await admin.save();
          throw new Error(otp ? "MFA_INVALID" : "MFA_REQUIRED");
        }
      }

      admin.failedAttempts = 0;
      admin.lockedUntil = null;
      admin.lastLoginAt = new Date();
      await admin.save();
      return { id: String(admin._id), name: admin.name, email: admin.username, role: admin.role, sessionVersion: admin.sessionVersion ?? 1 };
    },
  })],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
        token.role = (user as { role?: string }).role ?? "editor";
        token.sessionVersion = (user as { sessionVersion?: number }).sessionVersion ?? 1;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id?: string; role?: string }).id = String(token.adminId ?? token.sub ?? "");
        (session.user as typeof session.user & { id?: string; role?: string }).role = String(token.role ?? "editor");
        (session.user as typeof session.user & { sessionVersion?: number }).sessionVersion = Number(token.sessionVersion ?? 1);
      }
      return session;
    },
  },
};

export async function canManageContent() {
  if (adminPreviewEnabled()) return true;
  if (!adminAuthConfigured()) return false;
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}
