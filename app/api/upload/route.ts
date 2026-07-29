import { NextRequest, NextResponse } from "next/server";
import { cloudinaryConfigured, uploadAsset } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { Media } from "@/lib/models/Media";
import { requireAdmin } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!cloudinaryConfigured()) return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 503 });
  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file to upload" }, { status: 400 });
  if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: "Files must be 20 MB or smaller" }, { status: 413 });
  const result = await uploadAsset(file, String(data.get("folder") || "paper-foundation"));
  const metadata = {
    publicId: result.public_id,
    assetId: result.asset_id,
    url: result.url,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    originalFilename: result.original_filename ?? file.name,
    alt: String(data.get("alt") || ""),
    caption: String(data.get("caption") || ""),
    folder: result.asset_folder ?? result.folder ?? "paper-foundation",
    tags: String(data.get("tags") || "").split(",").map(tag => tag.trim()).filter(Boolean),
  };
  if (process.env.MONGODB_URI) {
    await connectDB();
    const item = await Media.findOneAndUpdate({ publicId: metadata.publicId }, metadata, { upsert: true, new: true }).lean();
    return NextResponse.json({ item }, { status: 201 });
  }
  return NextResponse.json({ item: metadata, persisted: false }, { status: 201 });
}
