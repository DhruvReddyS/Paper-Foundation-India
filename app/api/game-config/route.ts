import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { gameCatalog } from "@/components/games/gameCatalog";
import { connectDB } from "@/lib/db";
import { GameConfig } from "@/lib/models/GameConfig";
import { currentAdmin, requireEditor } from "@/lib/api-auth";

const schema = z.object({
  gameId: z.string().min(1),
  title: z.string().min(2),
  subtitle: z.string().default(""),
  description: z.string().default(""),
  instructions: z.array(z.string()).default([]),
  duration: z.string().default(""),
  difficulty: z.string().default(""),
  skill: z.string().default(""),
  enabled: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
  content: z.record(z.unknown()).default({}),
  revisionNote: z.string().max(500).optional(),
});

export async function GET() {
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: gameCatalog.map((game, order) => ({ ...game, gameId: game.id, enabled: true, order, instructions: [], content: {} })), source: "catalog" });
  await connectDB();
  const stored = await GameConfig.find().sort({ order: 1 }).select("-revisionNote -lastEditedBy").lean();
  if (!stored.length) return NextResponse.json({ items: gameCatalog.map((game, order) => ({ ...game, gameId: game.id, enabled: true, order, instructions: [], content: {} })), source: "catalog" });
  return NextResponse.json({ items: stored, source: "cms" });
}

export async function PUT(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid game configuration", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  const item = await GameConfig.findOneAndUpdate({ gameId: parsed.data.gameId }, { $set: { ...parsed.data, lastEditedBy: admin?.email || admin?.name }, $inc: { revision: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }).lean();
  return NextResponse.json({ item });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  if (!Array.isArray(payload.order)) return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  await connectDB();
  await Promise.all(payload.order.map((gameId: string, order: number) => GameConfig.findOneAndUpdate({ gameId }, { order }, { upsert: true })));
  return NextResponse.json({ updated: true });
}
