import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  name: { type: String, trim: true },
  status: { type: String, enum: ["pending", "active", "unsubscribed", "bounced", "complained"], default: "pending", index: true },
  source: { type: String, default: "website" },
  tags: [String],
  subscribedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  confirmationTokenHash: { type: String, select: false },
  confirmationExpiresAt: { type: Date, select: false },
  unsubscribedAt: Date,
  preferences: {
    topics: [String],
    frequency: { type: String, enum: ["weekly", "monthly", "important-only"], default: "monthly" },
    language: { type: String, default: "en" },
  },
  consent: {
    version: { type: String, default: "newsletter-v1" },
    recordedAt: Date,
    source: String,
  },
  notes: String,
}, { timestamps: true });

export const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
