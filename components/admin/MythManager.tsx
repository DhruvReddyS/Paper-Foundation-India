"use client";

import { FilePlus2, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import MythEditor from "./MythEditor";

type MythItem = { _id?: string; claim: string; correction: string; explanation: string; category: string; verdict: "myth" | "fact" | "context"; tags?: string[]; sources?: { label: string; url: string }[]; status?: string };

export default function MythManager() {
  const [items, setItems] = useState<MythItem[]>([]);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => { const response = await fetch("/api/myths"); const data = await response.json(); setItems(data.items ?? []); }, []);
  useEffect(() => { void load(); }, [load]);

  async function save(data: Record<string, unknown>) {
    const rawSources = Array.isArray(data.sources) ? data.sources.map(String) : String(data.sources ?? "").split("\n");
    const sources = rawSources.filter(Boolean).map((url) => ({ label: url.replace(/^https?:\/\//, "").split("/")[0], url }));
    const payload = { claim: data.myth, verdict: "context", correction: data.fact, explanation: data.explanation, category: data.category, tags: data.tags, sources, status: data.status, featured: false };
    const response = await fetch("/api/myths", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    setNotice(response.ok ? "Myth case saved." : result.error ?? "Myth case could not be saved.");
    if (response.ok) { setCreating(false); await load(); }
  }

  async function remove(item: MythItem) {
    if (!item._id || !window.confirm("Delete this myth case?")) return;
    const response = await fetch(`/api/myths?id=${item._id}`, { method: "DELETE" });
    if (response.ok) await load();
  }

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#956443]">Evidence CMS</p><h1 className="mt-2 font-serif text-4xl">Myths vs facts</h1><p className="mt-2 text-sm text-stone-500">Review claims, evidence, context and publication status.</p></div><div className="flex gap-2"><button onClick={() => void load()} className="flex items-center gap-2 border border-stone-300 px-4 py-2 text-sm"><RefreshCw size={15} /> Refresh</button><button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-[#1a3c2a] px-4 py-2 text-sm font-semibold text-white"><FilePlus2 size={16} /> Add claim</button></div></header>
    {notice && <p className="border-l-2 border-[#c4956a] bg-[#f2ede7] px-4 py-3 text-sm">{notice}</p>}
    {creating ? <section className="border border-stone-200 bg-white p-6"><div className="mb-5 flex justify-between"><h2 className="font-serif text-2xl">New evidence case</h2><button onClick={() => setCreating(false)} className="text-sm text-stone-500">Close</button></div><MythEditor onSave={save} /></section> : <div className="grid gap-3">{items.length ? items.map(item => <article key={item._id ?? item.claim} className="grid grid-cols-[1fr_auto] gap-4 border border-stone-200 bg-white p-5"><div><span className="text-xs uppercase tracking-wider text-[#956443]">{item.category} · {item.verdict}</span><h2 className="mt-2 font-serif text-xl">{item.claim}</h2><p className="mt-2 text-sm text-stone-500">{item.correction}</p></div><button disabled={!item._id} onClick={() => void remove(item)} className="self-start border border-stone-200 p-2 text-red-700 disabled:opacity-30"><Trash2 size={15} /></button></article>) : <div className="border border-dashed border-stone-300 bg-stone-50 p-10 text-center"><p className="font-serif text-2xl">The case desk is ready.</p><p className="mt-2 text-sm text-stone-500">Add verified myths and facts after the content review.</p></div>}</div>}
  </div>;
}
