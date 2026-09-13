import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { RateLimit } from "@/lib/models/RateLimit";

export async function enforceRateLimit(request: NextRequest, scope: string, limit: number, windowMs: number) {
  if (!process.env.MONGODB_URI) return null;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identity = forwarded || request.headers.get("x-real-ip") || "unknown";
  const identityHash = crypto.createHmac("sha256", process.env.NEXTAUTH_SECRET || "rate-limit").update(identity).digest("hex");
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${scope}:${identityHash}:${bucket}`;
  try {
    await connectDB();
    const item = await RateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 1) * windowMs) } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean() as Record<string, unknown> | null;
    if (Number(item?.count ?? 0) <= limit) return null;
    const retryAfter = Math.max(1, Math.ceil((((bucket + 1) * windowMs) - Date.now()) / 1000));
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" } });
  } catch {
    return null;
  }
}
