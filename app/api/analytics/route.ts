import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyticsReport, clampDays } from "@/lib/analytics-report";
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
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  const days = clampDays(request.nextUrl.searchParams.get("days"));
  return NextResponse.json(await analyticsReport(days));
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
