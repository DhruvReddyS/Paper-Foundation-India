import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminPreviewEnabled, authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";

export type AdminRole = "owner" | "editor" | "analyst";

export async function currentAdmin() {
  if (adminPreviewEnabled()) {
    return { id: "preview", name: "Preview administrator", email: "preview@local", role: "owner" as AdminRole };
  }
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; name?: string | null; email?: string | null; role?: string; sessionVersion?: number } | undefined;
  if (!user?.id || !["owner", "editor", "analyst"].includes(user.role ?? "")) return null;
  try {
    await connectDB();
    const stored = await AdminUser.findOne({ _id: user.id, active: true }).select("name username role +sessionVersion").lean() as { _id: unknown; name: string; username: string; role: AdminRole; sessionVersion?: number } | null;
    if (!stored || (stored.sessionVersion ?? 1) !== (user.sessionVersion ?? 1)) return null;
    return { id: String(stored._id), name: stored.name, email: stored.username, role: stored.role };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  return await currentAdmin() ? null : NextResponse.json({ error: "Admin access required" }, { status: 401 });
}

export async function requireEditor() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  return admin.role === "analyst"
    ? NextResponse.json({ error: "This account has read-only analyst access" }, { status: 403 })
    : null;
}
