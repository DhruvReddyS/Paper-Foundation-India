"use client";

import { Activity, ArrowRight, BookOpenCheck, Clock3, Eye, Gamepad2, Lightbulb, MousePointer2, RefreshCw, Sparkles, Target } from "@/components/paper-ui/icons";
import { useCallback, useEffect, useState } from "react";
import type { AnalyticsReport } from "@/lib/analytics-report";

/**
 * The first view arrives already rendered from the server. This component
 * only refetches when the range changes or Refresh is pressed, so there is
 * no window in which the page can show a confident zero for a figure it has
 * not actually loaded yet. A failed refetch keeps the previous figures on
 * screen and says so, rather than silently resetting everything to nothing.
 */
export default function AdminAnalytics({ initial }: { initial: AnalyticsReport }) {
  const [days, setDays] = useState(initial.days);
  const [loadedDays, setLoadedDays] = useState(initial.days);
  const [data, setData] = useState<AnalyticsReport>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (next: number) => {
    setBusy(true);
    try {
      const response = await fetch(`/api/analytics?days=${next}`);
      if (!response.ok) throw new Error(`The server answered ${response.status}.`);
      const report = (await response.json()) as AnalyticsReport;
      if (!report?.totals) throw new Error("The reply did not contain a report.");
      setData(report);
      setLoadedDays(next);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The figures could not be refreshed.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (days !== loadedDays) void load(days);
  }, [days, loadedDays, load]);

  const max = Math.max(...data.daily.map(item => item.views + item.interactions), 1);
  const views = data.totals.page_view ?? 0;
  const opens = data.totals.article_open ?? 0;
  const completions = data.totals.article_complete ?? 0;
  const interactions = (data.totals.myth_interaction ?? 0) + (data.totals.game_open ?? 0) + (data.totals.cta_click ?? 0);
  const engagementRate = views ? Math.round((interactions / views) * 100) : 0;
  const completionRate = opens ? Math.round((completions / opens) * 100) : 0;
  const averageDuration = data.topContent.length ? Math.round(data.topContent.reduce((sum, item) => sum + (item.averageDuration || 0), 0) / data.topContent.length) : 0;
  return <div>
    <header className="admin-workspace-heading"><div><p>Audience intelligence</p><h1>Analytics</h1>{data.preview && <span className="admin-preview-badge">DEMONSTRATION DATA</span>}</div><div><select className="admin-action" value={days} disabled={busy} onChange={event => setDays(Number(event.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select><button className="admin-action" disabled={busy} onClick={() => void load(days)}><RefreshCw /> {busy ? "Loading" : "Refresh"}</button></div></header>
    {error && <p className="admin-analytics-error" role="alert">{error} The figures below are from the last successful load.</p>}
    <section className="admin-stat-grid"><Metric icon={Eye} label="Page views" value={views} note="All tracked public routes" /><Metric icon={Target} label="Engagement rate" value={`${engagementRate}%`} note="Meaningful actions per page view" /><Metric icon={BookOpenCheck} label="Reading completion" value={`${completionRate}%`} note="Opened articles completed" /><Metric icon={Clock3} label="Average attention" value={`${Math.floor(averageDuration / 60)}m ${averageDuration % 60}s`} note="Across the leading content" /></section>
    <section className="admin-funnel">
      <header><div><p>READER JOURNEY</p><h2>From arrival to deeper action</h2></div><small>Use this to find where interest drops</small></header>
      <div>
        <article><span>01</span><div><small>Page views</small><strong>{views.toLocaleString()}</strong></div></article><ArrowRight />
        <article><span>02</span><div><small>Article opens</small><strong>{opens.toLocaleString()}</strong></div><em>{views ? Math.round((opens / views) * 100) : 0}% of views</em></article><ArrowRight />
        <article><span>03</span><div><small>Completed reads</small><strong>{completions.toLocaleString()}</strong></div><em>{completionRate}% of opens</em></article><ArrowRight />
        <article><span>04</span><div><small>CTA clicks</small><strong>{(data.totals.cta_click ?? 0).toLocaleString()}</strong></div><em>{completions ? Math.round(((data.totals.cta_click ?? 0) / completions) * 100) : 0}% of completions</em></article>
      </div>
    </section>
    <div className="admin-dashboard-grid">
      <section className="admin-panel"><header><div><p>Traffic rhythm</p><h2>Views and interactions</h2></div></header><div className="admin-chart">{data.daily.length ? data.daily.map(item => <div key={item._id} title={`${item._id}: ${item.views} views, ${item.interactions} interactions`}><i style={{ height: `${Math.max(4, ((item.views + item.interactions) / max) * 100)}%` }} /><span>{item._id.slice(5)}</span></div>) : <div className="admin-empty"><p>No activity has been recorded in this period.</p></div>}</div></section>
      <section className="admin-panel admin-top-content"><header><div><p>Content ranking</p><h2>Most active content</h2></div></header><div>{data.topContent.length ? data.topContent.map((item, index) => <article key={`${item._id.type}-${item._id.id}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item._id.id.replaceAll("-", " ")}</strong><small><Activity /> {item._id.type} · {Math.round(item.averageDuration || 0)} sec attention</small></div><b>{item.interactions}</b></article>) : <div className="admin-empty"><p>No content interactions have been recorded in this period.</p></div>}</div></section>
    </div>
    <section className="admin-analysis-notes">
      <header><Sparkles /><div><p>PLAIN LANGUAGE ANALYSIS</p><h2>Three useful readings of the data</h2></div></header>
      <div>
        <article><Lightbulb /><span><strong>{completionRate >= 65 ? "Readers are finishing the articles they open" : "Article completion needs attention"}</strong><p>{completionRate >= 65 ? `A ${completionRate}% completion rate suggests the structure and reading length are working.` : "Tighten the opening, add clearer subheads and move the strongest evidence earlier."}</p></span></article>
        <article><MousePointer2 /><span><strong>{engagementRate >= 50 ? "Interactive learning is earning attention" : "Interactive actions can work harder"}</strong><p>{engagementRate >= 50 ? "Myth reveals and games are creating a strong second action after page arrival." : "Give each major page one clear interactive invitation instead of several competing choices."}</p></span></article>
        <article><Gamepad2 /><span><strong>Connect games to the knowledge library</strong><p>Use the result screen to recommend one article based on the player’s final answer or score.</p></span></article>
      </div>
    </section>
  </div>;
}
function Metric({ icon: Icon, label, value, note }: { icon: typeof Eye; label: string; value: number | string; note: string }) { return <article><span><Icon /> {label}</span><strong>{typeof value === "number" ? value.toLocaleString() : value}</strong><small>{note}</small></article>; }
