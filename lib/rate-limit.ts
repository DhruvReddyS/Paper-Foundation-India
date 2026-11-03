import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { RateLimit } from "@/lib/models/RateLimit";

/**
 * Counts one attempt against a caller and says whether they are over the
 * limit. Separate from enforceRateLimit because the credentials provider
 * never sees a NextRequest, and sign-in is the endpoint that most needs
 * limiting.
 *
 * Identities are stored as an HMAC rather than in the clear, so the table
 * cannot be read back as a list of visiting addresses.
 */
export async function consumeRateLimit(identity: string, scope: string, limit: number, windowMs: number) {
  const allowed = { limited: false, retryAfter: 0 };
  if (!process.env.MONGODB_URI) return allowed;

  const identityHash = crypto.createHmac("sha256", process.env.NEXTAUTH_SECRET || "rate-limit").update(identity).digest("hex");
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${scope}:${identityHash}:${bucket}`;
  try {
    await connectDB();
    const item = await RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 1) * windowMs) } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean() as Record<string, unknown> | null;
    if (Number(item?.count ?? 0) <= limit) return allowed;
    return { limited: true, retryAfter: Math.max(1, Math.ceil((((bucket + 1) * windowMs) - Date.now()) / 1000)) };
  } catch {
    // A limiter that fails closed would take the whole site down with the
    // database, which is a worse outcome than an unlimited window.
    return allowed;
  }
}

/** The address a request appears to come from, behind a proxy or otherwise. */
export function requestIdentity(headers: { get(name: string): string | null }) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

export async function enforceRateLimit(request: NextRequest, scope: string, limit: number, windowMs: number) {
  const { limited, retryAfter } = await consumeRateLimit(requestIdentity(request.headers), scope, limit, windowMs);
  if (!limited) return null;
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" } },
  );
}
