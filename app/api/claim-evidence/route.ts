import { NextRequest, NextResponse } from "next/server";
import { cloudinaryConfigured, deleteAsset, uploadAsset } from "@/lib/cloudinary";
import { enforceRateLimit } from "@/lib/rate-limit";
import { publicSubmissionIsSpam } from "@/lib/public-submission";
import { validateUploadFile } from "@/lib/file-security";

export const runtime = "nodejs";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "").slice(0, 180) || "claim-evidence";
}

/**
 * A claim report is far easier to verify with the original screenshot or
 * document attached. This is a public endpoint, so it follows the same
 * hardening as the membership upload: rate limited per address, byte
 * signatures checked against the declared type, scripted PDFs refused, and
 * nothing written to the database. The returned URL is submitted with the
 * report itself through /api/inquiries.
 */
export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "claim-evidence", 6, 60 * 60_000);
  if (limited) return limited;

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "The upload could not be read." }, { status: 400 });

  if (publicSubmissionIsSpam({ _website: form.get("_website"), formStartedAt: form.get("formStartedAt") })) {
    return NextResponse.json({ accepted: true }, { status: 202 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a screenshot or document to attach." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "That file is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Attachments must be 6 MB or smaller." }, { status: 413 });
  }

  const validation = await validateUploadFile(file, ALLOWED);
  if (!validation.safe) {
    return NextResponse.json({ error: validation.error }, { status: 415 });
  }
  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Evidence attachments are not available yet. Please describe the claim and paste its link instead." },
      { status: 503 }
    );
  }

  let uploaded: Awaited<ReturnType<typeof uploadAsset>> | null = null;
  try {
    uploaded = await uploadAsset(file, "paper-foundation/claim-evidence");
    return NextResponse.json(
      {
        accepted: true,
        url: uploaded.secure_url,
        name: safeFileName(file.name),
        bytes: uploaded.bytes,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Claim evidence upload failed", error);
    if (uploaded?.public_id) await deleteAsset(uploaded.public_id, uploaded.resource_type).catch(() => undefined);
    return NextResponse.json({ error: "The attachment could not be uploaded. Please try again." }, { status: 502 });
  }
}
