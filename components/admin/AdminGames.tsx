"use client";

import { Check, ChevronDown, ChevronUp, Edit3, Gamepad2, RefreshCw, Save, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Game = { _id?: string; gameId: string; id?: string; title: string; subtitle?: string; description?: string; duration?: string; difficulty?: string; skill?: string; enabled: boolean; order: number; instructions: string[]; content: Record<string, unknown>; revision?: number };
type Stat = { gameId: string; plays: number; averagePercent: number; fastestSeconds: number };

export default function AdminGames() {
  const [items, setItems] = useState<Game[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [editing, setEditing] = useState<Game | null>(null);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => { const [configResponse, statsResponse] = await Promise.all([fetch("/api/game-config"), fetch("/api/games")]); const config = await configResponse.json(); const result = await statsResponse.json(); setItems(config.items ?? []); setStats(result.statistics ?? []); }, []);
  useEffect(() => { void load(); }, [load]);
  async function save(game: Game) { const response = await fetch("/api/game-config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(game) }); const result = await response.json(); setNotice(response.ok ? "Game configuration saved." : result.error); if (response.ok) { setEditing(null); await load(); } }
  async function move(index: number, direction: number) { const next = [...items]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setItems(next); await fetch("/api/game-config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: next.map(item => item.gameId ?? item.id) }) }); }
  return <div>
    <header className="admin-workspace-heading"><div><p>Interactive learning system</p><h1>Games</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh data</button></div></header>
    {notice && <div className="admin-notice"><Check />{notice}</div>}
    <section className="admin-stat-grid">{items.slice(0,4).map(game => { const stat = stats.find(item => item.gameId === (game.gameId ?? game.id)); return <article key={game.gameId ?? game.id}><span><Gamepad2 /> {game.title}</span><strong>{stat?.plays ?? 0}</strong><small>{stat ? `${Math.round(stat.averagePercent)}% average score / ${stat.fastestSeconds}s fastest` : "No completed sessions yet"}</small></article>; })}</section>
    <div className="admin-data-list">{items.map((game, index) => <article className="admin-data-row" key={game.gameId ?? game.id}><div><strong>{game.title}</strong><small>{game.subtitle || game.description}</small></div><span>{stats.find(item => item.gameId === (game.gameId ?? game.id))?.plays ?? 0} plays</span><em>{game.enabled ? "Live" : "Hidden"}</em><div className="admin-row-actions"><button onClick={() => void move(index,-1)} aria-label="Move up"><ChevronUp /></button><button onClick={() => void move(index,1)} aria-label="Move down"><ChevronDown /></button><button onClick={() => setEditing({ ...game, gameId: game.gameId ?? game.id ?? "" })} aria-label="Edit"><Edit3 /></button></div></article>)}</div>
    {editing && <div className="admin-drawer-backdrop"><section className="admin-drawer"><header><div><p>GAME CONFIGURATION</p><h2>{editing.title}</h2></div><button onClick={() => setEditing(null)}><X /></button></header><GameForm game={editing} onSave={save} /></section></div>}
  </div>;
}

function GameForm({ game, onSave }: { game: Game; onSave: (game: Game) => void }) {
  const [form, setForm] = useState(game);
  const set = (key: keyof Game, value: unknown) => setForm(current => ({ ...current, [key]: value }));
  return <form className="admin-form" onSubmit={event => { event.preventDefault(); onSave(form); }}>
    <label><span>Public title</span><input value={form.title} onChange={event => set("title", event.target.value)} /></label>
    <label><span>Subtitle</span><input value={form.subtitle ?? ""} onChange={event => set("subtitle", event.target.value)} /></label>
    <label className="full"><span>Description</span><textarea rows={4} value={form.description ?? ""} onChange={event => set("description", event.target.value)} /></label>
    <label><span>Duration label</span><input value={form.duration ?? ""} onChange={event => set("duration", event.target.value)} /></label>
    <label><span>Difficulty label</span><input value={form.difficulty ?? ""} onChange={event => set("difficulty", event.target.value)} /></label>
    <label><span>Skill label</span><input value={form.skill ?? ""} onChange={event => set("skill", event.target.value)} /></label>
    <label><span>Display order</span><input type="number" min={0} value={form.order} onChange={event => set("order", Number(event.target.value))} /></label>
    <label className="full"><span>Instructions, one per line</span><textarea rows={5} value={(form.instructions ?? []).join("\n")} onChange={event => set("instructions", event.target.value.split("\n").filter(Boolean))} /></label>
    <label className="full"><span>Game content JSON</span><textarea className="code" rows={12} value={JSON.stringify(form.content ?? {}, null, 2)} onChange={event => { try { set("content", JSON.parse(event.target.value)); } catch {} }} /></label>
    <label className="admin-check"><input type="checkbox" checked={form.enabled} onChange={event => set("enabled", event.target.checked)} /><span>Game is publicly available</span></label>
    <footer><button type="button" onClick={() => setForm(game)}>Reset</button><button className="primary"><Save /> Save configuration</button></footer>
  </form>;
}
