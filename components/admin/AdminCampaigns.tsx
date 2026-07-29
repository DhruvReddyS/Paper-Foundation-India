"use client";

import { Check, ChevronRight, Mail, Play, Plus, RefreshCw, Save, Send, Users, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Campaign = { _id: string; name: string; subject: string; previewText: string; body: string; recipientTag: string; status: string; recipientCount: number; sentCount: number; failedCount: number; updatedAt: string };
type Subscriber = { email: string; status: string; tags?: string[] };
const blank = { name: "", subject: "", previewText: "", body: "Hello {{name}},\n\n", recipientTag: "" };

export default function AdminCampaigns() {
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
  }, []);
  useEffect(() => { void load(); }, [load]);
  const active = subscribers.filter(item => item.status === "active");
  const tags = [...new Set(active.flatMap(item => item.tags ?? []))].sort();

  async function sendBatch(campaign: Campaign) {
    if (!confirm(campaign.status === "sending" ? "Continue sending the next batch?" : `Start sending "${campaign.subject}" to its selected audience?`)) return;
    setBusy(campaign._id);
    const response = await fetch("/api/campaigns/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: campaign._id }) });
    const result = await response.json();
    setNotice(response.ok ? result.complete ? "Campaign delivery completed." : `${result.sentCount} sent. ${result.remaining} remain. Continue when ready.` : result.error);
    setBusy("");
    await load();
  }

  return <div>
    <header className="admin-workspace-heading"><div><p>Official Gmail publishing</p><h1>Email campaigns</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh</button><button className="admin-action primary" onClick={() => setEditing("new")}><Plus /> New campaign</button></div></header>
    {!configured && <div className="admin-setup-banner"><Mail /><div><strong>Connect the official Gmail account</strong><p>Add the Gmail OAuth environment values before sending. Drafting and previews remain available.</p></div></div>}
    {notice && <div className="admin-notice"><Check /> {notice}</div>}
    <section className="admin-stat-grid admin-mail-stats"><article><span><Users /> Active audience</span><strong>{active.length}</strong><small>Subscribed readers eligible for email</small></article><article><span><Mail /> Campaigns</span><strong>{items.length}</strong><small>Draft and sent editions</small></article><article><span><Send /> Delivered</span><strong>{items.reduce((sum, item) => sum + (item.sentCount || 0), 0)}</strong><small>Individual Gmail deliveries recorded</small></article><article><span><Check /> Gmail</span><strong>{configured ? "ON" : "OFF"}</strong><small>{configured ? "Official sender connected" : "Credentials required"}</small></article></section>
    <div className="admin-data-list">{items.map(item => <article className="admin-data-row admin-campaign-row" key={item._id}><div><strong>{item.name}</strong><small>{item.subject}</small></div><span>{item.recipientTag || "All active subscribers"}</span><em>{item.status}</em><div className="admin-row-actions"><button onClick={() => setEditing(item)} title="Open campaign"><ChevronRight /></button>{item.status !== "sent" && <button disabled={!configured || busy === item._id} onClick={() => void sendBatch(item)} title="Send next batch">{busy === item._id ? <RefreshCw className="is-spinning" /> : <Send />}</button>}</div></article>)}{!items.length && <div className="admin-empty"><i /><p>Create the first reader update, send yourself a test and then deliver it to subscribers.</p></div>}</div>
    {editing && <CampaignComposer campaign={editing === "new" ? null : editing} tags={tags} active={active} configured={configured} onClose={() => setEditing(null)} onSaved={async message => { setNotice(message); setEditing(null); await load(); }} />}
  </div>;
}

function CampaignComposer({ campaign, tags, active, configured, onClose, onSaved }: { campaign: Campaign | null; tags: string[]; active: Subscriber[]; configured: boolean; onClose: () => void; onSaved: (message: string) => void }) {
  const [form, setForm] = useState(campaign ? { name: campaign.name, subject: campaign.subject, previewText: campaign.previewText, body: campaign.body, recipientTag: campaign.recipientTag } : blank);
  const [testEmail, setTestEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const audience = useMemo(() => form.recipientTag ? active.filter(item => item.tags?.includes(form.recipientTag)).length : active.length, [active, form.recipientTag]);
  const set = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  async function save(event?: FormEvent) {
    event?.preventDefault(); setSaving(true);
    const response = await fetch("/api/campaigns", { method: campaign ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, ...(campaign ? { id: campaign._id } : {}) }) });
    const result = await response.json(); setSaving(false);
    if (response.ok) onSaved("Campaign draft saved."); else setNotice(result.error);
  }
  async function test() {
    if (!campaign) { setNotice("Save the draft before sending a test."); return; }
    const response = await fetch("/api/campaigns/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: campaign._id, testEmail }) });
    const result = await response.json(); setNotice(response.ok ? "Test email sent." : result.error);
  }
  return <div className="admin-drawer-backdrop"><section className="admin-drawer admin-mail-drawer"><header><div><p>EMAIL COMPOSER</p><h2>{campaign?.name || "New reader update"}</h2></div><button onClick={onClose}><X /></button></header><div className="admin-mail-workbench"><form className="admin-form" onSubmit={save}><label><span>Internal campaign name</span><input required value={form.name} onChange={event => set("name", event.target.value)} placeholder="July reader update" /></label><label><span>Audience</span><select value={form.recipientTag} onChange={event => set("recipientTag", event.target.value)}><option value="">All active subscribers</option>{tags.map(tag => <option key={tag}>{tag}</option>)}</select></label><label className="full"><span>Email subject</span><input required value={form.subject} onChange={event => set("subject", event.target.value)} placeholder="What readers see in their inbox" /></label><label className="full"><span>Preview text</span><input value={form.previewText} onChange={event => set("previewText", event.target.value)} placeholder="Short supporting line beside the subject" /></label><label className="full"><span>Message</span><textarea required rows={15} value={form.body} onChange={event => set("body", event.target.value)} /><small className="admin-field-help">Use {"{{name}}"} for the reader name. Separate paragraphs with a blank line.</small></label>{notice && <div className="admin-inline-notice full">{notice}</div>}<footer><span className="admin-audience-count"><Users /> {audience} recipients</span><button type="button" onClick={onClose}>Close</button><button className="primary" disabled={saving}><Save /> {saving ? "Saving..." : "Save draft"}</button></footer></form><aside className="admin-mail-preview"><header><span>LIVE EMAIL PREVIEW</span><small>{audience} recipients</small></header><div><small>{form.previewText || "Preview text appears here"}</small><h3>{form.subject || "Your email subject"}</h3>{form.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph.replace(/\{\{name\}\}/g, "Reader")}</p>)}</div>{campaign && <footer><input type="email" value={testEmail} onChange={event => setTestEmail(event.target.value)} placeholder="Send test to..." /><button disabled={!configured || !testEmail} onClick={() => void test()}><Play /> Send test</button></footer>}</aside></div></section></div>;
}
