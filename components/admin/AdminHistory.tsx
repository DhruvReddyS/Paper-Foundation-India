"use client";

import { Clock3, History, RefreshCw, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAccess } from "./AdminShell";

type Revision = { _id: string; resourceType: string; resourceId: string; resourceLabel: string; action: string; version?: number; changedFields: string[]; note?: string; actor?: { name?: string; email?: string; role?: string }; after?: Record<string, unknown> | null; createdAt: string };

export default function AdminHistory() {
  const { canEdit } = useAdminAccess();
  const [items, setItems] = useState<Revision[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [view, setView] = useState<"revisions" | "audit">("revisions");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const load = useCallback(async () => {
    const parameters = new URLSearchParams();
    if (type !== "all") parameters.set("resourceType", type);
    if (view === "audit") parameters.set("view", "audit");
    const response = await fetch("/api/admin/revisions" + (parameters.size ? "?" + parameters : ""));
    const data = await response.json();
    setItems(data.items ?? []);
    if (!response.ok) setNotice(data.error ?? "History could not be loaded.");
  }, [type, view]);
  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => items.filter(item => (item.resourceLabel + " " + item.resourceType + " " + item.action + " " + (item.actor?.name ?? "") + " " + item.changedFields.join(" ")).toLowerCase().includes(query.toLowerCase())), [items, query]);
  async function restore(item: Revision) {
    if (!confirm("Restore “" + item.resourceLabel + "” to version " + item.version + "? The current state will remain in history.")) return;
    setBusy(item._id);
    const response = await fetch("/api/admin/revisions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ revisionId: item._id }) });
    const data = await response.json();
    setNotice(response.ok ? item.resourceLabel + " restored. The previous state is still recoverable." : data.error ?? "Restore failed.");
    setBusy("");
    if (response.ok) await load();
  }
  return <div>
    <header className="admin-workspace-heading"><div><p>Recoverable editorial operations</p><h1>History & rollback</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh</button></div></header>
    <section className="admin-easy-guide"><ShieldCheck /><div><strong>{view === "revisions" ? "No restoration erases history" : "Account and audience actions are attributable"}</strong><p>{view === "revisions" ? "Restoring an earlier state creates a new version, so the state you replace remains recoverable." : "Administrator, subscriber, campaign and workflow changes retain the actor and affected record."}</p></div><span><Clock3 /> Latest 100 changes</span></section>
    {notice && <div className="admin-notice">{notice}</div>}
    <div className="admin-history-tabs"><button className={view === "revisions" ? "is-active" : ""} onClick={() => { setView("revisions"); setType("all"); }}>Editorial revisions</button><button className={view === "audit" ? "is-active" : ""} onClick={() => { setView("audit"); setType("all"); }}>Operational audit</button></div>
    <div className="admin-toolbar"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search content, people or changed fields" /></label>{view === "revisions" && <select value={type} onChange={event => setType(event.target.value)}><option value="all">All content</option>{["article", "myth", "resource", "glossary", "game", "setting"].map(value => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</select>}<span>{filtered.length} changes</span></div>
    <div className="admin-data-list admin-history-list">{filtered.map(item => <article className="admin-data-row" key={item._id}><div><strong>{item.resourceLabel}</strong><small>{new Date(item.createdAt).toLocaleString()} · {item.actor?.name || item.actor?.email || "System"}</small></div><span><History /> {item.action}{item.version ? " · v" + item.version : ""}</span><em>{item.resourceType}</em><div className="admin-row-actions">{view === "revisions" && <button disabled={!canEdit || !item.after || busy === item._id} title={item.after ? "Restore this version" : "This event has no restorable snapshot"} onClick={() => void restore(item)}>{busy === item._id ? <RefreshCw className="is-spinning" /> : <RotateCcw />}</button>}</div><small className="admin-history-fields">{item.changedFields.length ? item.changedFields.join(", ") : item.note || "Recorded change"}</small></article>)}{!filtered.length && <div className="admin-empty"><i /><p>No recorded changes match this view.</p></div>}</div>
  </div>;
}
