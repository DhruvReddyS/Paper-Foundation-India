"use client";

import { Check, ChevronRight, Copy, ExternalLink, HelpCircle, KeyRound, RefreshCw, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Service = { id: string; label: string; provider: string; required: boolean; ready: boolean; keys: string[] };
type Status = { services: Service[]; ready: number; total: number; preview: boolean };

const setupLinks: Record<string, string> = {
  database: "https://cloud.mongodb.com/",
  media: "https://console.cloudinary.com/",
  admin: "https://console.cloud.google.com/apis/credentials",
  campaigns: "https://console.cloud.google.com/apis/credentials",
  analytics: "https://analytics.google.com/",
  site: "/",
};

export default function AdminSettings() {
  const [data, setData] = useState<Status>({ services: [], ready: 0, total: 0, preview: true });
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/system-status");
    setData(await response.json());
  }, []);
  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => data.services.filter(service => `${service.label} ${service.provider} ${service.keys.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [data.services, query]);
  const percent = data.total ? Math.round((data.ready / data.total) * 100) : 0;
  async function copy(key: string) {
    await navigator.clipboard.writeText(`${key}=`);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1400);
  }

  return <div className="admin-settings">
    <header className="admin-workspace-heading"><div><p>System and integrations</p><h1>Setup centre</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Recheck connections</button></div></header>

    <section className="admin-setup-hero">
      <div><p>WORKSPACE READINESS</p><strong>{percent}%</strong><span>{data.ready} of {data.total} services connected</span></div>
      <div className="admin-setup-progress"><i style={{ width: `${percent}%` }} /></div>
      <aside><ShieldCheck /><span><strong>{data.preview ? "Preview access is active" : "Secure access is active"}</strong><small>{data.preview ? "Add the authentication keys before deployment." : "Google OAuth and the administrator allowlist are protecting this workspace."}</small></span></aside>
    </section>

    <div className="admin-toolbar"><label><KeyRound /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a service or environment key" /></label><span>{filtered.length} integrations</span></div>

    <section className="admin-integration-grid">
      {filtered.map(service => <article key={service.id} className={service.ready ? "is-ready" : ""}>
        <header><div><i>{service.ready ? <Check /> : <Wrench />}</i><span><strong>{service.label}</strong><small>{service.provider}</small></span></div><em>{service.ready ? "Connected" : service.required ? "Setup needed" : "Optional"}</em></header>
        <div>{service.keys.map(key => <button key={key} onClick={() => void copy(key)} title={`Copy ${key}`}><code>{key}</code>{copied === key ? <Check /> : <Copy />}</button>)}</div>
        <footer>
          {setupLinks[service.id].startsWith("/") ? <Link href={setupLinks[service.id]} target="_blank">Open website <ChevronRight /></Link> : <a href={setupLinks[service.id]} target="_blank" rel="noreferrer">Open {service.provider} <ExternalLink /></a>}
        </footer>
      </article>)}
    </section>

    <section className="admin-env-guide">
      <HelpCircle />
      <div><strong>Where do these values go?</strong><p>Create a file named <code>.env.local</code> in the project root, add one key per line, then restart the development server. Never commit that file.</p></div>
      <button onClick={() => void navigator.clipboard.writeText(data.services.flatMap(service => service.keys).map(key => `${key}=`).join("\n"))}><Copy /> Copy complete template</button>
    </section>
  </div>;
}
