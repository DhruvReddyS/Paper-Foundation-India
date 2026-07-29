import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Subscriber } from "@/lib/models/Subscriber";
import { requireAdmin } from "@/lib/api-auth";

const schema = z.object({ email: z.string().email(), name: z.string().max(120).optional(), source: z.string().max(80).optional(), tags: z.array(z.string()).optional() });

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
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  if (!payload.id) return NextResponse.json({ error: "Missing subscriber id" }, { status: 400 });
  await connectDB();
  const item = await Subscriber.findByIdAndUpdate(payload.id, { status: payload.status, tags: payload.tags, notes: payload.notes, ...(payload.status === "unsubscribed" ? { unsubscribedAt: new Date() } : {}) }, { new: true }).lean();
  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  await connectDB();
  await Subscriber.findByIdAndDelete(id);
  return NextResponse.json({ deleted: true });
}
