import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { contentSnapshot, recordContentChange, restorableSnapshot, type HistoryResource } from "@/lib/content-history";
import { ContentRevision } from "@/lib/models/ContentRevision";
import { Article } from "@/lib/models/Article";
import { Myth } from "@/lib/models/Myth";
import { Resource } from "@/lib/models/Resource";
import { Glossary } from "@/lib/models/Glossary";
import { GameConfig } from "@/lib/models/GameConfig";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { validDocumentId } from "@/lib/validators/id";
import { AuditEvent } from "@/lib/models/AuditEvent";

const resourceTypes = ["article", "myth", "resource", "glossary", "game", "setting"] as const;
const restoreSchema = z.object({ revisionId: z.string().min(1) });
type RevisionRecord = { _id: unknown; resourceType: HistoryResource; resourceId: string; resourceLabel: string; action: string; before?: Record<string, unknown> | null; after?: Record<string, unknown> | null };

async function findResource(resourceType: HistoryResource, id: string) {
  const value = resourceType === "article" ? await Article.findById(id).lean()
    : resourceType === "myth" ? await Myth.findById(id).lean()
    : resourceType === "resource" ? await Resource.findById(id).lean()
    : resourceType === "glossary" ? await Glossary.findById(id).lean()
    : resourceType === "game" ? await GameConfig.findById(id).lean()
    : await SiteSetting.findById(id).lean();
  return contentSnapshot(value);
}

async function restoreResource(resourceType: HistoryResource, id: string, update: Record<string, unknown>, unset: Record<string, 1>) {
  const operation = { $set: update, ...(Object.keys(unset).length ? { $unset: unset } : {}) };
  const value = resourceType === "article" ? await Article.findByIdAndUpdate(id, operation, { new: true, runValidators: true }).lean()
    : resourceType === "myth" ? await Myth.findByIdAndUpdate(id, operation, { new: true, runValidators: true }).lean()
    : resourceType === "resource" ? await Resource.findByIdAndUpdate(id, operation, { new: true, runValidators: true }).lean()
    : resourceType === "glossary" ? await Glossary.findByIdAndUpdate(id, operation, { new: true, runValidators: true }).lean()
    : resourceType === "game" ? await GameConfig.findByIdAndUpdate(id, operation, { new: true, runValidators: true }).lean()
    : await SiteSetting.findByIdAndUpdate(id, operation, { new: true, runValidators: true }).lean();
  return contentSnapshot(value);
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false });
  const requestedType = request.nextUrl.searchParams.get("resourceType");
  const resourceId = request.nextUrl.searchParams.get("resourceId");
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 50)));
  const audit = request.nextUrl.searchParams.get("view") === "audit";
  const filter: Record<string, unknown> = {};
  if (requestedType && resourceTypes.includes(requestedType as typeof resourceTypes[number])) filter.resourceType = requestedType;
  if (resourceId) filter.resourceId = resourceId;
  await connectDB();
  const items = audit
    ? await AuditEvent.find(requestedType ? filter : {}).sort({ createdAt: -1 }).limit(limit).lean()
    : await ContentRevision.find(filter).sort({ createdAt: -1 }).limit(limit).select("-before").lean();
  return NextResponse.json({ items, configured: true, view: audit ? "audit" : "revisions" });
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = restoreSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.revisionId)) return NextResponse.json({ error: "Choose a valid revision" }, { status: 400 });
  await connectDB();
  const target = await ContentRevision.findById(parsed.data.revisionId).lean() as RevisionRecord | null;
  const targetSnapshot = target?.action === "delete" ? target.before : target?.after;
  if (!target || !targetSnapshot || !resourceTypes.includes(target.resourceType)) return NextResponse.json({ error: "This revision cannot be restored" }, { status: 409 });
  const current = await findResource(target.resourceType, target.resourceId);
  if (!current) return NextResponse.json({ error: "The original record no longer exists" }, { status: 404 });
  const update = restorableSnapshot(targetSnapshot);
  if (target.resourceType === "game") update.revision = Number(current.revision ?? 1) + 1;
  else update.version = Number(current.version ?? 1) + 1;
  const protectedFields = new Set(["_id", "__v", "createdAt", "updatedAt", "version", "revision"]);
  const unset = Object.fromEntries(Object.keys(current).filter(key => !protectedFields.has(key) && !(key in update)).map(key => [key, 1])) as Record<string, 1>;
  const restored = await restoreResource(target.resourceType, target.resourceId, update, unset);
  const admin = await currentAdmin();
  if (!admin || !restored) return NextResponse.json({ error: "Revision could not be restored" }, { status: 409 });
  await recordContentChange({ resourceType: target.resourceType, resourceId: target.resourceId, resourceLabel: target.resourceLabel, action: "restore", before: current, after: restored, actor: admin, note: `Restored revision ${String(target._id)}`, metadata: { restoredRevisionId: String(target._id) } });
  return NextResponse.json({ item: restored });
}
