import mongoose from "mongoose";

const WorkflowCommentSchema = new mongoose.Schema({
  body: { type: String, required: true, maxlength: 2000 },
  authorId: String,
  authorName: String,
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const WorkflowItemSchema = new mongoose.Schema({
  resourceType: { type: String, required: true, enum: ["article", "myth", "resource", "glossary", "game", "website", "campaign"], index: true },
  resourceId: { type: String, required: true },
  resourceLabel: { type: String, required: true, trim: true },
  status: { type: String, enum: ["backlog", "in_progress", "in_review", "changes_requested", "approved", "done"], default: "backlog", index: true },
  priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal", index: true },
  assigneeId: { type: String, default: "", index: true },
  assigneeName: { type: String, default: "" },
  reviewerId: { type: String, default: "" },
  reviewerName: { type: String, default: "" },
  dueAt: Date,
  description: { type: String, default: "", maxlength: 3000 },
  comments: [WorkflowCommentSchema],
  version: { type: Number, default: 1, min: 1 },
  createdBy: String,
  updatedBy: String,
}, { timestamps: true });

WorkflowItemSchema.index({ resourceType: 1, resourceId: 1 }, { unique: true });
WorkflowItemSchema.index({ assigneeId: 1, status: 1, dueAt: 1 });

export const WorkflowItem = mongoose.models.WorkflowItem || mongoose.model("WorkflowItem", WorkflowItemSchema);
