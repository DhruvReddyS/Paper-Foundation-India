import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { gameCatalog } from "@/components/games/gameCatalog";
import { connectDB } from "@/lib/db";
import { GameConfig } from "@/lib/models/GameConfig";
import { currentAdmin, requireEditor } from "@/lib/api-auth";
import { recordContentChange } from "@/lib/content-history";

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
  const stored = await GameConfig.find({ deletedAt: null }).sort({ order: 1 }).select("-revisionNote -lastEditedBy").lean();
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
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await GameConfig.findOne({ gameId: parsed.data.gameId }).lean() as Record<string, unknown> | null;
  const item = await GameConfig.findOneAndUpdate({ gameId: parsed.data.gameId }, { $set: { ...parsed.data, deletedAt: null, deletedBy: "", lastEditedBy: admin.email || admin.name }, $inc: { revision: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }).lean() as Record<string, unknown> | null;
  if (!item) return NextResponse.json({ error: "Game configuration could not be saved" }, { status: 409 });
  await recordContentChange({ resourceType: "game", resourceId: String(item._id), resourceLabel: String(item.title), action: before ? "update" : "create", before, after: item, actor: admin, note: parsed.data.revisionNote });
  return NextResponse.json({ item });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  if (!Array.isArray(payload.order)) return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const before = await GameConfig.find({ gameId: { $in: payload.order }, deletedAt: null }).lean() as Record<string, unknown>[];
  const changed = await Promise.all(payload.order.map((gameId: string, order: number) => GameConfig.findOneAndUpdate({ gameId, deletedAt: null }, { $set: { order, lastEditedBy: admin.email || admin.name }, $inc: { revision: 1 } }, { new: true }).lean() as Promise<Record<string, unknown> | null>));
  await Promise.all(changed.map(item => item ? recordContentChange({ resourceType: "game", resourceId: String(item._id), resourceLabel: String(item.title), action: "reorder", before: before.find(previous => previous.gameId === item.gameId), after: item, actor: admin }) : Promise.resolve()));
  return NextResponse.json({ updated: true });
}
