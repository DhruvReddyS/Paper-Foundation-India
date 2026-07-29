import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";

export async function GET() {
  if (!process.env.MONGODB_URI) return NextResponse.json({ settings: {}, configured: false });
  await connectDB();
  const items = await SiteSetting.find({ key: /^public\./ }).lean();
  return NextResponse.json({ settings: Object.fromEntries(items.map(item => [item.key, item.value])), configured: true });
}
