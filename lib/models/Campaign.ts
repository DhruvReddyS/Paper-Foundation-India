import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  previewText: { type: String, default: "" },
  body: { type: String, required: true },
  recipientTag: { type: String, default: "" },
  status: { type: String, enum: ["draft", "sending", "sent", "paused"], default: "draft", index: true },
  recipientCount: { type: Number, default: 0 },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  deliveredTo: [String],
  failures: [{ email: String, error: String, occurredAt: Date }],
  sentAt: Date,
  createdBy: String,
  updatedBy: String,
}, { timestamps: true });

export const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
