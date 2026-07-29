import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false });
  await connectDB();
  return NextResponse.json({ items: await SiteSetting.find().sort({ key: 1 }).lean(), configured: true });
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const payload = await request.json();
  if (!payload.key || typeof payload.key !== "string") return NextResponse.json({ error: "Missing setting key" }, { status: 400 });
  await connectDB();
  const item = await SiteSetting.findOneAndUpdate({ key: payload.key }, { value: payload.value, description: payload.description }, { upsert: true, new: true }).lean();
  return NextResponse.json({ item });
}
