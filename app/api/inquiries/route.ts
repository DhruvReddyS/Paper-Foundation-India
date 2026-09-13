import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Inquiry } from "@/lib/models/Inquiry";
import { inquirySchema } from "@/lib/validators/inquiry";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { z } from "zod";
import { validDocumentId } from "@/lib/validators/id";
import { enforceRateLimit } from "@/lib/rate-limit";
import { recordAuditEvent } from "@/lib/content-history";

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "reviewing", "resolved", "archived"]).optional(),
  internalNotes: z.string().max(5000).optional(),
});

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], source: "unconfigured" });
  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  const items = await Inquiry.find(status ? { status } : {}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "public-inquiry", 8, 60 * 60_000); if (limited) return limited;
  const parsed = inquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid correspondence", issues: parsed.error.flatten() }, { status: 400 });
  if (!process.env.MONGODB_URI) {
    if (process.env.NODE_ENV !== "production") return NextResponse.json({ accepted: true, preview: true }, { status: 202 });
    return NextResponse.json({ error: "Correspondence service is not configured" }, { status: 503 });
  }
  await connectDB();
  const item = await Inquiry.create(parsed.data);
  return NextResponse.json({ accepted: true, id: item.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Invalid inquiry update", issues: parsed.success ? undefined : parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const { id, ...update } = parsed.data;
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Inquiry.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean() as unknown as { _id: unknown; subject: string } | null;
  if (!item) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  await recordAuditEvent({ actor: admin, action: "inquiry.update", resourceType: "inquiry", resourceId: String(item._id), resourceLabel: item.subject, changedFields: Object.keys(update) });
  return NextResponse.json({ item });
}
