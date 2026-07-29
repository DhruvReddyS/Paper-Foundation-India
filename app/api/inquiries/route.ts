import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Inquiry } from "@/lib/models/Inquiry";
import { inquirySchema } from "@/lib/validators/inquiry";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], source: "unconfigured" });
  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  const items = await Inquiry.find(status ? { status } : {}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const parsed = inquirySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid correspondence", issues: parsed.error.flatten() }, { status: 400 });
  if (!process.env.MONGODB_URI) {
    if (process.env.NODE_ENV !== "production") return NextResponse.json({ accepted: true, preview: true }, { status: 202 });
    return NextResponse.json({ error: "Correspondence service is not configured" }, { status: 503 });
  }
  await connectDB();
  const item = await Inquiry.create(parsed.data);
  return NextResponse.json({ accepted: true, id: item.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  if (!payload.id) return NextResponse.json({ error: "Missing inquiry id" }, { status: 400 });
  await connectDB();
  const item = await Inquiry.findByIdAndUpdate(payload.id, { status: payload.status, internalNotes: payload.internalNotes }, { new: true, runValidators: true }).lean();
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
}
