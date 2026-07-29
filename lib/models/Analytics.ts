import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  event: { type: String, required: true, index: true },
  path: { type: String, required: true, index: true },
  contentType: { type: String, index: true },
  contentId: { type: String, index: true },
  sessionId: { type: String, index: true },
  durationSeconds: { type: Number, min: 0, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  occurredAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

AnalyticsSchema.index({ event: 1, contentType: 1, contentId: 1, occurredAt: -1 });

export const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
