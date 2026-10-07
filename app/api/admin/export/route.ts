import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { recordAuditEvent } from "@/lib/content-history";
import { AdminUser } from "@/lib/models/AdminUser";
import { Analytics } from "@/lib/models/Analytics";
import { Article } from "@/lib/models/Article";
import { AuditEvent } from "@/lib/models/AuditEvent";
import { Campaign } from "@/lib/models/Campaign";
import { CampaignRecipient } from "@/lib/models/CampaignRecipient";
import { ContentRevision } from "@/lib/models/ContentRevision";
import { GameConfig } from "@/lib/models/GameConfig";
import { Glossary } from "@/lib/models/Glossary";
import { Inquiry } from "@/lib/models/Inquiry";
import { Media } from "@/lib/models/Media";
import { Myth } from "@/lib/models/Myth";
import { Resource } from "@/lib/models/Resource";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { Subscriber } from "@/lib/models/Subscriber";
import { WorkflowItem } from "@/lib/models/WorkflowItem";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const admin = await currentAdmin();
  if (!admin || admin.role !== "owner") return NextResponse.json({ error: "Owner access required" }, { status: 403 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  await connectDB();
  const [administrators, articles, myths, resources, glossary, games, settings, media, inquiries, subscribers, campaigns, campaignRecipients, workflow, revisions, audit, analytics] = await Promise.all([
    AdminUser.find().select("name username role active lastLoginAt createdBy createdAt updatedAt").lean(),
    Article.find().lean(), Myth.find().lean(), Resource.find().lean(), Glossary.find().lean(), GameConfig.find().lean(), SiteSetting.find().lean(), Media.find().lean(), Inquiry.find().lean(), Subscriber.find().lean(), Campaign.find().lean(), CampaignRecipient.find().lean(), WorkflowItem.find().lean(), ContentRevision.find().lean(), AuditEvent.find().lean(), Analytics.find().lean(),
  ]);
  const exportedAt = new Date().toISOString();
  const payload = JSON.stringify({ schemaVersion: 1, exportedAt, exportedBy: admin.email || admin.name, collections: { administrators, articles, myths, resources, glossary, games, settings, media, inquiries, subscribers, campaigns, campaignRecipients, workflow, revisions, audit, analytics } }, null, 2);
  if (Buffer.byteLength(payload) > 25 * 1024 * 1024) return NextResponse.json({ error: "The backup exceeds 25 MB. Use MongoDB Atlas export for this dataset." }, { status: 413 });
  await recordAuditEvent({ actor: admin, action: "system.backup_exported", resourceType: "system", resourceId: "cms", resourceLabel: "CMS owner backup", changedFields: [] });
  return new Response(payload, { headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="paper-foundation-cms-${exportedAt.slice(0, 10)}.json"`, "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff" } });
}
