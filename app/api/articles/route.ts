import { NextRequest, NextResponse } from "next/server";
import { articleCatalog } from "@/content/articleCatalog";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models/Article";
import { articleSchema } from "@/lib/validators/article";
import { validDocumentId } from "@/lib/validators/id";
import { recordContentChange } from "@/lib/content-history";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";

const catalogItems = articleCatalog.map((item, order) => ({
  ...item,
  excerpt: item.summary,
  readingMinutes: Number(item.time.match(/\d+/)?.[0] ?? 7),
  coverImage: `/images/knowledge/articles/${item.slug}.jpg`,
  status: item.status === "published" ? "published" : "review",
  order,
}));

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: catalogItems, source: "editorial-manifest" });
  const requestedStatus = request.nextUrl.searchParams.get("status");
  const status = requestedStatus ?? "published";
  if (status !== "published") { const denied = await requireAdmin(); if (denied) return denied; }
  const category = request.nextUrl.searchParams.get("category");
  const filter = { deletedAt: null, ...(status !== "all" ? { status } : {}), ...(category ? { category } : {}) };
  try {
    await connectDB();
    const items = await Article.find(filter).sort({ order: 1, featured: -1, publishedAt: -1, createdAt: -1 }).lean();
    return NextResponse.json({ items, source: "cms" });
  } catch {
    if (status !== "published") return NextResponse.json({ error: "CMS database is unavailable" }, { status: 503 });
    return NextResponse.json({ items: catalogItems, source: "editorial-fallback" }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid article", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Article.create({ ...parsed.data, version: 1, lastEditedBy: admin.email || admin.name, ...(parsed.data.status === "published" ? { publishedAt: new Date() } : {}) });
  await recordContentChange({ resourceType: "article", resourceId: String(item._id), resourceLabel: item.title, action: parsed.data.status === "published" ? "publish" : "create", after: item, actor: admin, note: parsed.data.revisionNote });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = articleSchema.partial().safeParse(payload);
  if (!validDocumentId(payload.id) || !parsed.success) return NextResponse.json({ error: "Invalid article update" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Article.findOne({ _id: payload.id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  const update = { ...parsed.data, lastEditedBy: admin?.email || admin?.name, ...(parsed.data.status === "published" ? { publishedAt: new Date() } : {}) };
  const expectedVersion = Number(payload.expectedVersion);
  const item = await Article.findOneAndUpdate({ _id: payload.id, deletedAt: null, ...(Number.isInteger(expectedVersion) ? { version: expectedVersion } : {}) }, { $set: update, $inc: { version: 1 } }, { new: true, runValidators: true });
  if (!item) return NextResponse.json({ error: "This article changed after you opened it. Reload before saving.", conflict: true }, { status: 409 });
  const action = parsed.data.status === "published" && before.status !== "published" ? "publish" : Object.keys(parsed.data).length === 1 && typeof parsed.data.order === "number" ? "reorder" : "update";
  await recordContentChange({ resourceType: "article", resourceId: String(item._id), resourceLabel: item.title, action, before, after: item, actor: admin, note: parsed.data.revisionNote });
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid article id" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Article.findOne({ _id: id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  const item = await Article.findByIdAndUpdate(id, { $set: { deletedAt: new Date(), deletedBy: admin.email || admin.name }, $inc: { version: 1 } }, { new: true });
  await recordContentChange({ resourceType: "article", resourceId: id, resourceLabel: String(before.title), action: "delete", before, after: item, actor: admin, note: "Moved to recoverable trash" });
  return NextResponse.json({ deleted: true, recoverable: true });
}
