"use client";

import { BarChart3, ChevronDown, ChevronUp, Edit3, FilePlus2, RefreshCw, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticleEditor from "./ArticleEditor";
import { useAdminAccess } from "./AdminShell";

type ArticleItem = { _id?: string; title: string; slug: string; category: string; excerpt?: string; summary?: string; body?: string; status?: string; featured?: boolean; format?: string; order?: number; time?: string; coverImage?: string; readingMinutes?: number; revisionNote?: string; tags?: string[]; sources?: { label: string; url: string }[] };

export default function ArticleManager() {
  const searchParams = useSearchParams();
  const { canEdit } = useAdminAccess();
  const [items, setItems] = useState<ArticleItem[]>([]);
  const [source, setSource] = useState("");
  const [editing, setEditing] = useState<ArticleItem | null | "new">(null);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const load = useCallback(async () => { const response = await fetch("/api/articles?status=all"); const data = await response.json(); setItems(data.items ?? []); setSource(data.source ?? ""); }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const id = searchParams.get("edit");
    if (id && items.length) setEditing(items.find(item => item._id === id || item.slug === id) ?? null);
  }, [items, searchParams]);
  const filtered = useMemo(() => items.filter(item => (status === "all" || (item.status ?? "review") === status) && `${item.title} ${item.category} ${item.slug}`.toLowerCase().includes(query.toLowerCase())), [items, query, status]);

  async function save(data: Record<string, unknown>) {
    const current = editing && editing !== "new" ? editing : null;
    const payload = { ...data, ...(current?._id ? { id: current._id } : {}), format: data.format ?? current?.format ?? "Core lesson", readingMinutes: Number(data.readingMinutes ?? current?.readingMinutes ?? String(current?.time ?? "7").match(/\d+/)?.[0] ?? 7), order: current?.order ?? items.length };
    const response = await fetch("/api/articles", { method: current?._id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json(); setNotice(response.ok ? "Article saved." : result.error ?? "Article could not be saved."); if (response.ok) { setEditing(null); await load(); }
  }
  async function remove(item: ArticleItem) { if (!item._id || !confirm(`Delete "${item.title}"?`)) return; const response = await fetch(`/api/articles?id=${item._id}`, { method: "DELETE" }); setNotice(response.ok ? "Article deleted." : "Article could not be deleted."); if (response.ok) await load(); }
  async function move(index: number, direction: number) { const target = index + direction; if (target < 0 || target >= items.length) return; const next = [...items]; [next[index], next[target]] = [next[target], next[index]]; setItems(next); const changed = [next[index], next[target]]; await Promise.all(changed.filter(item => item._id).map(item => fetch("/api/articles", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item._id, order: next.indexOf(item) }) }))); }

  return <div>
    <header className="admin-workspace-heading"><div><p>Editorial publishing</p><h1>Articles</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh</button>{canEdit && <button className="admin-action primary" onClick={() => setEditing("new")}><FilePlus2 /> New article</button>}</div></header>
    {source !== "cms" && <div className="admin-setup-banner"><BarChart3 /><div><strong>Catalog preview mode</strong><p>Connect MongoDB and run the CMS seed to edit, publish and reorder these baseline articles.</p></div></div>}
    {notice && <div className="admin-notice">{notice}</div>}
    {editing ? <section className="admin-editor-panel"><header><div><p>{canEdit ? "EDITOR" : "READ-ONLY PREVIEW"}</p><h2>{editing === "new" ? "Create article" : editing.title}</h2></div><button onClick={() => setEditing(null)}>Close</button></header><ArticleEditor initialData={editing === "new" ? undefined : { title: editing.title, slug: editing.slug, category: editing.category, excerpt: editing.excerpt ?? editing.summary ?? "", body: editing.body ?? "", status: editing.status ?? "draft", featured: Boolean(editing.featured), coverImage: editing.coverImage || `/images/knowledge/articles/${editing.slug}.jpg`, readingMinutes: editing.readingMinutes ?? Number(String(editing.time ?? "7").match(/\d+/)?.[0] ?? 7), revisionNote: editing.revisionNote, format: editing.format, tags: editing.tags, sources: editing.sources }} onSave={canEdit ? save : undefined} /></section> : <>
      <div className="admin-toolbar"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title, slug or category" /></label><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option></select><span>{filtered.length} articles</span></div>
      <div className="admin-data-list">{filtered.map(item => { const index = items.indexOf(item); return <article className="admin-data-row" key={item.slug}><div><strong>{item.title}</strong><small>/{item.slug} / {item.featured ? "Featured" : "Standard"}</small></div><span>{item.category}</span><em>{item.status ?? "review"}</em><div className="admin-row-actions">{canEdit && <><button disabled={!item._id} onClick={() => void move(index,-1)} title={item._id ? "Move up" : "Connect MongoDB to reorder"}><ChevronUp /></button><button disabled={!item._id} onClick={() => void move(index,1)} title={item._id ? "Move down" : "Connect MongoDB to reorder"}><ChevronDown /></button></>}<button onClick={() => setEditing(item)} title="Inspect or edit"><Edit3 /></button>{canEdit && <button disabled={!item._id} onClick={() => void remove(item)} title={item._id ? "Delete" : "Connect MongoDB to delete"}><Trash2 /></button>}</div></article>; })}</div>
    </>}
  </div>;
}
