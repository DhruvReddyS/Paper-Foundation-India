import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { recordAuditEvent } from "@/lib/content-history";
import { WorkflowItem } from "@/lib/models/WorkflowItem";
import { AdminUser } from "@/lib/models/AdminUser";
import { Article } from "@/lib/models/Article";
import { Myth } from "@/lib/models/Myth";
import { Resource } from "@/lib/models/Resource";
import { Glossary } from "@/lib/models/Glossary";
import { GameConfig } from "@/lib/models/GameConfig";
import { Campaign } from "@/lib/models/Campaign";
import { validDocumentId } from "@/lib/validators/id";

const resourceType = z.enum(["article", "myth", "resource", "glossary", "game", "website", "campaign"]);
const createSchema = z.object({ resourceType, resourceId: z.string().min(1).max(120), resourceLabel: z.string().trim().min(2).max(200), description: z.string().max(3000).default(""), priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"), assigneeId: z.string().max(80).default(""), reviewerId: z.string().max(80).default(""), dueAt: z.string().datetime().optional() });
const updateSchema = z.object({ id: z.string().min(1), expectedVersion: z.number().int().min(1), status: z.enum(["backlog", "in_progress", "in_review", "changes_requested", "approved", "done"]).optional(), priority: z.enum(["low", "normal", "high", "urgent"]).optional(), assigneeId: z.string().max(80).optional(), reviewerId: z.string().max(80).optional(), dueAt: z.string().datetime().nullable().optional(), description: z.string().max(3000).optional(), comment: z.string().trim().min(1).max(2000).optional() });

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], users: [], resources: [], configured: false });
  await connectDB();
  const [items, users, articles, myths, resources, glossary, games, campaigns] = await Promise.all([
    WorkflowItem.find().sort({ status: 1, priority: -1, dueAt: 1, updatedAt: -1 }).limit(200).lean(),
    AdminUser.find({ active: true }).select("name username role").sort({ name: 1 }).lean(),
    Article.find({ deletedAt: null }).select("title").sort({ updatedAt: -1 }).limit(100).lean(),
    Myth.find({ deletedAt: null }).select("claim").sort({ updatedAt: -1 }).limit(100).lean(),
    Resource.find({ deletedAt: null }).select("title").sort({ updatedAt: -1 }).limit(100).lean(),
    Glossary.find({ deletedAt: null }).select("term").sort({ updatedAt: -1 }).limit(100).lean(),
    GameConfig.find({ deletedAt: null }).select("title").sort({ order: 1 }).limit(100).lean(),
    Campaign.find().select("name").sort({ updatedAt: -1 }).limit(100).lean(),
  ]);
  const choices = [
    ...articles.map(item => ({ resourceType: "article", resourceId: String(item._id), resourceLabel: item.title })),
    ...myths.map(item => ({ resourceType: "myth", resourceId: String(item._id), resourceLabel: item.claim })),
    ...resources.map(item => ({ resourceType: "resource", resourceId: String(item._id), resourceLabel: item.title })),
    ...glossary.map(item => ({ resourceType: "glossary", resourceId: String(item._id), resourceLabel: item.term })),
    ...games.map(item => ({ resourceType: "game", resourceId: String(item._id), resourceLabel: item.title })),
    ...campaigns.map(item => ({ resourceType: "campaign", resourceId: String(item._id), resourceLabel: item.name })),
    { resourceType: "website", resourceId: "public-website", resourceLabel: "Public website controls" },
  ];
  return NextResponse.json({ items, users, resources: choices, configured: true });
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose content and complete the assignment", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  if ((parsed.data.assigneeId && !validDocumentId(parsed.data.assigneeId)) || (parsed.data.reviewerId && !validDocumentId(parsed.data.reviewerId))) return NextResponse.json({ error: "Choose valid team members" }, { status: 400 });
  if (parsed.data.assigneeId && parsed.data.assigneeId === parsed.data.reviewerId) return NextResponse.json({ error: "Choose a different reviewer so approval remains independent" }, { status: 400 });
  const [assignee, reviewer, existing] = await Promise.all([parsed.data.assigneeId ? AdminUser.findById(parsed.data.assigneeId).lean() : null, parsed.data.reviewerId ? AdminUser.findById(parsed.data.reviewerId).lean() : null, WorkflowItem.exists({ resourceType: parsed.data.resourceType, resourceId: parsed.data.resourceId })]) as unknown as [{ name?: string } | null, { name?: string } | null, unknown];
  if (existing) return NextResponse.json({ error: "This content already has a workflow assignment" }, { status: 409 });
  const item = await WorkflowItem.create({ ...parsed.data, dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null, assigneeName: assignee?.name ?? "", reviewerName: reviewer?.name ?? "", updatedBy: admin.email || admin.name, createdBy: admin.email || admin.name, version: 1 });
  await recordAuditEvent({ actor: admin, action: "workflow.assign", resourceType: parsed.data.resourceType, resourceId: parsed.data.resourceId, resourceLabel: parsed.data.resourceLabel, changedFields: ["assigneeId", "reviewerId", "dueAt", "priority"] });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Invalid workflow update" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const { id, expectedVersion, comment, ...changes } = parsed.data;
  if ((changes.assigneeId && !validDocumentId(changes.assigneeId)) || (changes.reviewerId && !validDocumentId(changes.reviewerId))) return NextResponse.json({ error: "Choose valid team members" }, { status: 400 });
  const existing = await WorkflowItem.findById(id).select("assigneeId reviewerId").lean() as unknown as { assigneeId?: string; reviewerId?: string } | null;
  if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  const nextAssignee = changes.assigneeId === undefined ? existing.assigneeId ?? "" : changes.assigneeId;
  const nextReviewer = changes.reviewerId === undefined ? existing.reviewerId ?? "" : changes.reviewerId;
  if (nextAssignee && nextAssignee === nextReviewer) return NextResponse.json({ error: "Choose a different reviewer so approval remains independent" }, { status: 400 });
  if (changes.status && ["approved", "done"].includes(changes.status) && admin.role !== "owner" && nextReviewer !== admin.id) return NextResponse.json({ error: "Only the assigned reviewer or an owner can approve this work" }, { status: 403 });
  const [assignee, reviewer] = await Promise.all([changes.assigneeId ? AdminUser.findById(changes.assigneeId).lean() : null, changes.reviewerId ? AdminUser.findById(changes.reviewerId).lean() : null]) as unknown as Array<{ name?: string } | null>;
  const set: Record<string, unknown> = { ...changes, updatedBy: admin.email || admin.name };
  if (changes.assigneeId !== undefined) set.assigneeName = assignee?.name ?? "";
  if (changes.reviewerId !== undefined) set.reviewerName = reviewer?.name ?? "";
  if (changes.dueAt !== undefined) set.dueAt = changes.dueAt ? new Date(changes.dueAt) : null;
  const update: Record<string, unknown> = { $set: set, $inc: { version: 1 } };
  if (comment) update.$push = { comments: { body: comment, authorId: admin.id, authorName: admin.name || admin.email, createdAt: new Date() } };
  const item = await WorkflowItem.findOneAndUpdate({ _id: id, version: expectedVersion }, update, { new: true, runValidators: true }).lean() as Record<string, unknown> | null;
  if (!item) return NextResponse.json({ error: "This assignment changed after you opened it. Reload before saving.", conflict: true }, { status: 409 });
  await recordAuditEvent({ actor: admin, action: comment ? "workflow.comment" : "workflow.update", resourceType: String(item.resourceType), resourceId: String(item.resourceId), resourceLabel: String(item.resourceLabel), changedFields: [...Object.keys(changes), ...(comment ? ["comments"] : [])] });
  return NextResponse.json({ item });
}
