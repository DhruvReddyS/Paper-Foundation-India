import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, requireEditor } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { gmailConfigured } from "@/lib/gmail";
import { Campaign } from "@/lib/models/Campaign";
import { validDocumentId } from "@/lib/validators/id";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  subject: z.string().trim().min(2).max(180),
  previewText: z.string().max(240).default(""),
  body: z.string().min(10).max(50_000),
  recipientTag: z.string().max(80).default(""),
});
const actionSchema = z.object({ id: z.string().min(1), action: z.enum(["pause", "resume"]) });

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false, gmailConfigured: gmailConfigured() });
  await connectDB();
  return NextResponse.json({ items: await Campaign.find().sort({ updatedAt: -1 }).limit(100).lean(), configured: true, gmailConfigured: gmailConfigured() });
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the campaign name, subject and message" }, { status: 400 });
  await connectDB();
  return NextResponse.json({ item: await Campaign.create(parsed.data) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  const parsed = schema.partial().safeParse(payload);
  if (!validDocumentId(payload.id) || !parsed.success) return NextResponse.json({ error: "Invalid campaign update" }, { status: 400 });
  await connectDB();
  const item = await Campaign.findOneAndUpdate({ _id: payload.id, status: { $in: ["draft", "paused"] } }, parsed.data, { new: true }).lean();
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Only draft or paused campaigns can be edited" }, { status: 409 });
}

export async function PUT(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !validDocumentId(parsed.data.id)) return NextResponse.json({ error: "Invalid campaign action" }, { status: 400 });
  await connectDB();
  const allowed = parsed.data.action === "pause" ? ["sending"] : ["paused"];
  const status = parsed.data.action === "pause" ? "paused" : "sending";
  const item = await Campaign.findOneAndUpdate({ _id: parsed.data.id, status: { $in: allowed } }, { status }, { new: true }).lean();
  return item ? NextResponse.json({ item }) : NextResponse.json({ error: `Campaign cannot ${parsed.data.action} from its current state` }, { status: 409 });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!validDocumentId(id)) return NextResponse.json({ error: "Invalid campaign id" }, { status: 400 });
  await connectDB();
  const item = await Campaign.findOneAndDelete({ _id: id, status: { $in: ["draft", "paused"] } });
  return item ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Only draft or paused campaigns can be deleted" }, { status: 409 });
}
