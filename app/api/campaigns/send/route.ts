import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/api-auth";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { gmailConfigured, sendGmail } from "@/lib/gmail";
import { Campaign } from "@/lib/models/Campaign";
import { Subscriber } from "@/lib/models/Subscriber";
import { validDocumentId } from "@/lib/validators/id";

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
  if (campaign.status === "sent") return NextResponse.json({ error: "This campaign has already been sent" }, { status: 409 });
  if (campaign.status === "paused" && !testEmail) return NextResponse.json({ error: "Resume this campaign before sending" }, { status: 409 });

  if (testEmail) {
    await sendGmail({ to: String(testEmail), name: "Test reader", subject: `[TEST] ${campaign.subject}`, previewText: campaign.previewText, body: campaign.body });
    return NextResponse.json({ tested: true });
  }

  const filter: Record<string, unknown> = { status: "active", email: { $nin: campaign.deliveredTo ?? [] } };
  if (campaign.recipientTag) filter.tags = campaign.recipientTag;
  const totalFilter = { status: "active", ...(campaign.recipientTag ? { tags: campaign.recipientTag } : {}) };
  const [recipients, recipientCount] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: 1 }).limit(25).lean(),
    Subscriber.countDocuments(totalFilter),
  ]);
  if (!recipients.length) {
    campaign.status = "sent";
    campaign.recipientCount = recipientCount;
    campaign.sentAt = new Date();
    await campaign.save();
    return NextResponse.json({ complete: true, sentCount: campaign.sentCount, failedCount: campaign.failedCount });
  }

  campaign.status = "sending";
  campaign.recipientCount = recipientCount;
  for (const recipient of recipients) {
    try {
      await sendGmail({ to: recipient.email, name: recipient.name || "", subject: campaign.subject, previewText: campaign.previewText, body: campaign.body });
      campaign.deliveredTo.push(recipient.email);
      campaign.sentCount += 1;
    } catch (error) {
      campaign.deliveredTo.push(recipient.email);
      campaign.failedCount += 1;
      campaign.failures.push({ email: recipient.email, error: error instanceof Error ? error.message : "Unknown error", occurredAt: new Date() });
    }
  }
  if (campaign.deliveredTo.length >= recipientCount) {
    campaign.status = "sent";
    campaign.sentAt = new Date();
  }
  await campaign.save();
  return NextResponse.json({ complete: campaign.status === "sent", sentCount: campaign.sentCount, failedCount: campaign.failedCount, remaining: Math.max(0, recipientCount - campaign.deliveredTo.length) });
}
