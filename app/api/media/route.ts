import { NextRequest, NextResponse } from "next/server";
import { deleteAsset } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { Media } from "@/lib/models/Media";
import { requireAdmin, requireEditor } from "@/lib/api-auth";
import { Article } from "@/lib/models/Article";
import { Myth } from "@/lib/models/Myth";
import { z } from "zod";
import { validDocumentId } from "@/lib/validators/id";

const updateSchema = z.object({ id: z.string().min(1), alt: z.string().max(500).optional(), caption: z.string().max(1000).optional(), tags: z.array(z.string().trim().min(1).max(80)).max(30).optional() });

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false });
  await connectDB();
  const query = request.nextUrl.searchParams.get("q");
  const filter = query ? { $or: [{ originalFilename: { $regex: query, $options: "i" } }, { alt: { $regex: query, $options: "i" } }, { tags: query }] } : {};
  const items = await Media.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ items, configured: true });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Invalid media update", issues: parsed.success ? undefined : parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const { id, ...update } = parsed.data;
  const item = await Media.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Asset not found" }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid media id" }, { status: 400 });
  await connectDB();
  const item = await Media.findById(id);
  if (!item) return NextResponse.json({ error: "Media not found" }, { status: 404 });
  const escapedUrl = item.secureUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const referenced = item.usage?.length || await Article.exists({ $or: [{ coverImage: item.secureUrl }, { body: { $regex: escapedUrl } }] }) || await Myth.exists({ coverImage: item.secureUrl });
  if (referenced) return NextResponse.json({ error: "Remove this asset from content before deleting it" }, { status: 409 });
  await deleteAsset(item.publicId, item.resourceType);
  await item.deleteOne();
  return NextResponse.json({ deleted: true });
}
