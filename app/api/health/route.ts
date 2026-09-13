import { NextResponse } from "next/server";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { gmailConfigured } from "@/lib/gmail";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = { database: false, authentication: Boolean(process.env.NEXTAUTH_SECRET), media: cloudinaryConfigured(), campaigns: gmailConfigured(), automation: Boolean(process.env.CRON_SECRET) };
  try {
    const connection = await connectDB();
    await connection.connection.db?.admin().ping();
    services.database = true;
  } catch {}
  const ready = Object.values(services).every(Boolean);
  return NextResponse.json({ status: ready ? "ready" : "degraded", services, checkedAt: new Date().toISOString() }, { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
