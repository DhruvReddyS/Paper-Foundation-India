import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { confirmationTokenHash } from "@/lib/gmail";
import { Subscriber } from "@/lib/models/Subscriber";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  const token = request.nextUrl.searchParams.get("token");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  if (!email || !token || !process.env.MONGODB_URI) return NextResponse.redirect(new URL("/?newsletter=invalid", origin));
  await connectDB();
  const item = await Subscriber.findOneAndUpdate({ email, status: "pending", confirmationTokenHash: confirmationTokenHash(token), confirmationExpiresAt: { $gt: new Date() } }, { $set: { status: "active", confirmedAt: new Date(), subscribedAt: new Date(), confirmationTokenHash: null, confirmationExpiresAt: null, unsubscribedAt: null } }, { new: true });
  return NextResponse.redirect(new URL(item ? "/?newsletter=confirmed" : "/?newsletter=invalid", origin));
}
