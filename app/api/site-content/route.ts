import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";

export async function GET() {
  if (!process.env.MONGODB_URI) return NextResponse.json({ settings: {}, configured: false });
  try {
    await connectDB();
    const items = await SiteSetting.find({ key: /^public\./, deletedAt: null }).lean();
    return NextResponse.json({ settings: Object.fromEntries(items.map(item => [item.key, item.value])), configured: true }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ settings: {}, configured: false, source: "defaults" }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
  }
}
