import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { gmailConfigured } from "@/lib/gmail";
import { Campaign } from "@/lib/models/Campaign";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  subject: z.string().trim().min(2).max(180),
  previewText: z.string().max(240).default(""),
  body: z.string().min(10).max(50_000),
  recipientTag: z.string().max(80).default(""),
});

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false, gmailConfigured: gmailConfigured() });
  await connectDB();
  return NextResponse.json({ items: await Campaign.find().sort({ updatedAt: -1 }).limit(100).lean(), configured: true, gmailConfigured: gmailConfigured() });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the campaign name, subject and message" }, { status: 400 });
  await connectDB();
  return NextResponse.json({ item: await Campaign.create(parsed.data) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  const payload = await request.json();
  const parsed = schema.partial().safeParse(payload);
  if (!payload.id || !parsed.success) return NextResponse.json({ error: "Invalid campaign update" }, { status: 400 });
  await connectDB();
  const item = await Campaign.findOneAndUpdate({ _id: payload.id, status: { $in: ["draft", "paused"] } }, parsed.data, { new: true }).lean();
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Only draft or paused campaigns can be edited" }, { status: 409 });
}
