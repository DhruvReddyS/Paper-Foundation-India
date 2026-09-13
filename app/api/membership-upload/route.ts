import { NextRequest, NextResponse } from "next/server";
import { cloudinaryConfigured, uploadAsset } from "@/lib/cloudinary";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_PDF_BYTES = 8 * 1024 * 1024;

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "").slice(0, 180) || "membership-application.pdf";
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "membership-upload", 5, 60 * 60_000); if (limited) return limited;
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a completed PDF to upload." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: "The PDF must be smaller than 8 MB." }, { status: 400 });
  }
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF applications are accepted." }, { status: 400 });
  }

  const signature = Buffer.from(await file.slice(0, 5).arrayBuffer()).toString("ascii");
  if (signature !== "%PDF-") {
    return NextResponse.json({ error: "This file is not a valid PDF." }, { status: 400 });
  }
  if (!cloudinaryConfigured()) {
    return NextResponse.json({ error: "Secure document upload is not configured yet." }, { status: 503 });
  }

  try {
    const uploaded = await uploadAsset(file, "paper-foundation/membership-applications");
    return NextResponse.json({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      name: safeFileName(file.name),
      bytes: uploaded.bytes,
    }, { status: 201 });
  } catch (error) {
    console.error("Membership PDF upload failed", error);
    return NextResponse.json({ error: "The PDF could not be uploaded. Please try again." }, { status: 502 });
  }
}
