import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Subscriber } from "@/lib/models/Subscriber";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { validDocumentId } from "@/lib/validators/id";
import crypto from "node:crypto";
import { confirmationTokenHash, gmailConfigured, sendSubscriptionConfirmation } from "@/lib/gmail";
import { enforceRateLimit } from "@/lib/rate-limit";
import { recordAuditEvent } from "@/lib/content-history";

const schema = z.object({ email: z.string().email(), name: z.string().max(120).optional(), source: z.string().max(80).optional(), tags: z.array(z.string()).optional(), topics: z.array(z.string().trim().min(1).max(60)).max(20).optional(), frequency: z.enum(["weekly", "monthly", "important-only"]).optional(), language: z.string().trim().min(2).max(12).optional() });
const updateSchema = z.object({ id: z.string().min(1), status: z.enum(["pending", "active", "unsubscribed", "bounced", "complained"]).optional(), tags: z.array(z.string().trim().min(1).max(60)).max(30).optional(), notes: z.string().max(3000).optional(), name: z.string().max(120).optional(), preferences: z.object({ topics: z.array(z.string().max(60)).max(20).optional(), frequency: z.enum(["weekly", "monthly", "important-only"]).optional(), language: z.string().min(2).max(12).optional() }).optional() });

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false });
  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  const items = await Subscriber.find(status ? { status } : {}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items, configured: true });
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "newsletter-subscribe", 5, 60 * 60_000); if (limited) return limited;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ accepted: true, persisted: false }, { status: 202 });
  if (!gmailConfigured()) return NextResponse.json({ error: "Newsletter confirmation email is not configured" }, { status: 503 });
  await connectDB();
  const email = parsed.data.email.toLowerCase();
  const existing = await Subscriber.findOne({ email }).lean() as Record<string, unknown> | null;
  if (existing?.status === "active") return NextResponse.json({ accepted: true, confirmationRequired: false });
  const token = crypto.randomBytes(32).toString("base64url");
  const confirmationExpiresAt = new Date(Date.now() + 24 * 60 * 60_000);
  const preferences = { topics: parsed.data.topics ?? [], frequency: parsed.data.frequency ?? "monthly", language: parsed.data.language ?? "en" };
  await Subscriber.findOneAndUpdate({ email }, { $set: { email, name: parsed.data.name, source: parsed.data.source ?? "website", tags: parsed.data.tags ?? [], preferences, status: "pending", confirmationTokenHash: confirmationTokenHash(token), confirmationExpiresAt, consent: { version: "newsletter-v1", recordedAt: new Date(), source: parsed.data.source ?? "website" }, unsubscribedAt: null }, $setOnInsert: { subscribedAt: new Date() } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  try {
    await sendSubscriptionConfirmation({ to: email, token });
  } catch {
    return NextResponse.json({ error: "We saved your request but could not send the confirmation yet. Please try again shortly." }, { status: 502 });
  }
  return NextResponse.json({ accepted: true, confirmationRequired: true }, { status: 202 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Invalid subscriber update", issues: parsed.success ? undefined : parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const { id, ...changes } = parsed.data;
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const update = { ...changes, ...(changes.status === "unsubscribed" ? { unsubscribedAt: new Date() } : changes.status === "active" ? { unsubscribedAt: null } : {}) };
  const item = await Subscriber.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean() as unknown as { _id: unknown; email: string } | null;
  if (!item) return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  await recordAuditEvent({ actor: admin, action: "subscriber.update", resourceType: "subscriber", resourceId: String(item._id), resourceLabel: item.email, changedFields: Object.keys(changes) });
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid subscriber id" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const item = await Subscriber.findByIdAndDelete(id);
  if (!item) return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  await recordAuditEvent({ actor: admin, action: "subscriber.delete", resourceType: "subscriber", resourceId: String(item._id), resourceLabel: item.email, changedFields: [] });
  return NextResponse.json({ deleted: true });
}
