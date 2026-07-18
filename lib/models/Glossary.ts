import mongoose from "mongoose";

const GlossarySchema = new mongoose.Schema({
  term: { type: String, required: true, trim: true, unique: true },
  definition: { type: String, required: true, trim: true },
  letter: { type: String, required: true, uppercase: true, minlength: 1, maxlength: 1, index: true },
  status: { type: String, enum: ["draft", "published"], default: "published", index: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Glossary = mongoose.models.Glossary || mongoose.model("Glossary", GlossarySchema);
