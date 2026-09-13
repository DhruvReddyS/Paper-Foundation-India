import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { glossaryData } from "@/content/glossary";
import { connectDB } from "@/lib/db";
import { Glossary } from "@/lib/models/Glossary";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { validDocumentId } from "@/lib/validators/id";
import { recordContentChange } from "@/lib/content-history";

const schema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1),
  letter: z.string().length(1).transform(value => value.toUpperCase()),
  status: z.enum(["draft", "published"]).default("published"),
  order: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) {
    const items = Object.entries(glossaryData).flatMap(([letter, terms]) => terms.map((item, order) => ({ ...item, letter, order, status: "published" })));
    return NextResponse.json({ items, source: "editorial-manifest" });
  }
  const status = request.nextUrl.searchParams.get("status") ?? "published";
  if (status !== "published" && await requireAdmin()) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  try {
    await connectDB();
    const items = await Glossary.find({ deletedAt: null, ...(status === "all" ? {} : { status }) }).sort({ letter: 1, order: 1, term: 1 }).lean();
    return NextResponse.json({ items, source: "cms" });
  } catch {
    if (status !== "published") return NextResponse.json({ error: "CMS database is unavailable" }, { status: 503 });
    const items = Object.entries(glossaryData).flatMap(([letter, terms]) => terms.map((item, order) => ({ ...item, letter, order, status: "published" })));
    return NextResponse.json({ items, source: "editorial-fallback" });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid glossary entry", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Glossary.create({ ...parsed.data, version: 1 });
  await recordContentChange({ resourceType: "glossary", resourceId: String(item._id), resourceLabel: item.term, action: parsed.data.status === "published" ? "publish" : "create", after: item, actor: admin });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = schema.partial().safeParse(payload);
  if (!validDocumentId(payload.id) || !parsed.success) return NextResponse.json({ error: "Invalid glossary update" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Glossary.findOne({ _id: payload.id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Glossary entry not found" }, { status: 404 });
  const expectedVersion = Number(payload.expectedVersion);
  const item = await Glossary.findOneAndUpdate({ _id: payload.id, deletedAt: null, ...(Number.isInteger(expectedVersion) ? { version: expectedVersion } : {}) }, { $set: parsed.data, $inc: { version: 1 } }, { new: true, runValidators: true });
  if (!item) return NextResponse.json({ error: "This glossary entry changed after you opened it. Reload before saving.", conflict: true }, { status: 409 });
  const action = parsed.data.status === "published" && before.status !== "published" ? "publish" : "update";
  await recordContentChange({ resourceType: "glossary", resourceId: String(item._id), resourceLabel: item.term, action, before, after: item, actor: admin });
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid glossary id" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await Glossary.findOne({ _id: id, deletedAt: null }).lean() as Record<string, unknown> | null;
  if (!before) return NextResponse.json({ error: "Glossary entry not found" }, { status: 404 });
  const item = await Glossary.findByIdAndUpdate(id, { $set: { deletedAt: new Date(), deletedBy: admin.email || admin.name }, $inc: { version: 1 } }, { new: true });
  await recordContentChange({ resourceType: "glossary", resourceId: id, resourceLabel: String(before.term), action: "delete", before, after: item, actor: admin, note: "Moved to recoverable trash" });
  return NextResponse.json({ deleted: true, recoverable: true });
}
