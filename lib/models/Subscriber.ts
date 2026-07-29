import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  name: { type: String, trim: true },
  status: { type: String, enum: ["active", "unsubscribed", "bounced"], default: "active", index: true },
  source: { type: String, default: "website" },
  tags: [String],
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
  notes: String,
}, { timestamps: true });

export const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
