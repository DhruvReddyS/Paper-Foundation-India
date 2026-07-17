import mongoose, { Schema } from "mongoose";

const MythSchema = new Schema({
  claim: { type: String, required: true, trim: true },
  verdict: { type: String, enum: ["myth", "fact", "context"], required: true },
  correction: { type: String, required: true },
  explanation: { type: String, required: true },
  category: { type: String, required: true, index: true },
  sources: [{ label: String, url: String }],
  tags: [String],
  status: { type: String, enum: ["draft", "review", "published", "archived"], default: "draft", index: true },
  featured: { type: Boolean, default: false },
  publishedAt: Date,
}, { timestamps: true });

export const Myth = mongoose.models.Myth || mongoose.model("Myth", MythSchema);
