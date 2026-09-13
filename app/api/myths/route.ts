import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Myth } from "@/lib/models/Myth";
import { mythSchema } from "@/lib/validators/myth";
import { validDocumentId } from "@/lib/validators/id";
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
    const items = await Myth.find(status !== "all" ? { status } : {}).sort({ order: 1, featured: -1, publishedAt: -1, createdAt: -1 }).lean();
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
  const item = await Myth.create({ ...parsed.data, lastEditedBy: admin?.email || admin?.name, ...(parsed.data.status === "published" ? { publishedAt: new Date() } : {}) });
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
  const update = { ...parsed.data, lastEditedBy: admin?.email || admin?.name, ...(parsed.data.status === "published" ? { publishedAt: new Date() } : {}) };
  const item = await Myth.findByIdAndUpdate(payload.id, update, { new: true, runValidators: true });
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Myth not found" }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid myth id" }, { status: 400 });
  await connectDB();
  const item = await Myth.findByIdAndDelete(id);
  return item ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Myth not found" }, { status: 404 });
}
