"use client";

import { Edit3, FilePlus2, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ArticleEditor from "./ArticleEditor";

type ArticleItem = {
  _id?: string; title: string; slug: string; category: string; excerpt?: string; summary?: string;
  body?: string; status?: string; featured?: boolean; format?: string;
};

export default function ArticleManager() {
  const [items, setItems] = useState<ArticleItem[]>([]);
  const [source, setSource] = useState("");
  const [editing, setEditing] = useState<ArticleItem | null | "new">(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/articles");
    const data = await response.json();
    setItems(data.items ?? []);
    setSource(data.source ?? "");
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save(data: Record<string, unknown>) {
    const current = editing && editing !== "new" ? editing : null;
    const payload = { ...data, ...(current?._id ? { id: current._id } : {}), format: current?.format ?? "Core lesson", readingMinutes: 7, sources: [], tags: [] };
    const response = await fetch("/api/articles", { method: current?._id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    setNotice(response.ok ? "Article saved." : result.error ?? "Article could not be saved.");
    if (response.ok) { setEditing(null); await load(); }
  }

  async function remove(item: ArticleItem) {
    if (!item._id || !window.confirm(`Delete “${item.title}”?`)) return;
    const response = await fetch(`/api/articles?id=${item._id}`, { method: "DELETE" });
    setNotice(response.ok ? "Article deleted." : "Article could not be deleted.");
    if (response.ok) await load();
  }

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#2d5f3e]">Editorial CMS</p><h1 className="mt-2 font-serif text-4xl">Articles</h1><p className="mt-2 text-sm text-stone-500">{items.length} records · {source === "editorial-manifest" ? "source documents connected, database pending" : "live CMS"}</p></div>
      <div className="flex gap-2"><button onClick={() => void load()} className="flex items-center gap-2 border border-stone-300 px-4 py-2 text-sm"><RefreshCw size={15} /> Refresh</button><button onClick={() => setEditing("new")} className="flex items-center gap-2 bg-[#1a3c2a] px-4 py-2 text-sm font-semibold text-white"><FilePlus2 size={16} /> New article</button></div>
    </header>
    {notice && <p className="border-l-2 border-[#c4956a] bg-[#f2ede7] px-4 py-3 text-sm">{notice}</p>}
    {editing ? <section className="border border-stone-200 bg-white p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-serif text-2xl">{editing === "new" ? "Create article" : `Edit ${editing.title}`}</h2><button onClick={() => setEditing(null)} className="text-sm text-stone-500">Close</button></div><ArticleEditor initialData={editing === "new" ? undefined : { title: editing.title, slug: editing.slug, category: editing.category, excerpt: editing.excerpt ?? editing.summary ?? "", body: editing.body ?? "", status: editing.status ?? "draft", featured: Boolean(editing.featured) }} onSave={save} /></section> :
      <div className="overflow-x-auto border border-stone-200 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{items.map(item => <tr key={item.slug} className="border-t border-stone-100"><td className="p-4"><strong className="font-serif text-base">{item.title}</strong><small className="mt-1 block font-mono text-[10px] text-stone-400">/{item.slug}</small></td><td className="p-4">{item.category}</td><td className="p-4"><span className="bg-stone-100 px-2 py-1 text-xs">{item.status ?? "editorial review"}</span></td><td className="p-4"><div className="flex justify-end gap-2"><button disabled={!item._id} onClick={() => setEditing(item)} title={item._id ? "Edit" : "Import into the CMS before editing"} className="border border-stone-200 p-2 disabled:cursor-not-allowed disabled:opacity-30"><Edit3 size={15} /></button><button disabled={!item._id} onClick={() => void remove(item)} className="border border-stone-200 p-2 text-red-700 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>}
  </div>;
}
