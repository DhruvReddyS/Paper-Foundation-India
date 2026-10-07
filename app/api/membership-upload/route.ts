import { NextRequest, NextResponse } from "next/server";
import { cloudinaryConfigured, deleteAsset, uploadAsset } from "@/lib/cloudinary";
import { enforceRateLimit } from "@/lib/rate-limit";
import { publicSubmissionIsSpam } from "@/lib/public-submission";
import { validateUploadFile } from "@/lib/file-security";
import { connectDB } from "@/lib/db";
import { Inquiry } from "@/lib/models/Inquiry";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_PDF_BYTES = 8 * 1024 * 1024;
const identitySchema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(180) });

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "").slice(0, 180) || "membership-application.pdf";
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "membership-upload", 5, 60 * 60_000); if (limited) return limited;
  const form = await request.formData();
  if (publicSubmissionIsSpam({ _website: form.get("_website"), formStartedAt: form.get("formStartedAt") })) return NextResponse.json({ accepted: true }, { status: 202 });
  const file = form.get("file");
  const identity = identitySchema.safeParse({ name: form.get("name"), email: form.get("email") });

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a completed PDF to upload." }, { status: 400 });
  }
  if (!identity.success) return NextResponse.json({ error: "Enter a valid name and email address." }, { status: 400 });
  if (file.size === 0 || file.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: "The PDF must be smaller than 8 MB." }, { status: 400 });
  }
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF applications are accepted." }, { status: 400 });
  }

  const validation = await validateUploadFile(file, ["application/pdf"]);
  if (!validation.safe) return NextResponse.json({ error: validation.error }, { status: 400 });
  if (!cloudinaryConfigured()) {
    return NextResponse.json({ error: "Secure document upload is not configured yet." }, { status: 503 });
  }
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Membership records are not configured yet." }, { status: 503 });

  let uploaded: Awaited<ReturnType<typeof uploadAsset>> | null = null;
  try {
    uploaded = await uploadAsset(file, "paper-foundation/membership-applications");
    await connectDB();
    const inquiry = await Inquiry.create({ type: "Membership Application", name: identity.data.name, email: identity.data.email, subject: "Signed membership PDF", message: "A completed and signed membership application PDF was uploaded through the public membership desk.", attachmentUrl: uploaded.secure_url, attachmentName: safeFileName(file.name) });
    return NextResponse.json({
      accepted: true,
      inquiryId: inquiry.id,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      name: safeFileName(file.name),
      bytes: uploaded.bytes,
    }, { status: 201 });
  } catch (error) {
    console.error("Membership PDF upload failed", error);
    if (uploaded?.public_id) await deleteAsset(uploaded.public_id, uploaded.resource_type).catch(() => undefined);
    return NextResponse.json({ error: "The PDF could not be uploaded. Please try again." }, { status: 502 });
  }
}
