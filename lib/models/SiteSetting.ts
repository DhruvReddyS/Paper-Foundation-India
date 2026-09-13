import mongoose from "mongoose";

const SiteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  updatedBy: String,
  version: { type: Number, default: 1, min: 1 },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: String, default: "" },
}, { timestamps: true });

export const SiteSetting = mongoose.models.SiteSetting || mongoose.model("SiteSetting", SiteSettingSchema);
