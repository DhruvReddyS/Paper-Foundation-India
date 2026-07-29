import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { connectDB } from "@/lib/db";
import { unsubscribeToken } from "@/lib/gmail";
import { Subscriber } from "@/lib/models/Subscriber";

export async function POST(request: NextRequest) {
  const { email, token } = await request.json().catch(() => ({}));
  const expected = email ? unsubscribeToken(String(email)) : "";
  if (!email || !token || expected.length !== String(token).length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(token)))) return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
  if (process.env.MONGODB_URI) {
    await connectDB();
    await Subscriber.findOneAndUpdate({ email: String(email).toLowerCase() }, { status: "unsubscribed", unsubscribedAt: new Date() });
  }
  return NextResponse.json({ unsubscribed: true });
}
