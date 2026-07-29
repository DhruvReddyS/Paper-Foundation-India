import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Myth } from "@/lib/models/Myth";
import { mythSchema } from "@/lib/validators/myth";
import { requireAdmin } from "@/lib/api-auth";
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
  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  if (status && status !== "published" && await requireAdmin()) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const items = await Myth.find(status && status !== "all" ? { status } : {}).sort({ order: 1, featured: -1, publishedAt: -1, createdAt: -1 }).lean();
  return NextResponse.json({ items, source: "cms" });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const parsed = mythSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid myth", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const item = await Myth.create(parsed.data);
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = mythSchema.partial().safeParse(payload);
  if (!payload.id || !parsed.success) return NextResponse.json({ error: "Invalid myth update" }, { status: 400 });
  await connectDB();
  const item = await Myth.findByIdAndUpdate(payload.id, parsed.data, { new: true, runValidators: true });
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Myth not found" }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing myth id" }, { status: 400 });
  await connectDB();
  const item = await Myth.findByIdAndDelete(id);
  return item ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Myth not found" }, { status: 404 });
}
