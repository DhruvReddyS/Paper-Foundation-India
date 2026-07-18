import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  type: { type: String, required: true, index: true },
  source: { type: String, required: true, index: true },
  publisher: { type: String, required: true },
  date: { type: String, required: true },
  format: { type: String, required: true },
  href: { type: String, required: true },
  accent: { type: String, enum: ["green", "copper", "sage", "kraft"], default: "green" },
  status: { type: String, enum: ["draft", "published"], default: "published", index: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Resource = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
