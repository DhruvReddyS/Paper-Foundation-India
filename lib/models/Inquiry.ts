import mongoose, { Schema } from "mongoose";

const InquirySchema = new Schema({
  type: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  sourceUrl: String,
  status: { type: String, enum: ["new", "reviewing", "resolved", "archived"], default: "new", index: true },
  internalNotes: String,
}, { timestamps: true });

export const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
