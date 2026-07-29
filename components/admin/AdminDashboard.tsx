"use client";

import { ArrowUpRight, BookOpenCheck, CheckCircle2, Clock3, Database, Gamepad2, Inbox, LayoutDashboard, Lightbulb, MailPlus, RefreshCw, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Overview = {
  configured: boolean;
  preview?: boolean;
  counts: { articles?: Record<string, number>; myths?: Record<string, number>; openInquiries?: number; subscribers?: number };
  topArticles: { _id: string; views: number; completions: number; averageDuration: number }[];
  games: { _id: string; plays: number; averageScore: number; averageDuration: number }[];
  recentInquiries: { _id: string; name: string; type: string; subject: string; status: string; createdAt: string }[];
};

const empty: Overview = { configured: false, counts: {}, topArticles: [], games: [], recentInquiries: [] };

export default function AdminDashboard() {
  const [data, setData] = useState<Overview>(empty);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); const response = await fetch("/api/admin/overview"); setData(await response.json()); setLoading(false); }, []);
  useEffect(() => { void load(); }, [load]);
  const published = data.counts.articles?.published ?? 0;
  const drafts = (data.counts.articles?.draft ?? 0) + (data.counts.articles?.review ?? 0);
  const views = data.topArticles.reduce((sum, item) => sum + item.views, 0);
  const completions = data.topArticles.reduce((sum, item) => sum + item.completions, 0);
  const completionRate = views ? Math.round((completions / views) * 100) : 0;
  const gamePlays = data.games.reduce((sum, game) => sum + game.plays, 0);
  const gameScore = data.games.length ? Math.round(data.games.reduce((sum, game) => sum + game.averageScore, 0) / data.games.length) : 0;
  const day = new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(new Date());
  return <div className="admin-dashboard">
    <header className="admin-page-heading"><div><p>{day} editorial briefing</p><h1>Good morning.<br /><em>Here is what matters now.</em></h1></div><div><button onClick={() => void load()}><RefreshCw className={loading ? "is-spinning" : ""} /> Refresh</button><Link href="/admin/articles">Create article <ArrowUpRight /></Link></div></header>
    {!data.configured && <div className="admin-setup-banner"><Database /><div><strong>Demonstration insights are active</strong><p>Explore every dashboard state now. Connect MongoDB when you want content, correspondence and analytics to persist.</p></div><span className="admin-preview-badge">DEMO DATA</span><Link href="/admin/settings">Setup centre</Link></div>}
    <section className="admin-stat-grid">
      <article><span><BookOpenCheck /> Published articles</span><strong>{published}</strong><small>{drafts} waiting in the editorial queue</small></article>
      <article><span><Inbox /> Open correspondence</span><strong>{data.counts.openInquiries ?? 0}</strong><small>New and currently reviewing</small></article>
      <article><span><Users /> Active subscribers</span><strong>{data.counts.subscribers ?? 0}</strong><small>Available for official reader campaigns</small></article>
      <article><span><Gamepad2 /> Game sessions</span><strong>{gamePlays}</strong><small>{gameScore}% average learning score</small></article>
    </section>
    <section className="admin-highlight-strip">
      <article><TrendingUp /><span><small>Reading completion</small><strong>{completionRate}%</strong><p>{completionRate >= 65 ? "Long reads are holding attention well." : "Strengthen openings and section rhythm."}</p></span></article>
      <article><Target /><span><small>Editorial queue</small><strong>{drafts}</strong><p>{drafts ? "Records still need review before publishing." : "The publishing queue is clear."}</p></span></article>
      <article><CheckCircle2 /><span><small>Best game signal</small><strong>{data.games[0]?.averageScore ? `${Math.round(data.games[0].averageScore)}%` : "No data"}</strong><p>{data.games[0] ? `${data.games[0]._id.replaceAll("-", " ")} leads current activity.` : "Game results will appear here."}</p></span></article>
    </section>
    <div className="admin-dashboard-grid">
      <section className="admin-panel admin-top-content"><header><div><p>Reading performance</p><h2>Most read articles</h2></div><Link href="/admin/analytics">Full analytics <ArrowUpRight /></Link></header>{data.topArticles.length ? <div>{data.topArticles.map((item, index) => <article key={item._id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item._id.replaceAll("-", " ")}</strong><small><Clock3 /> {Math.round(item.averageDuration || 0)} sec average · {item.views ? Math.round((item.completions / item.views) * 100) : 0}% complete</small></div><b>{item.views} reads</b><i style={{ width: `${Math.max(8, (item.views / data.topArticles[0].views) * 100)}%` }} /></article>)}</div> : <Empty label="Reading data will appear after the analytics tracker receives visits." />}</section>
      <section className="admin-panel admin-game-health"><header><div><p>Interactive learning</p><h2>Game activity</h2></div><Link href="/admin/games">Manage games <ArrowUpRight /></Link></header>{data.games.length ? <div>{data.games.map(game => <article key={game._id}><strong>{game._id.replaceAll("-", " ")}</strong><span>{game.plays} plays</span><b>{Math.round(game.averageScore)}%</b><small>{Math.round(game.averageDuration)} sec avg.</small></article>)}</div> : <Empty label="Completed game sessions will be summarized here." />}</section>
      <section className="admin-panel admin-inbox-preview"><header><div><p>Public desk</p><h2>Latest correspondence</h2></div><Link href="/admin/inquiries">Open inbox <ArrowUpRight /></Link></header>{data.recentInquiries.length ? <div>{data.recentInquiries.map(item => <article key={item._id}><i /><div><strong>{item.subject}</strong><small>{item.name} / {item.type}</small></div><span>{item.status}</span></article>)}</div> : <Empty label="New contact, report and membership submissions will appear here." />}</section>
      <section className="admin-panel admin-quick-actions"><header><div><p>Fast routes</p><h2>Continue working</h2></div></header><div><Link href="/admin/website"><LayoutDashboard />Customize the website<ArrowUpRight /></Link><Link href="/admin/campaigns"><MailPlus />Write a reader email<ArrowUpRight /></Link><Link href="/admin/articles"><BookOpenCheck />Write or reorder articles<ArrowUpRight /></Link><Link href="/admin/games"><Gamepad2 />Customize game content<ArrowUpRight /></Link></div></section>
    </div>
    <section className="admin-insight-board">
      <header><div><p>EDITORIAL HIGHLIGHTS</p><h2>What the signals suggest</h2></div><Link href="/admin/analytics">Study all insights <ArrowUpRight /></Link></header>
      <div>
        <article><Lightbulb /><span><strong>Protect the strongest reading path</strong><p>Your leading articles combine a clear question with practical evidence. Use the same pattern for the next feature.</p></span><Link href="/admin/articles">Open articles</Link></article>
        <article><Lightbulb /><span><strong>Turn popular myths into explainers</strong><p>High myth interaction is a useful demand signal. Promote the most opened claim into a sourced article.</p></span><Link href="/admin/myths">Review claims</Link></article>
        <article><Lightbulb /><span><strong>Follow up after game completion</strong><p>Add a related article link after each result to move playful learning into deeper reading.</p></span><Link href="/admin/games">Edit games</Link></article>
      </div>
    </section>
  </div>;
}

function Empty({ label }: { label: string }) { return <div className="admin-empty"><i /><p>{label}</p></div>; }
