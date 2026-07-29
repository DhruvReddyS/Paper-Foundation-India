"use client";

import { Check, Download, Edit3, FileDown, Plus, RefreshCw, Search, Send, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Mode = "glossary" | "resources" | "inquiries" | "subscribers" | "settings";
type Item = Record<string, unknown> & { _id?: string };
const config = {
  glossary: { title: "Glossary", kicker: "Public terminology", endpoint: "/api/glossary", primary: "term", secondary: "definition" },
  resources: { title: "Resources", kicker: "Reference library", endpoint: "/api/resources", primary: "title", secondary: "description" },
  inquiries: { title: "Inbox", kicker: "Public correspondence", endpoint: "/api/inquiries", primary: "subject", secondary: "message" },
  subscribers: { title: "Subscribers", kicker: "Audience list", endpoint: "/api/subscribers", primary: "email", secondary: "name" },
  settings: { title: "Settings", kicker: "Site configuration", endpoint: "/api/settings", primary: "key", secondary: "description" },
} as const;

export default function AdminRecords({ mode }: { mode: Mode }) {
  const meta = config[mode];
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [status, setStatus] = useState("all");
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => { const response = await fetch(`${meta.endpoint}${mode === "glossary" || mode === "resources" ? "?status=all" : ""}`); const data = await response.json(); setItems(data.items ?? []); }, [meta.endpoint, mode]);
  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => items.filter(item => (status === "all" || String(item.status ?? "active") === status) && JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [items, query, status]);
  async function change(id: string, status: string) { const response = await fetch(meta.endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }); setNotice(response.ok ? "Status updated." : "Status could not be updated."); if (response.ok) await load(); }
  async function remove(id: string) { if (!confirm("Delete this record permanently?")) return; const response = await fetch(`${meta.endpoint}?id=${id}`, { method: "DELETE" }); setNotice(response.ok ? "Record deleted." : "Record could not be deleted."); if (response.ok) await load(); }
  function exportRows() { const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${mode}-export.json`; anchor.click(); URL.revokeObjectURL(url); }
  return <div>
    <header className="admin-workspace-heading"><div><p>{meta.kicker}</p><h1>{meta.title}</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh</button><button className="admin-action" onClick={exportRows}><Download /> Export</button>{mode !== "inquiries" && mode !== "subscribers" && <button className="admin-action primary" onClick={() => setCreating(true)}><Plus /> New record</button>}</div></header>
    {notice && <div className="admin-notice"><Check /> {notice}</div>}
    <div className="admin-toolbar"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${meta.title.toLowerCase()}`} /></label><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="active">Active</option><option value="archived">Archived</option></select><span>{filtered.length} records</span></div>
    <div className="admin-data-list">{filtered.map(item => <article className="admin-data-row" key={String(item._id ?? item[meta.primary])}><div><strong>{String(item[meta.primary] ?? "Untitled")}</strong><small>{String(item[meta.secondary] ?? "").slice(0,160)}</small></div><span>{String(item.type ?? item.letter ?? item.source ?? "")}</span><em>{String(item.status ?? "active")}</em><div className="admin-row-actions">{mode === "inquiries" && typeof item.attachmentUrl === "string" && item.attachmentUrl && <a href={item.attachmentUrl} target="_blank" rel="noreferrer" title={`Open ${String(item.attachmentName || "attached PDF")}`}><FileDown /></a>}{mode === "inquiries" && item._id && <button title="Mark resolved" onClick={() => void change(item._id!, "resolved")}><Check /></button>}{mode === "subscribers" && item._id && <button title="Unsubscribe" onClick={() => void change(item._id!, "unsubscribed")}><Send /></button>}{item._id && (mode === "glossary" || mode === "resources") && <button title="Edit record" onClick={() => setEditing(item)}><Edit3 /></button>}{item._id && mode !== "inquiries" && <button title="Delete record" onClick={() => void remove(item._id!)}><Trash2 /></button>}</div></article>)}{!filtered.length && <div className="admin-empty"><i /><p>No records match this view.</p></div>}</div>
    {creating && <div className="admin-drawer-backdrop"><section className="admin-drawer"><header><div><p>NEW RECORD</p><h2>Add to {meta.title}</h2></div><button onClick={() => setCreating(false)}>Close</button></header><RecordForm mode={mode} endpoint={meta.endpoint} onDone={async message => { setNotice(message); setCreating(false); await load(); }} /></section></div>}
    {editing && <div className="admin-drawer-backdrop"><section className="admin-drawer"><header><div><p>EDIT RECORD</p><h2>{String(editing[meta.primary] ?? meta.title)}</h2></div><button onClick={() => setEditing(null)}>Close</button></header><RecordForm mode={mode} endpoint={meta.endpoint} item={editing} onDone={async message => { setNotice(message); setEditing(null); await load(); }} /></section></div>}
  </div>;
}

function RecordForm({ mode, endpoint, item, onDone }: { mode: Mode; endpoint: string; item?: Item; onDone: (message: string) => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = Object.fromEntries(new FormData(event.currentTarget)); let payload: Record<string, unknown> = form; if (mode === "glossary") payload = { ...form, letter: String(form.term ?? "A").charAt(0), order: Number(form.order || 0), status: String(item?.status ?? "published") }; if (mode === "resources") payload = { ...form, date: String(form.date || new Date().getFullYear()), accent: String(item?.accent ?? "green"), order: Number(form.order || 0), status: String(item?.status ?? "published") }; if (item?._id) payload.id = item._id; const response = await fetch(endpoint, { method: item?._id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json(); onDone(response.ok ? "Record saved." : result.error ?? "Record could not be saved."); }
  return <form className="admin-form" onSubmit={submit}>{mode === "glossary" && <><Field name="term" label="Term" defaultValue={item?.term} /><Field name="definition" label="Definition" defaultValue={item?.definition} textarea /><Field name="order" label="Display order" defaultValue={item?.order} type="number" /></>}{mode === "resources" && <><Field name="title" label="Title" defaultValue={item?.title} /><Field name="description" label="Description" defaultValue={item?.description} textarea /><Field name="type" label="Resource type" defaultValue={item?.type} /><Field name="source" label="Source group" defaultValue={item?.source} /><Field name="publisher" label="Publisher" defaultValue={item?.publisher} /><Field name="date" label="Publication date" defaultValue={item?.date} /><Field name="format" label="Format" defaultValue={item?.format} /><Field name="href" label="Public URL" defaultValue={item?.href} /><Field name="order" label="Display order" defaultValue={item?.order} type="number" /></>}<footer><button className="primary">Save record</button></footer></form>;
}
function Field({ name, label, defaultValue, type = "text", textarea = false }: { name: string; label: string; defaultValue?: unknown; type?: string; textarea?: boolean }) { return <label className={textarea ? "full" : ""}><span>{label}</span>{textarea ? <textarea required defaultValue={String(defaultValue ?? "")} name={name} rows={4} /> : <input required defaultValue={String(defaultValue ?? "")} name={name} type={type} />}</label>; }
