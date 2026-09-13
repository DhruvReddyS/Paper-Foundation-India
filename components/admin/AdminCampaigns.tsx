"use client";

import { Check, ChevronRight, Mail, Pause, Play, Plus, RefreshCw, Save, Send, Trash2, Users, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAccess } from "./AdminShell";

type Campaign = { _id: string; name: string; subject: string; previewText: string; body: string; recipientTag: string; status: string; recipientCount: number; sentCount: number; failedCount: number; updatedAt: string; scheduledAt?: string; deliveryNotBefore?: string; version?: number; lastError?: string };
type Subscriber = { email: string; status: string; tags?: string[] };
const blank = { name: "", subject: "", previewText: "", body: "Hello {{name}},\n\n", recipientTag: "" };

export default function AdminCampaigns() {
  const { canEdit } = useAdminAccess();
  const [items, setItems] = useState<Campaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [editing, setEditing] = useState<Campaign | "new" | null>(null);
  const [configured, setConfigured] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const load = useCallback(async () => {
    const [campaignResponse, subscriberResponse] = await Promise.all([fetch("/api/campaigns"), fetch("/api/subscribers")]);
    const campaignData = await campaignResponse.json();
    const subscriberData = await subscriberResponse.json();
    setItems(campaignData.items ?? []);
    setSubscribers(subscriberData.items ?? []);
    setConfigured(Boolean(campaignData.gmailConfigured));
    if (!campaignResponse.ok) setNotice(campaignData.error ?? "Campaigns could not be loaded.");
  }, []);
  useEffect(() => { void load(); }, [load]);
  const active = subscribers.filter(item => item.status === "active");
  const tags = [...new Set(active.flatMap(item => item.tags ?? []))].sort();

  async function action(campaign: Campaign, actionName: "schedule" | "pause" | "resume" | "cancel", scheduledAt?: string) {
    if (actionName === "schedule" && !confirm(`Queue “${campaign.subject}”? Delivery begins no sooner than 10 minutes, so it can still be cancelled.`)) return false;
    setBusy(campaign._id);
    const response = await fetch("/api/campaigns", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: campaign._id, action: actionName, ...(scheduledAt ? { scheduledAt: new Date(scheduledAt).toISOString() } : {}) }) });
    const result = await response.json();
    const messages = { schedule: "Campaign queued with a cancellation window.", pause: "Campaign paused.", resume: "Campaign resumed.", cancel: "Campaign cancelled before delivery." };
    setNotice(response.ok ? messages[actionName] : result.error ?? "Campaign action failed.");
    setBusy("");
    await load();
    return response.ok;
  }

  async function remove(campaign: Campaign) {
    if (!confirm(`Delete the draft “${campaign.name}”?`)) return;
    const response = await fetch(`/api/campaigns?id=${encodeURIComponent(campaign._id)}`, { method: "DELETE" });
    const result = await response.json();
    setNotice(response.ok ? "Campaign draft deleted." : result.error ?? "Campaign could not be deleted.");
    await load();
  }

  return <div>
    <header className="admin-workspace-heading"><div><p>Automatic subscriber publishing</p><h1>Email campaigns</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh</button>{canEdit && <button className="admin-action primary" onClick={() => setEditing("new")}><Plus /> New campaign</button>}</div></header>
    {!configured && <div className="admin-setup-banner"><Mail /><div><strong>Connect the official Gmail account</strong><p>Add Gmail OAuth values before tests or delivery. Campaign drafting remains available.</p></div></div>}
    {notice && <div className="admin-notice"><Check /> {notice}</div>}
    <section className="admin-stat-grid admin-mail-stats"><article><span><Users /> Confirmed audience</span><strong>{active.length}</strong><small>Double-opted-in readers eligible for email</small></article><article><span><Mail /> Campaigns</span><strong>{items.length}</strong><small>Draft, scheduled and completed editions</small></article><article><span><Send /> Delivered</span><strong>{items.reduce((sum, item) => sum + (item.sentCount || 0), 0)}</strong><small>Individually recorded deliveries</small></article><article><span><Check /> Delivery worker</span><strong>{configured ? "READY" : "OFF"}</strong><small>{configured ? "Scheduler can process queued batches" : "Gmail credentials required"}</small></article></section>
    <div className="admin-data-list">{items.map(item => <article className="admin-data-row admin-campaign-row" key={item._id}><div><strong>{item.name}</strong><small>{item.subject} · {item.sentCount || 0} sent · {item.failedCount || 0} failed{item.scheduledAt ? ` · ${new Date(item.scheduledAt).toLocaleString()}` : ""}{item.lastError ? ` · ${item.lastError}` : ""}</small></div><span>{item.recipientTag || "All active subscribers"}</span><em>{item.status}</em><div className="admin-row-actions"><button onClick={() => setEditing(item)} title="Open campaign"><ChevronRight /></button>{canEdit && item.status === "draft" && <button disabled={!configured || busy === item._id} onClick={() => void action(item, "schedule")} title="Queue with cancellation window">{busy === item._id ? <RefreshCw className="is-spinning" /> : <Send />}</button>}{canEdit && item.status === "sending" && <button onClick={() => void action(item, "pause")} title="Pause campaign"><Pause /></button>}{canEdit && item.status === "paused" && <button onClick={() => void action(item, "resume")} title="Resume campaign"><Play /></button>}{canEdit && ["scheduled", "paused"].includes(item.status) && <button onClick={() => void action(item, "cancel")} title="Cancel campaign"><X /></button>}{canEdit && item.status === "draft" && <button onClick={() => void remove(item)} title="Delete campaign"><Trash2 /></button>}</div></article>)}{!items.length && <div className="admin-empty"><i /><p>Create a reader update, send a test, then queue it for automatic delivery.</p></div>}</div>
    {editing && <CampaignComposer campaign={editing === "new" ? null : editing} tags={tags} active={active} configured={configured} readOnly={!canEdit} onClose={() => setEditing(null)} onSchedule={async (campaign, scheduledAt) => { const success = await action(campaign, "schedule", scheduledAt); if (success) setEditing(null); }} onSaved={async message => { setNotice(message); setEditing(null); await load(); }} />}
  </div>;
}

function CampaignComposer({ campaign, tags, active, configured, readOnly, onClose, onSaved, onSchedule }: { campaign: Campaign | null; tags: string[]; active: Subscriber[]; configured: boolean; readOnly: boolean; onClose: () => void; onSaved: (message: string) => void; onSchedule: (campaign: Campaign, scheduledAt?: string) => Promise<void> }) {
  const [form, setForm] = useState(campaign ? { name: campaign.name, subject: campaign.subject, previewText: campaign.previewText, body: campaign.body, recipientTag: campaign.recipientTag } : blank);
  const [testEmail, setTestEmail] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const editable = !readOnly && (!campaign || campaign.status === "draft");
  const audience = useMemo(() => form.recipientTag ? active.filter(item => item.tags?.includes(form.recipientTag)).length : active.length, [active, form.recipientTag]);
  const set = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  async function save(event?: FormEvent) {
    event?.preventDefault(); if (!editable) return; setSaving(true);
    const response = await fetch("/api/campaigns", { method: campaign ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, ...(campaign ? { id: campaign._id, expectedVersion: campaign.version } : {}) }) });
    const result = await response.json(); setSaving(false);
    if (response.ok) onSaved("Campaign draft saved."); else setNotice(result.error ?? "Campaign could not be saved.");
  }
  async function test() {
    if (!campaign) { setNotice("Save the draft before sending a test."); return; }
    const response = await fetch("/api/campaigns/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: campaign._id, testEmail }) });
    const result = await response.json(); setNotice(response.ok ? "Test email sent." : result.error ?? "Test failed.");
  }
  return <div className="admin-drawer-backdrop"><section className="admin-drawer admin-mail-drawer"><header><div><p>{readOnly ? "CAMPAIGN PREVIEW" : editable ? "EMAIL COMPOSER" : "LOCKED DELIVERY SNAPSHOT"}</p><h2>{campaign?.name || "New reader update"}</h2></div><button onClick={onClose}><X /></button></header><div className="admin-mail-workbench"><form className="admin-form" onSubmit={save}><label><span>Internal campaign name</span><input disabled={!editable} required value={form.name} onChange={event => set("name", event.target.value)} placeholder="July reader update" /></label><label><span>Audience</span><select disabled={!editable} value={form.recipientTag} onChange={event => set("recipientTag", event.target.value)}><option value="">All active subscribers</option>{tags.map(tag => <option key={tag}>{tag}</option>)}</select></label><label className="full"><span>Email subject</span><input disabled={!editable} required value={form.subject} onChange={event => set("subject", event.target.value)} placeholder="What readers see in their inbox" /></label><label className="full"><span>Preview text</span><input disabled={!editable} value={form.previewText} onChange={event => set("previewText", event.target.value)} placeholder="Short supporting line beside the subject" /></label><label className="full"><span>Message</span><textarea disabled={!editable} required rows={15} value={form.body} onChange={event => set("body", event.target.value)} /><small className="admin-field-help">Use {"{{name}}"} for the reader name. Separate paragraphs with a blank line.</small></label>{campaign?.status === "draft" && editable && <label className="full"><span>Optional scheduled delivery</span><input type="datetime-local" value={scheduledAt} onChange={event => setScheduledAt(event.target.value)} /><small className="admin-field-help">Leave empty to start after the 10-minute cancellation window.</small></label>}{notice && <div className="admin-inline-notice full">{notice}</div>}<footer><span className="admin-audience-count"><Users /> {audience} recipients</span><button type="button" onClick={onClose}>Close</button>{campaign?.status === "draft" && editable && <button type="button" disabled={!configured} onClick={() => void onSchedule(campaign, scheduledAt || undefined)}><Send /> Schedule</button>}{editable && <button className="primary" disabled={saving}><Save /> {saving ? "Saving..." : "Save draft"}</button>}</footer></form><aside className="admin-mail-preview"><header><span>LIVE EMAIL PREVIEW</span><small>{audience} recipients</small></header><div><small>{form.previewText || "Preview text appears here"}</small><h3>{form.subject || "Your email subject"}</h3>{form.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph.replace(/\{\{name\}\}/g, "Reader")}</p>)}</div>{campaign && editable && <footer><input type="email" value={testEmail} onChange={event => setTestEmail(event.target.value)} placeholder="Send test to..." /><button type="button" disabled={!configured || !testEmail} onClick={() => void test()}><Play /> Send test</button></footer>}</aside></div></section></div>;
}
