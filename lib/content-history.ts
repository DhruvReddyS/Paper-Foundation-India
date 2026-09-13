import { AuditEvent } from "@/lib/models/AuditEvent";
import { ContentRevision } from "@/lib/models/ContentRevision";
import type { AdminRole } from "@/lib/api-auth";

export type HistoryResource = "article" | "myth" | "resource" | "glossary" | "game" | "setting";
export type HistoryAction = "create" | "update" | "publish" | "delete" | "restore" | "reorder";
export type HistoryActor = { id: string; name?: string | null; email?: string | null; role: AdminRole };

const ignoredFields = new Set(["_id", "__v", "createdAt", "updatedAt", "lastEditedBy", "updatedBy"]);

export function contentSnapshot(value: unknown): Record<string, unknown> | null {
  if (!value) return null;
  const serializable = typeof value === "object" && "toObject" in value && typeof (value as { toObject?: unknown }).toObject === "function"
    ? (value as { toObject: () => unknown }).toObject()
    : value;
  return JSON.parse(JSON.stringify(serializable)) as Record<string, unknown>;
}

export function changedContentFields(before: Record<string, unknown> | null, after: Record<string, unknown> | null) {
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  return [...keys].filter(key => !ignoredFields.has(key) && JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])).sort();
}

export async function recordContentChange(input: {
  resourceType: HistoryResource;
  resourceId: string;
  resourceLabel: string;
  action: HistoryAction;
  before?: unknown;
  after?: unknown;
  actor: HistoryActor;
  note?: string;
  metadata?: Record<string, unknown>;
}) {
  const before = contentSnapshot(input.before);
  const after = contentSnapshot(input.after);
  const changedFields = changedContentFields(before, after);
  const version = Math.max(1, Number(after?.version ?? before?.version ?? 1));
  const actor = { id: input.actor.id, name: input.actor.name ?? "", email: input.actor.email ?? "", role: input.actor.role };
  const [revision] = await Promise.all([
    ContentRevision.create({ ...input, before, after, changedFields, version, actor }),
    AuditEvent.create({ actor, action: input.action, resourceType: input.resourceType, resourceId: input.resourceId, resourceLabel: input.resourceLabel, changedFields, metadata: input.metadata ?? {} }),
  ]);
  return revision;
}

export async function recordAuditEvent(input: {
  actor: HistoryActor;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceLabel: string;
  changedFields?: string[];
  metadata?: Record<string, unknown>;
}) {
  return AuditEvent.create({ ...input, actor: { id: input.actor.id, name: input.actor.name ?? "", email: input.actor.email ?? "", role: input.actor.role }, changedFields: input.changedFields ?? [], metadata: input.metadata ?? {} });
}

export function restorableSnapshot(value: Record<string, unknown>) {
  const result = { ...value };
  for (const key of ["_id", "__v", "createdAt", "updatedAt"]) delete result[key];
  result.deletedAt = null;
  result.deletedBy = "";
  return result;
}
