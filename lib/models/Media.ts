import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  publicId: { type: String, required: true, unique: true, index: true },
  assetId: { type: String, index: true },
  url: { type: String, required: true },
  secureUrl: { type: String, required: true },
  resourceType: { type: String, default: "image", index: true },
  format: String,
  bytes: Number,
  width: Number,
  height: Number,
  originalFilename: String,
  alt: { type: String, default: "" },
  caption: { type: String, default: "" },
  folder: { type: String, default: "paper-foundation" },
  tags: [String],
  uploadedBy: String,
  usage: [{ contentType: String, contentId: String, field: String }],
}, { timestamps: true });

export const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);
