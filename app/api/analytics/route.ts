import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Analytics } from "@/lib/models/Analytics";
import { requireAdmin } from "@/lib/api-auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const eventSchema = z.object({
  event: z.enum(["page_view", "article_open", "article_complete", "myth_interaction", "game_open", "cta_click"]),
  path: z.string().min(1).max(500),
  contentType: z.string().max(40).optional(),
  contentId: z.string().max(200).optional(),
  sessionId: z.string().max(100).optional(),
  durationSeconds: z.number().min(0).max(86_400).optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  const days = Math.min(Math.max(Number(request.nextUrl.searchParams.get("days") ?? 30), 1), 365);
  if (!process.env.MONGODB_URI) {
    const count = Math.min(days, 45);
    const daily = Array.from({ length: count }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (count - index - 1));
      const rhythm = 72 + ((index * 29) % 47) + Math.round(Math.sin(index / 2) * 18);
      return { _id: date.toISOString().slice(0, 10), views: rhythm, interactions: Math.round(rhythm * (.42 + (index % 4) * .04)) };
    });
    return NextResponse.json({
      configured: false,
      preview: true,
      days,
      totals: { page_view: 3428, article_open: 2164, article_complete: 1467, myth_interaction: 1189, game_open: 1049, cta_click: 386 },
      eventCounts: [],
      daily,
      topContent: [
        { _id: { type: "article", id: "paper-isnt-the-problem-waste-is" }, interactions: 842, averageDuration: 438 },
        { _id: { type: "article", id: "india-fibre-basket" }, interactions: 714, averageDuration: 401 },
        { _id: { type: "game", id: "truth-press" }, interactions: 286, averageDuration: 164 },
        { _id: { type: "myth", id: "fresh-fibre-and-recycling" }, interactions: 252, averageDuration: 86 },
        { _id: { type: "game", id: "hidden-paper" }, interactions: 241, averageDuration: 198 },
      ],
    });
  }
  await connectDB();
  const since = new Date(Date.now() - days * 86_400_000);
  const [eventCounts, daily, topContent] = await Promise.all([
    Analytics.aggregate([{ $match: { occurredAt: { $gte: since } } }, { $group: { _id: "$event", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Analytics.aggregate([{ $match: { occurredAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$occurredAt" } }, views: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } }, interactions: { $sum: { $cond: [{ $ne: ["$event", "page_view"] }, 1, 0] } } } }, { $sort: { _id: 1 } }]),
    Analytics.aggregate([{ $match: { occurredAt: { $gte: since }, contentId: { $exists: true, $ne: "" } } }, { $group: { _id: { type: "$contentType", id: "$contentId" }, interactions: { $sum: 1 }, averageDuration: { $avg: "$durationSeconds" } } }, { $sort: { interactions: -1 } }, { $limit: 20 }]),
  ]);
  const totals = Object.fromEntries(eventCounts.map(item => [item._id, item.count]));
  return NextResponse.json({ configured: true, preview: false, days, totals, eventCounts, daily, topContent });
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "public-analytics", 120, 60_000); if (limited) return limited;
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid analytics event" }, { status: 400 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ accepted: true, persisted: false }, { status: 202 });
  await connectDB();
  await Analytics.create({ ...parsed.data, occurredAt: new Date() });
  return NextResponse.json({ accepted: true, persisted: true }, { status: 201 });
}
