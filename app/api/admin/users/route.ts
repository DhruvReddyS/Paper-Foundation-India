import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentAdmin } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { validDocumentId } from "@/lib/validators/id";
import { recordAuditEvent } from "@/lib/content-history";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(80),
  name: z.string().trim().min(2).max(80),
  password: z.string().min(10).max(160),
  role: z.enum(["owner", "editor", "analyst"]),
});

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(80).optional(),
  password: z.string().min(10).max(160).optional(),
  role: z.enum(["owner", "editor", "analyst"]).optional(),
  active: z.boolean().optional(),
});

async function ownerSession() {
  const user = await currentAdmin();
  return user?.role === "owner" ? user : null;
}

export async function GET() {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ users: [], currentAdminId: owner.id, configured: false });
  await connectDB();
  const users = await AdminUser.find().sort({ role: 1, createdAt: 1 }).lean();
  return NextResponse.json({ users, currentAdminId: owner.id });
}

export async function POST(request: NextRequest) {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid account" }, { status: 400 });
  await connectDB();
  if (await AdminUser.exists({ username: parsed.data.username })) return NextResponse.json({ error: "That user ID already exists" }, { status: 409 });
  const user = await AdminUser.create({
    username: parsed.data.username,
    name: parsed.data.name,
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
    role: parsed.data.role,
    createdBy: owner.email || owner.name || "owner",
  });
  await recordAuditEvent({ actor: owner, action: "administrator.create", resourceType: "administrator", resourceId: String(user._id), resourceLabel: user.name, changedFields: ["username", "name", "role"] });
  return NextResponse.json({ user }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: parsed.success ? "Invalid administrator ID" : parsed.error.issues[0]?.message ?? "Invalid update" }, { status: 400 });
  await connectDB();
  const target = await AdminUser.findById(parsed.data.id).select("+sessionVersion");
  if (!target) return NextResponse.json({ error: "Administrator not found" }, { status: 404 });
  if (String(target._id) === owner.id && parsed.data.active === false) return NextResponse.json({ error: "You cannot disable your own account" }, { status: 400 });
  if (target.role === "owner" && parsed.data.role && parsed.data.role !== "owner" && await AdminUser.countDocuments({ role: "owner", active: true }) <= 1) {
    return NextResponse.json({ error: "Keep at least one active owner" }, { status: 400 });
  }
  if (parsed.data.name) target.name = parsed.data.name;
  if (parsed.data.role) target.role = parsed.data.role;
  if (typeof parsed.data.active === "boolean") target.active = parsed.data.active;
  if (parsed.data.password) {
    target.passwordHash = await bcrypt.hash(parsed.data.password, 12);
    target.failedAttempts = 0;
    target.lockedUntil = null;
    target.sessionVersion = (target.sessionVersion ?? 1) + 1;
  }
  await target.save();
  await recordAuditEvent({ actor: owner, action: parsed.data.password ? "administrator.credentials_reset" : "administrator.update", resourceType: "administrator", resourceId: String(target._id), resourceLabel: target.name, changedFields: Object.keys(parsed.data).filter(key => key !== "id" && key !== "password").concat(parsed.data.password ? ["credentials"] : []) });
  return NextResponse.json({ user: target });
}

export async function DELETE(request: NextRequest) {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = new URL(request.url).searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Valid administrator ID required" }, { status: 400 });
  if (id === owner.id) return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  await connectDB();
  const target = await AdminUser.findById(id);
  if (!target) return NextResponse.json({ error: "Administrator not found" }, { status: 404 });
  if (target.role === "owner" && await AdminUser.countDocuments({ role: "owner", active: true }) <= 1) {
    return NextResponse.json({ error: "Keep at least one active owner" }, { status: 400 });
  }
  const label = target.name;
  await target.deleteOne();
  await recordAuditEvent({ actor: owner, action: "administrator.delete", resourceType: "administrator", resourceId: String(target._id), resourceLabel: label, changedFields: [] });
  return NextResponse.json({ ok: true });
}
