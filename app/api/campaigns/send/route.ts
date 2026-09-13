import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/api-auth";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { gmailConfigured, sendGmail } from "@/lib/gmail";
import { Campaign } from "@/lib/models/Campaign";
import { validDocumentId } from "@/lib/validators/id";
import { processCampaignBatch } from "@/lib/campaign-worker";

export const runtime = "nodejs";
const sendSchema = z.object({ id: z.string().min(1), testEmail: z.string().email().optional() });

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!gmailConfigured()) return NextResponse.json({ error: "Connect the official Gmail account first" }, { status: 503 });
  const parsed = sendSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Choose a valid campaign and test email" }, { status: 400 });
  const { id, testEmail } = parsed.data;
  await connectDB();
  const campaign = await Campaign.findById(id);
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  if (["sent", "cancelled"].includes(campaign.status)) return NextResponse.json({ error: "This campaign can no longer be sent" }, { status: 409 });
  if (campaign.status === "paused" && !testEmail) return NextResponse.json({ error: "Resume this campaign before sending" }, { status: 409 });

  if (testEmail) {
    await sendGmail({ to: String(testEmail), name: "Test reader", subject: `[TEST] ${campaign.subject}`, previewText: campaign.previewText, body: campaign.body });
    return NextResponse.json({ tested: true });
  }

  if (campaign.status === "draft") return NextResponse.json({ error: "Schedule and approve this campaign before delivery" }, { status: 409 });
  return NextResponse.json(await processCampaignBatch(id));
}
