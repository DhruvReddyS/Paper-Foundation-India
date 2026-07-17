import mongoose, { Schema } from "mongoose";

const ArticleSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  category: { type: String, required: true, index: true },
  format: { type: String, default: "Core lesson" },
  excerpt: { type: String, required: true },
  body: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  readingMinutes: { type: Number, default: 6, min: 1 },
  sources: [{ label: String, url: String }],
  tags: [{ type: String }],
  status: { type: String, enum: ["draft", "review", "published", "archived"], default: "draft", index: true },
  featured: { type: Boolean, default: false, index: true },
  publishedAt: Date,
  revisionNote: String,
}, { timestamps: true });

export const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);
