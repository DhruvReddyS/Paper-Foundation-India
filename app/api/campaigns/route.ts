import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { gmailConfigured } from "@/lib/gmail";
import { Campaign } from "@/lib/models/Campaign";
import { validDocumentId } from "@/lib/validators/id";
import { CampaignRecipient } from "@/lib/models/CampaignRecipient";
import { recordAuditEvent } from "@/lib/content-history";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  subject: z.string().trim().min(2).max(180),
  previewText: z.string().max(240).default(""),
  body: z.string().min(10).max(50_000),
  recipientTag: z.string().max(80).default(""),
});
const actionSchema = z.object({ id: z.string().min(1), action: z.enum(["schedule", "pause", "resume", "cancel"]), scheduledAt: z.string().datetime().optional() });

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false, gmailConfigured: gmailConfigured() });
  await connectDB();
  return NextResponse.json({ items: await Campaign.find().sort({ updatedAt: -1 }).limit(100).lean(), configured: true, gmailConfigured: gmailConfigured() });
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the campaign name, subject and message" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Campaign.create({ ...parsed.data, version: 1, createdBy: admin.email || admin.name, updatedBy: admin.email || admin.name });
  await recordAuditEvent({ actor: admin, action: "campaign.create", resourceType: "campaign", resourceId: String(item._id), resourceLabel: item.name, changedFields: ["name", "subject", "previewText", "body", "recipientTag"] });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = schema.partial().safeParse(payload);
  if (!validDocumentId(payload.id) || !parsed.success) return NextResponse.json({ error: "Invalid campaign update" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const expectedVersion = Number(payload.expectedVersion);
  const item = await Campaign.findOneAndUpdate({ _id: payload.id, status: "draft", ...(Number.isInteger(expectedVersion) ? { version: expectedVersion } : {}) }, { $set: { ...parsed.data, updatedBy: admin.email || admin.name }, $inc: { version: 1 } }, { new: true }).lean() as unknown as { _id: unknown; name: string } | null;
  if (!item) return NextResponse.json({ error: "This campaign changed or is no longer editable. Reload before saving.", conflict: true }, { status: 409 });
  await recordAuditEvent({ actor: admin, action: "campaign.update", resourceType: "campaign", resourceId: String(item._id), resourceLabel: String(item.name), changedFields: Object.keys(parsed.data) });
  return NextResponse.json({ item });
}

export async function PUT(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Invalid campaign action" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const now = new Date();
  const requested = parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : now;
  const deliveryNotBefore = new Date(Math.max(requested.getTime(), now.getTime() + 10 * 60_000));
  const rules = {
    schedule: { allowed: ["draft"], update: { status: "scheduled", scheduledAt: requested, deliveryNotBefore, approvedAt: now, approvedBy: admin.email || admin.name, nextRunAt: deliveryNotBefore, cancelledAt: null } },
    pause: { allowed: ["scheduled", "sending"], update: { status: "paused", lockedAt: null, lockToken: "" } },
    resume: { allowed: ["paused"], update: { status: "scheduled", deliveryNotBefore: now, nextRunAt: now } },
    cancel: { allowed: ["scheduled", "paused"], update: { status: "cancelled", cancelledAt: now, lockedAt: null, lockToken: "" } },
  } as const;
  const rule = rules[parsed.data.action];
  const item = await Campaign.findOneAndUpdate({ _id: parsed.data.id, status: { $in: rule.allowed } }, { $set: { ...rule.update, updatedBy: admin.email || admin.name }, $inc: { version: 1 } }, { new: true }).lean() as Record<string, unknown> | null;
  if (!item) return NextResponse.json({ error: `Campaign cannot ${parsed.data.action} from its current state` }, { status: 409 });
  await recordAuditEvent({ actor: admin, action: `campaign.${parsed.data.action}`, resourceType: "campaign", resourceId: String(item._id), resourceLabel: String(item.name), changedFields: ["status", "deliveryNotBefore"] });
  return NextResponse.json({ item, cancellationEndsAt: item.deliveryNotBefore });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid campaign id" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Campaign.findOneAndDelete({ _id: id, status: "draft" });
  if (!item) return NextResponse.json({ error: "Only unscheduled drafts can be deleted; cancel scheduled delivery instead" }, { status: 409 });
  await CampaignRecipient.deleteMany({ campaignId: id });
  await recordAuditEvent({ actor: admin, action: "campaign.delete", resourceType: "campaign", resourceId: String(item._id), resourceLabel: item.name, changedFields: [] });
  return NextResponse.json({ deleted: true });
}
