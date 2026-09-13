import mongoose from "mongoose";

const AuditEventSchema = new mongoose.Schema({
  actor: {
    id: String,
    name: String,
    email: String,
    role: String,
  },
  action: { type: String, required: true, index: true },
  resourceType: { type: String, required: true, index: true },
  resourceId: { type: String, required: true, index: true },
  resourceLabel: { type: String, required: true },
  changedFields: [String],
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

AuditEventSchema.index({ createdAt: -1 });
AuditEventSchema.index({ "actor.id": 1, createdAt: -1 });

export const AuditEvent = mongoose.models.AuditEvent || mongoose.model("AuditEvent", AuditEventSchema);
