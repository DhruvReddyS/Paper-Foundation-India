import { NextRequest, NextResponse } from "next/server";
import { articleCatalog } from "@/content/articleCatalog";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models/Article";
import { articleSchema } from "@/lib/validators/article";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: articleCatalog, source: "editorial-manifest" });
  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  if (status && status !== "published" && await requireAdmin()) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const category = request.nextUrl.searchParams.get("category");
  const filter = { ...(status && status !== "all" ? { status } : {}), ...(category ? { category } : {}) };
  const items = await Article.find(filter).sort({ order: 1, featured: -1, publishedAt: -1, createdAt: -1 }).lean();
  return NextResponse.json({ items, source: "cms" });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid article", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const item = await Article.create(parsed.data);
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = articleSchema.partial().safeParse(payload);
  if (!payload.id || !parsed.success) return NextResponse.json({ error: "Invalid article update" }, { status: 400 });
  await connectDB();
  const item = await Article.findByIdAndUpdate(payload.id, parsed.data, { new: true, runValidators: true });
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Article not found" }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing article id" }, { status: 400 });
  await connectDB();
  const item = await Article.findByIdAndDelete(id);
  return item ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Article not found" }, { status: 404 });
}
