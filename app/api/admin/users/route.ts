import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";

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
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string; email?: string | null; name?: string | null } | undefined;
  return user?.id && user.role === "owner" ? user : null;
}

export async function GET() {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  await connectDB();
  const users = await AdminUser.find().sort({ role: 1, createdAt: 1 }).lean();
  return NextResponse.json({ users, currentAdminId: owner.id });
}

export async function POST(request: NextRequest) {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
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
  return NextResponse.json({ user }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid update" }, { status: 400 });
  await connectDB();
  const target = await AdminUser.findById(parsed.data.id);
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
  }
  await target.save();
  return NextResponse.json({ user: target });
}

export async function DELETE(request: NextRequest) {
  const owner = await ownerSession();
  if (!owner) return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Administrator ID required" }, { status: 400 });
  if (id === owner.id) return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  await connectDB();
  const target = await AdminUser.findById(id);
  if (!target) return NextResponse.json({ error: "Administrator not found" }, { status: 404 });
  if (target.role === "owner" && await AdminUser.countDocuments({ role: "owner", active: true }) <= 1) {
    return NextResponse.json({ error: "Keep at least one active owner" }, { status: 400 });
  }
  await target.deleteOne();
  return NextResponse.json({ ok: true });
}
