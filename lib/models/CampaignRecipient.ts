import mongoose from "mongoose";

const CampaignRecipientSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true, index: true },
  subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber", required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, default: "" },
  status: { type: String, enum: ["queued", "sending", "sent", "failed", "suppressed"], default: "queued", index: true },
  attempts: { type: Number, default: 0 },
  nextAttemptAt: { type: Date, default: Date.now, index: true },
  claimedAt: Date,
  sentAt: Date,
  providerMessageId: String,
  lastError: String,
}, { timestamps: true });

CampaignRecipientSchema.index({ campaignId: 1, subscriberId: 1 }, { unique: true });
CampaignRecipientSchema.index({ campaignId: 1, status: 1, nextAttemptAt: 1 });

export const CampaignRecipient = mongoose.models.CampaignRecipient || mongoose.model("CampaignRecipient", CampaignRecipientSchema);
