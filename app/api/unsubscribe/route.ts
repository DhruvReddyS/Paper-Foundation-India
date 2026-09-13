import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { connectDB } from "@/lib/db";
import { unsubscribeToken } from "@/lib/gmail";
import { Subscriber } from "@/lib/models/Subscriber";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "newsletter-unsubscribe", 20, 60 * 60_000); if (limited) return limited;
  const body = await request.json().catch(() => ({})) as { email?: string; token?: string };
  const email = body.email || request.nextUrl.searchParams.get("email") || "";
  const token = body.token || request.nextUrl.searchParams.get("token") || "";
  const expected = email ? unsubscribeToken(String(email)) : "";
  if (!email || !token || expected.length !== String(token).length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(token)))) return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
  if (process.env.MONGODB_URI) {
    await connectDB();
    await Subscriber.findOneAndUpdate({ email: String(email).toLowerCase() }, { status: "unsubscribed", unsubscribedAt: new Date() });
  }
  return NextResponse.json({ unsubscribed: true });
}
