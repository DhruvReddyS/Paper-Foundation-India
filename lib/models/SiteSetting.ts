import mongoose from "mongoose";

const SiteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  updatedBy: String,
}, { timestamps: true });

export const SiteSetting = mongoose.models.SiteSetting || mongoose.model("SiteSetting", SiteSettingSchema);
