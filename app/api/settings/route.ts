import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { currentAdmin, requireAdmin, requireEditor } from "@/lib/api-auth";
import { z } from "zod";
import { changedContentFields, contentSnapshot, recordContentChange } from "@/lib/content-history";

const settingSchema = z.object({
  key: z.string().regex(/^public\.(brand|navigation|footer|contact|home)\.[a-z0-9.-]+$/).max(120),
  value: z.union([z.string().max(5000), z.array(z.object({ id: z.string().max(80), label: z.string().max(120).optional(), enabled: z.boolean() })).max(30)]),
  description: z.string().max(300).optional(),
});
const settingsPayloadSchema = z.union([settingSchema, z.object({ items: z.array(settingSchema).min(1).max(50) })]);

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ items: [], configured: false });
  await connectDB();
  return NextResponse.json({ items: await SiteSetting.find({ deletedAt: null }).sort({ key: 1 }).lean(), configured: true });
}

export async function PUT(request: NextRequest) {
  const denied = await requireEditor(); if (denied) return denied;
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const parsed = settingsPayloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid public website setting", issues: parsed.error.flatten() }, { status: 400 });
  await connectDB();
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  const items = "items" in parsed.data ? parsed.data.items : [parsed.data];
  const beforeItems = await SiteSetting.find({ key: { $in: items.map(item => item.key) } }).lean();
  const beforeByKey = new Map(beforeItems.map(item => [item.key, item]));
  await SiteSetting.bulkWrite(items.map(item => ({ updateOne: { filter: { key: item.key }, update: { $set: { ...item, deletedAt: null, deletedBy: "", updatedBy: admin.email || admin.name }, $inc: { version: 1 } }, upsert: true } })), { ordered: true });
  const afterItems = await SiteSetting.find({ key: { $in: items.map(item => item.key) } }).lean();
  await Promise.all(afterItems.map(after => {
    const before = beforeByKey.get(after.key);
    const changed = changedContentFields(contentSnapshot(before), contentSnapshot(after));
    return changed.length ? recordContentChange({ resourceType: "setting", resourceId: String(after._id), resourceLabel: after.key, action: before ? "update" : "create", before, after, actor: admin }) : Promise.resolve();
  }));
  return NextResponse.json({ updated: items.length });
}
