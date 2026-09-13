import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Myth } from "@/lib/models/Myth";
import { mythSchema } from "@/lib/validators/myth";
import { validDocumentId } from "@/lib/validators/id";
import { recordContentChange } from "@/lib/content-history";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import mythCatalog from "@/content/mythCatalog.json";

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({
    items: mythCatalog.map((item, order) => ({
      claim: item.myth,
      correction: item.reality,
      explanation: `${item.explanation}\n\nIndia context: ${item.indiaContext}`,
      category: "General",
      verdict: "context",
      tags: [],
      sources: [],
      status: "review",
      order,
      revisionNote: `Reviewed ${item.reviewed}`,
    })),
    source: "editorial-manifest",
  });
  const status = request.nextUrl.searchParams.get("status") ?? "published";
  if (status !== "published") { const denied = await requireAdmin(); if (denied) return denied; }
  try {
    await connectDB();
    const items = await Myth.find({ deletedAt: null, ...(status !== "all" ? { status } : {}) }).sort({ order: 1, featured: -1, publishedAt: -1, createdAt: -1 }).lean();
    return NextResponse.json({ items, source: "cms" });
  } catch {
    if (status !== "published") return NextResponse.json({ error: "CMS database is unavailable" }, { status: 503 });
    return NextResponse.json({ items: mythCatalog.map((item, order) => ({ claim: item.myth, correction: item.reality, explanation: `${item.explanation}\n\nIndia context: ${item.indiaContext}`, category: "General", verdict: "context", tags: [], sources: [], status: "published", order })), source: "editorial-fallback" });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const parsed = mythSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid myth", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Myth.create({ ...parsed.data, version: 1, lastEditedBy: admin.email || admin.name, ...(parsed.data.status === "published" ? { publishedAt: new Date() } : {}) });
  await recordContentChange({ resourceType: "myth", resourceId: String(item._id), resourceLabel: item.claim, action: parsed.data.status === "published" ? "publish" : "create", after: item, actor: admin, note: parsed.data.revisionNote });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = mythSchema.partial().safeParse(payload);
  if (!validDocumentId(payload.id) || !parsed.success) return NextResponse.json({ error: "Invalid myth update" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Myth.findOne({ _id: payload.id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Myth not found" }, { status: 404 });
  const update = { ...parsed.data, lastEditedBy: admin?.email || admin?.name, ...(parsed.data.status === "published" ? { publishedAt: new Date() } : {}) };
  const expectedVersion = Number(payload.expectedVersion);
  const item = await Myth.findOneAndUpdate({ _id: payload.id, deletedAt: null, ...(Number.isInteger(expectedVersion) ? { version: expectedVersion } : {}) }, { $set: update, $inc: { version: 1 } }, { new: true, runValidators: true });
  if (!item) return NextResponse.json({ error: "This record changed after you opened it. Reload before saving.", conflict: true }, { status: 409 });
  const action = parsed.data.status === "published" && before.status !== "published" ? "publish" : Object.keys(parsed.data).length === 1 && typeof parsed.data.order === "number" ? "reorder" : "update";
  await recordContentChange({ resourceType: "myth", resourceId: String(item._id), resourceLabel: item.claim, action, before, after: item, actor: admin, note: parsed.data.revisionNote });
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid myth id" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Myth.findOne({ _id: id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Myth not found" }, { status: 404 });
  const item = await Myth.findByIdAndUpdate(id, { $set: { deletedAt: new Date(), deletedBy: admin.email || admin.name }, $inc: { version: 1 } }, { new: true });
  await recordContentChange({ resourceType: "myth", resourceId: id, resourceLabel: String(before.claim), action: "delete", before, after: item, actor: admin, note: "Moved to recoverable trash" });
  return NextResponse.json({ deleted: true, recoverable: true });
}
