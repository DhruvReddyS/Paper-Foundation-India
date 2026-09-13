import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resourceCatalog } from "@/content/resources";
import { connectDB } from "@/lib/db";
import { Resource } from "@/lib/models/Resource";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { validDocumentId } from "@/lib/validators/id";
import { recordContentChange } from "@/lib/content-history";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  source: z.string().min(1),
  publisher: z.string().min(1),
  date: z.string().min(1),
  format: z.string().min(1),
  href: z.string().url(),
  accent: z.enum(["green", "copper", "sage", "kraft"]).default("green"),
  status: z.enum(["draft", "published"]).default("published"),
  order: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: resourceCatalog, source: "editorial-manifest" });
  const status = request.nextUrl.searchParams.get("status") ?? "published";
  if (status !== "published" && await requireAdmin()) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  try {
    await connectDB();
    const items = await Resource.find({ deletedAt: null, ...(status === "all" ? {} : { status }) }).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ items, source: "cms" });
  } catch {
    if (status !== "published") return NextResponse.json({ error: "CMS database is unavailable" }, { status: 503 });
    return NextResponse.json({ items: resourceCatalog, source: "editorial-fallback" });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid resource", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Resource.create({ ...parsed.data, version: 1 });
  await recordContentChange({ resourceType: "resource", resourceId: String(item._id), resourceLabel: item.title, action: parsed.data.status === "published" ? "publish" : "create", after: item, actor: admin });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = schema.partial().safeParse(payload);
  if (!validDocumentId(payload.id) || !parsed.success) return NextResponse.json({ error: "Invalid resource update" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Resource.findOne({ _id: payload.id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  const expectedVersion = Number(payload.expectedVersion);
  const item = await Resource.findOneAndUpdate({ _id: payload.id, deletedAt: null, ...(Number.isInteger(expectedVersion) ? { version: expectedVersion } : {}) }, { $set: parsed.data, $inc: { version: 1 } }, { new: true, runValidators: true });
  if (!item) return NextResponse.json({ error: "This resource changed after you opened it. Reload before saving.", conflict: true }, { status: 409 });
  const action = parsed.data.status === "published" && before.status !== "published" ? "publish" : "update";
  await recordContentChange({ resourceType: "resource", resourceId: String(item._id), resourceLabel: item.title, action, before, after: item, actor: admin });
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Resource.findOne({ _id: id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  const item = await Resource.findByIdAndUpdate(id, { $set: { deletedAt: new Date(), deletedBy: admin.email || admin.name }, $inc: { version: 1 } }, { new: true });
  await recordContentChange({ resourceType: "resource", resourceId: id, resourceLabel: String(before.title), action: "delete", before, after: item, actor: admin, note: "Moved to recoverable trash" });
  return NextResponse.json({ deleted: true, recoverable: true });
}
