import crypto from "node:crypto";
import { connectDB } from "@/lib/db";
import { gmailConfigured, sendGmail } from "@/lib/gmail";
import { Campaign } from "@/lib/models/Campaign";
import { CampaignRecipient } from "@/lib/models/CampaignRecipient";
import { Subscriber } from "@/lib/models/Subscriber";

const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 5;

export async function snapshotCampaignRecipients(campaignId: string) {
  await connectDB();
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");
  if (campaign.recipientSnapshotAt) return campaign.recipientCount;
  const filter = { status: "active", ...(campaign.recipientTag ? { tags: campaign.recipientTag } : {}) };
  const subscribers = await Subscriber.find(filter).select("_id email name").lean() as unknown as Array<{ _id: unknown; email: string; name?: string }>;
  if (subscribers.length) {
    await CampaignRecipient.bulkWrite(subscribers.map(subscriber => ({
      updateOne: {
        filter: { campaignId: campaign._id, subscriberId: subscriber._id },
        update: { $setOnInsert: { campaignId: campaign._id, subscriberId: subscriber._id, email: subscriber.email, name: subscriber.name ?? "", status: "queued", attempts: 0, nextAttemptAt: new Date() } },
        upsert: true,
      },
    })), { ordered: false });
  }
  campaign.recipientCount = subscribers.length;
  campaign.recipientSnapshotAt = new Date();
  await campaign.save();
  return subscribers.length;
}

export async function processCampaignBatch(campaignId: string) {
  if (!gmailConfigured()) throw new Error("Connect the official Gmail account first");
  await connectDB();
  const eligible = await Campaign.exists({ _id: campaignId, status: { $in: ["scheduled", "sending"] }, deliveryNotBefore: { $lte: new Date() } });
  if (!eligible) {
    const current = await Campaign.findById(campaignId).lean() as Record<string, unknown> | null;
    if (!current) throw new Error("Campaign not found");
    return { complete: current.status === "sent", waiting: current.status === "scheduled", locked: current.status === "sending", sentCount: Number(current.sentCount ?? 0), failedCount: Number(current.failedCount ?? 0), remaining: Math.max(0, Number(current.recipientCount ?? 0) - Number(current.sentCount ?? 0) - Number(current.failedCount ?? 0)) };
  }
  await snapshotCampaignRecipients(campaignId);
  const now = new Date();
  const lockToken = crypto.randomUUID();
  const lockExpired = new Date(now.getTime() - LOCK_MINUTES * 60_000);
  const campaign = await Campaign.findOneAndUpdate({
    _id: campaignId,
    status: { $in: ["scheduled", "sending"] },
    deliveryNotBefore: { $lte: now },
    $or: [{ lockedAt: null }, { lockedAt: { $exists: false } }, { lockedAt: { $lt: lockExpired } }],
  }, { $set: { status: "sending", lockedAt: now, lockToken, lastError: "" } }, { new: true });
  if (!campaign) {
    const current = await Campaign.findById(campaignId).lean() as Record<string, unknown> | null;
    if (!current) throw new Error("Campaign not found");
    return { complete: current.status === "sent", waiting: current.status === "scheduled", locked: current.status === "sending", sentCount: Number(current.sentCount ?? 0), failedCount: Number(current.failedCount ?? 0), remaining: Math.max(0, Number(current.recipientCount ?? 0) - Number(current.sentCount ?? 0) - Number(current.failedCount ?? 0)) };
  }

  try {
    const recipients = await CampaignRecipient.find({ campaignId: campaign._id, status: { $in: ["queued", "failed"] }, attempts: { $lt: MAX_ATTEMPTS }, nextAttemptAt: { $lte: now } }).sort({ createdAt: 1 }).limit(campaign.batchSize || 25);
    for (const recipient of recipients) {
      const claimed = await CampaignRecipient.findOneAndUpdate({ _id: recipient._id, status: { $in: ["queued", "failed"] }, attempts: { $lt: MAX_ATTEMPTS } }, { $set: { status: "sending", claimedAt: new Date() }, $inc: { attempts: 1 } }, { new: true });
      if (!claimed) continue;
      try {
        const active = await Subscriber.exists({ _id: claimed.subscriberId, status: "active" });
        if (!active) {
          await CampaignRecipient.updateOne({ _id: claimed._id }, { $set: { status: "suppressed", lastError: "Subscriber is no longer active" } });
          continue;
        }
        const result = await sendGmail({ to: claimed.email, name: claimed.name || "", subject: campaign.subject, previewText: campaign.previewText, body: campaign.body });
        await CampaignRecipient.updateOne({ _id: claimed._id }, { $set: { status: "sent", sentAt: new Date(), providerMessageId: result.id, lastError: "" } });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown delivery error";
        const terminal = claimed.attempts >= MAX_ATTEMPTS;
        const delayMinutes = Math.pow(2, Math.max(0, claimed.attempts - 1)) * 5;
        await CampaignRecipient.updateOne({ _id: claimed._id }, { $set: { status: "failed", lastError: message, nextAttemptAt: terminal ? new Date(8640000000000000) : new Date(Date.now() + delayMinutes * 60_000) } });
      }
    }

    const [sentCount, failedCount, remaining] = await Promise.all([
      CampaignRecipient.countDocuments({ campaignId: campaign._id, status: "sent" }),
      CampaignRecipient.countDocuments({ campaignId: campaign._id, status: "failed", attempts: { $gte: MAX_ATTEMPTS } }),
      CampaignRecipient.countDocuments({ campaignId: campaign._id, $or: [{ status: "queued" }, { status: "sending" }, { status: "failed", attempts: { $lt: MAX_ATTEMPTS } }] }),
    ]);
    const complete = remaining === 0;
    await Campaign.updateOne({ _id: campaign._id, lockToken }, { $set: { status: complete ? "sent" : "sending", sentCount, failedCount, ...(complete ? { sentAt: new Date() } : { nextRunAt: new Date(Date.now() + 60_000) }), lockedAt: null, lockToken: "" } });
    return { complete, sentCount, failedCount, remaining };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Campaign worker failed";
    await Campaign.updateOne({ _id: campaign._id, lockToken }, { $set: { lastError: message, lockedAt: null, lockToken: "", nextRunAt: new Date(Date.now() + 5 * 60_000) } });
    throw error;
  }
}

export async function processDueCampaigns(limit = 3) {
  await connectDB();
  const due = await Campaign.find({ status: { $in: ["scheduled", "sending"] }, deliveryNotBefore: { $lte: new Date() }, $or: [{ nextRunAt: null }, { nextRunAt: { $exists: false } }, { nextRunAt: { $lte: new Date() } }] }).sort({ deliveryNotBefore: 1 }).limit(limit).select("_id").lean() as Array<{ _id: unknown }>;
  const results = [];
  for (const campaign of due) {
    try { results.push({ campaignId: String(campaign._id), ...(await processCampaignBatch(String(campaign._id))) }); }
    catch (error) { results.push({ campaignId: String(campaign._id), error: error instanceof Error ? error.message : "Worker failed" }); }
  }
  return results;
}
