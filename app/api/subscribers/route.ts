import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Subscriber } from "@/lib/models/Subscriber";
import { requireAdmin, requireEditor } from "@/lib/api-auth";
import { validDocumentId } from "@/lib/validators/id";

const schema = z.object({ email: z.string().email(), name: z.string().max(120).optional(), source: z.string().max(80).optional(), tags: z.array(z.string()).optional() });
const updateSchema = z.object({ id: z.string().min(1), status: z.enum(["active", "unsubscribed", "bounced"]).optional(), tags: z.array(z.string().trim().min(1).max(60)).max(30).optional(), notes: z.string().max(3000).optional(), name: z.string().max(120).optional() });

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false });
  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  const items = await Subscriber.find(status ? { status } : {}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items, configured: true });
}

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ accepted: true, persisted: false }, { status: 202 });
  await connectDB();
  const item = await Subscriber.findOneAndUpdate({ email: parsed.data.email.toLowerCase() }, { ...parsed.data, status: "active", subscribedAt: new Date() }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Invalid subscriber update", issues: parsed.success ? undefined : parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const { id, ...changes } = parsed.data;
  const update = { ...changes, ...(changes.status === "unsubscribed" ? { unsubscribedAt: new Date() } : changes.status === "active" ? { unsubscribedAt: null } : {}) };
  const item = await Subscriber.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
  if (!item) return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid subscriber id" }, { status: 400 });
  await connectDB();
  const item = await Subscriber.findByIdAndDelete(id);
  return item ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
}
