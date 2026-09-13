"use client";

import { ArrowDown, ArrowUp, Check, ExternalLink, Eye, EyeOff, Info, LayoutTemplate, RefreshCw, RotateCcw, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAdminAccess } from "./AdminShell";

const homeDefaults = [
  { id: "living-cover", label: "Opening cover", enabled: true },
  { id: "myths", label: "Myths and facts", enabled: true },
  { id: "knowledge", label: "Knowledge highlights", enabled: true },
  { id: "everywhere", label: "Paper everywhere", enabled: true },
  { id: "journey", label: "Paper journey", enabled: true },
  { id: "games", label: "Playable edition", enabled: true },
  { id: "india", label: "Paper across India", enabled: true },
  { id: "community", label: "Community desk", enabled: true },
];
const pageLinks = [
  ["Homepage", "/", "Global order and visibility below"],
  ["Articles", "/admin/articles", "Copy, reading time, covers and placement"],
  ["Featured articles", "/admin/articles", "Use the Featured control on articles"],
  ["Myths and facts", "/admin/myths", "Claims, explanations, sources and order"],
  ["Games", "/admin/games", "All five games, rules, content and visibility"],
  ["Resources", "/admin/resources", "Public source library"],
  ["Glossary", "/admin/glossary", "Terms and definitions"],
  ["India evidence", "/admin/settings", "Shared statistics and public settings"],
  ["Contact, report and join", "/admin/inquiries", "Forms route into the inbox"],
] as const;
const defaultValues: Record<string, string> = {
  "public.brand.name": "Paper Foundation",
  "public.brand.country": "India",
  "public.navigation.join": "Join us",
  "public.navigation.contact": "Contact",
  "public.footer.statement": "PAPER|CAN|BEGIN|AGAIN",
  "public.footer.intro": "One sheet can carry a message, then return as material.",
  "public.footer.body": "Paper records where we have been. Recovery decides where its fibres can go next.",
  "public.footer.action": "Join the work",
  "public.contact.email": "paperfoundationindia@gmail.com",
};

export default function AdminWebsite() {
  const { canEdit } = useAdminAccess();
  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [sections, setSections] = useState(homeDefaults);
  const [notice, setNotice] = useState("");
  const [baseline, setBaseline] = useState(JSON.stringify({ values: defaultValues, sections: homeDefaults }));
  const load = useCallback(async () => {
    const response = await fetch("/api/settings"); const data = await response.json();
    const stored = Object.fromEntries((data.items ?? []).map((item: { key: string; value: unknown }) => [item.key, item.value]));
    const nextValues = { ...defaultValues, ...Object.fromEntries(Object.entries(stored).filter(([key]) => key !== "public.home.sections").map(([key, value]) => [key, String(value)])) };
    const nextSections = Array.isArray(stored["public.home.sections"]) ? stored["public.home.sections"] as typeof homeDefaults : homeDefaults;
    setValues(nextValues); setSections(nextSections); setBaseline(JSON.stringify({ values: nextValues, sections: nextSections }));
  }, []);
  useEffect(() => { void load(); }, [load]);
  const set = (key: string, value: string) => setValues(current => ({ ...current, [key]: value }));
  const dirty = JSON.stringify({ values, sections }) !== baseline;
  function undo() { const saved = JSON.parse(baseline) as { values: Record<string, string>; sections: typeof homeDefaults }; setValues(saved.values); setSections(saved.sections); setNotice("Unsaved changes cleared."); }
  function move(index: number, direction: number) { const target = index + direction; if (target < 0 || target >= sections.length) return; const next = [...sections]; [next[index], next[target]] = [next[target], next[index]]; setSections(next); }
  async function save() {
    const records = [...Object.entries(values).map(([key, value]) => ({ key, value, description: "Public website control" })), { key: "public.home.sections", value: sections, description: "Homepage order and visibility" }];
    const response = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: records }) });
    const succeeded = response.ok;
    setNotice(succeeded ? "Website controls published." : "Some controls could not be saved.");
    if (succeeded) setBaseline(JSON.stringify({ values, sections }));
  }
  return <div>
    <header className="admin-workspace-heading"><div><p>Whole website control</p><h1>Website</h1><span className={`admin-change-state ${dirty ? "has-changes" : ""}`}><i />{canEdit ? dirty ? "Unsaved changes" : "Everything saved" : "Read-only access"}</span></div><div>{canEdit&&<button className="admin-action" disabled={!dirty} onClick={undo}><RotateCcw /> Undo changes</button>}<button className="admin-action" onClick={() => void load()}><RefreshCw /> Reload</button><Link className="admin-action" href="/" target="_blank"><ExternalLink /> View site</Link>{canEdit&&<button disabled={!dirty} className="admin-action primary" onClick={() => void save()}><Save /> Publish changes</button>}</div></header>
    {notice && <div className="admin-notice"><Check /> {notice}</div>}
    <section className="admin-easy-guide"><Sparkles /><div><strong>Simple editing rule</strong><p>Change the words on the left, reorder or hide homepage sections on the right, then publish once.</p></div><span><Info /> Saved changes appear on the public site immediately</span></section>
    <div className="admin-website-grid">
      <section className="admin-panel admin-global-controls"><header><div><p>GLOBAL CONTROLS</p><h2>Identity, navigation and footer</h2></div></header><div className="admin-form">
        <Field label="Brand name" help="The main name shown in navigation." value={values["public.brand.name"]} onChange={value => set("public.brand.name", value)} disabled={!canEdit} />
        <Field label="Country label" help="The smaller location label beside the brand." value={values["public.brand.country"]} onChange={value => set("public.brand.country", value)} disabled={!canEdit} />
        <Field label="Join button" value={values["public.navigation.join"]} onChange={value => set("public.navigation.join", value)} disabled={!canEdit} />
        <Field label="Contact button" value={values["public.navigation.contact"]} onChange={value => set("public.navigation.contact", value)} disabled={!canEdit} />
        <Field full label="Footer reveal words, separated by |" help="Each word becomes one animated reveal." value={values["public.footer.statement"]} onChange={value => set("public.footer.statement", value)} disabled={!canEdit} />
        <Field full label="Footer opening note" value={values["public.footer.intro"]} onChange={value => set("public.footer.intro", value)} disabled={!canEdit} />
        <Field full label="Footer closing message" value={values["public.footer.body"]} onChange={value => set("public.footer.body", value)} textarea disabled={!canEdit} />
        <Field label="Footer action" value={values["public.footer.action"]} onChange={value => set("public.footer.action", value)} disabled={!canEdit} />
        <Field label="Official contact email" value={values["public.contact.email"]} onChange={value => set("public.contact.email", value)} disabled={!canEdit} />
      </div></section>
      <section className="admin-panel admin-home-order"><header><div><p>HOMEPAGE</p><h2>Order and visibility</h2></div><Link href="/" target="_blank">Preview <ExternalLink /></Link></header><div>{sections.map((section, index) => <article key={section.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{section.label}</strong><button disabled={!canEdit} onClick={() => setSections(current => current.map(item => item.id === section.id ? { ...item, enabled: !item.enabled } : item))}>{section.enabled ? <Eye /> : <EyeOff />}</button><button disabled={!canEdit || index === 0} onClick={() => move(index, -1)}><ArrowUp /></button><button disabled={!canEdit || index === sections.length - 1} onClick={() => move(index, 1)}><ArrowDown /></button></article>)}</div></section>
    </div>
    <section className="admin-page-directory"><header><p>CONTENT DIRECTORY</p><h2>Everything editable, one clear route</h2></header><div>{pageLinks.map(([label, href, description]) => <Link href={href} key={label}><LayoutTemplate /><span><strong>{label}</strong><small>{description}</small></span><ExternalLink /></Link>)}</div></section>
  </div>;
}

function Field({ label, help, value = "", onChange, full = false, textarea = false, disabled = false }: { label: string; help?: string; value?: string; onChange: (value: string) => void; full?: boolean; textarea?: boolean; disabled?: boolean }) {
  return <label className={full ? "full" : ""}><span>{label}</span>{help && <small className="admin-field-help">{help}</small>}{textarea ? <textarea rows={4} value={value} onChange={event => onChange(event.target.value)} disabled={disabled} /> : <input value={value} onChange={event => onChange(event.target.value)} disabled={disabled} />}</label>;
}
