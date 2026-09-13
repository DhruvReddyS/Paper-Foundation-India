import mongoose from "mongoose";

const ContentRevisionSchema = new mongoose.Schema({
  resourceType: { type: String, required: true, enum: ["article", "myth", "resource", "glossary", "game", "setting"], index: true },
  resourceId: { type: String, required: true, index: true },
  resourceLabel: { type: String, required: true, trim: true },
  action: { type: String, required: true, enum: ["create", "update", "publish", "delete", "restore", "reorder"], index: true },
  version: { type: Number, required: true, min: 1 },
  before: { type: mongoose.Schema.Types.Mixed, default: null },
  after: { type: mongoose.Schema.Types.Mixed, default: null },
  changedFields: [String],
  note: { type: String, default: "", maxlength: 500 },
  actor: {
    id: String,
    name: String,
    email: String,
    role: String,
  },
}, { timestamps: true });

ContentRevisionSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });

export const ContentRevision = mongoose.models.ContentRevision || mongoose.model("ContentRevision", ContentRevisionSchema);
