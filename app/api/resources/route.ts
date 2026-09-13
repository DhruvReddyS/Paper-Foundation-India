import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resourceCatalog } from "@/content/resources";
import { connectDB } from "@/lib/db";
import { Resource } from "@/lib/models/Resource";
import { requireAdmin, requireEditor } from "@/lib/api-auth";
import { validDocumentId } from "@/lib/validators/id";

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
    const items = await Resource.find(status === "all" ? {} : { status }).sort({ order: 1, createdAt: -1 }).lean();
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
  return NextResponse.json({ item: await Resource.create(parsed.data) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = schema.partial().safeParse(payload);
  if (!validDocumentId(payload.id) || !parsed.success) return NextResponse.json({ error: "Invalid resource update" }, { status: 400 });
  await connectDB();
  const item = await Resource.findByIdAndUpdate(payload.id, parsed.data, { new: true, runValidators: true });
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Resource not found" }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "CMS database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
  await connectDB();
  const item = await Resource.findByIdAndDelete(id);
  return item ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Resource not found" }, { status: 404 });
}
