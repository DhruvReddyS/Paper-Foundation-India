import { NextRequest, NextResponse } from "next/server";
import { deleteAsset } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { Media } from "@/lib/models/Media";
import { requireAdmin } from "@/lib/api-auth";

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
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  if (!payload.id) return NextResponse.json({ error: "Missing media id" }, { status: 400 });
  await connectDB();
  const item = await Media.findByIdAndUpdate(payload.id, { alt: payload.alt, caption: payload.caption, tags: payload.tags }, { new: true }).lean();
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing media id" }, { status: 400 });
  await connectDB();
  const item = await Media.findById(id);
  if (!item) return NextResponse.json({ error: "Media not found" }, { status: 404 });
  if (item.usage?.length) return NextResponse.json({ error: "This asset is still used by content" }, { status: 409 });
  await deleteAsset(item.publicId, item.resourceType);
  await item.deleteOne();
  return NextResponse.json({ deleted: true });
}
