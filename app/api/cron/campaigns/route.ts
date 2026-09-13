import { NextRequest, NextResponse } from "next/server";
import { processDueCampaigns } from "@/lib/campaign-worker";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized scheduler" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const results = await processDueCampaigns();
  return NextResponse.json({ processed: results.length, results, checkedAt: new Date().toISOString() });
}
