"use client";

import {
  BarChart3, BookOpen, Boxes, ChevronLeft, FileText, FolderOpen,
  Gamepad2, Image as ImageIcon, Inbox, LayoutDashboard, Menu, Search, Settings,
  Users, UserCog, X, LogOut, MailPlus,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const groups = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }, { label: "Analytics", href: "/admin/analytics", icon: BarChart3 }] },
  { label: "Website", items: [{ label: "Website controls", href: "/admin/website", icon: LayoutDashboard }, { label: "Articles", href: "/admin/articles", icon: FileText }, { label: "Myths and facts", href: "/admin/myths", icon: Boxes }, { label: "Games", href: "/admin/games", icon: Gamepad2 }, { label: "Glossary", href: "/admin/glossary", icon: BookOpen }, { label: "Resources", href: "/admin/resources", icon: FolderOpen }, { label: "Media", href: "/admin/media", icon: ImageIcon }] },
  { label: "Audience", items: [{ label: "Email campaigns", href: "/admin/campaigns", icon: MailPlus }, { label: "Subscribers", href: "/admin/subscribers", icon: Users }, { label: "Inbox", href: "/admin/inquiries", icon: Inbox }] },
  { label: "System", items: [{ label: "Administrators", href: "/admin/users", icon: UserCog }, { label: "Settings", href: "/admin/settings", icon: Settings }] },
];

export default function AdminShell({ children, preview = false }: { children: React.ReactNode; preview?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [command, setCommand] = useState(false);
  const [query, setQuery] = useState("");
  const allItems = useMemo(() => groups.flatMap(group => group.items), []);
  const matches = allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  const currentLabel = allItems.find(item => item.href === pathname || (item.href !== "/admin" && pathname.startsWith(item.href)))?.label ?? "Dashboard";

  useEffect(() => {
    function key(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommand(value => !value); }
      if (event.key === "Escape") setCommand(false);
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  if (pathname === "/admin/login") return <>{children}</>;

  return <div className={`admin-root ${compact ? "is-compact" : ""}`}>
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <header><Link href="/admin"><span>PF</span><div><strong>Paper Foundation</strong><small>Editorial control room</small></div></Link><button onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></header>
      <nav>
        {groups.map(group => <section key={group.label}><p>{group.label}</p>{group.items.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return <Link title={item.label} onClick={() => setOpen(false)} className={active ? "is-active" : ""} href={item.href} key={item.href}><Icon /><span>{item.label}</span>{active && <i />}</Link>;
        })}</section>)}
      </nav>
      <footer><div><i className={preview ? "is-preview" : ""} /><span><strong>{preview ? "Preview workspace" : "CMS connected"}</strong><small>{preview ? "Safe demonstration mode" : "Live data environment"}</small></span></div><button onClick={() => setCompact(value => !value)} aria-label="Toggle compact sidebar"><ChevronLeft /></button></footer>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><button onClick={() => setOpen(true)} className="admin-menu" aria-label="Open navigation"><Menu /></button><div className="admin-top-context"><small>EDITORIAL WORKSPACE</small><strong>{currentLabel}</strong></div><button className="admin-search" onClick={() => setCommand(true)}><Search /><span>Find any admin tool</span><kbd>⌘ K</kbd></button><div className={`admin-status ${preview ? "is-preview" : ""}`}><i /><span>{preview ? "Preview mode" : "Workspace ready"}</span></div><Link href="/" target="_blank">View live site</Link>{preview ? <Link className="admin-avatar" href="/admin/login" title="Exit preview" aria-label="Exit preview"><LogOut /></Link> : <button className="admin-avatar" onClick={() => void signOut({ callbackUrl: "/admin/login" })} title="Sign out" aria-label="Sign out"><LogOut /></button>}</header>
      <main className="admin-content">{children}</main>
    </div>
    {command && <div className="admin-command-backdrop" onMouseDown={() => setCommand(false)}><div className="admin-command" onMouseDown={event => event.stopPropagation()}><header><Search /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Go to a workspace..." /><button onClick={() => setCommand(false)}><X /></button></header><div>{matches.map(item => { const Icon = item.icon; return <Link onClick={() => setCommand(false)} href={item.href} key={item.href}><Icon /><span>{item.label}</span><small>Open</small></Link>; })}</div></div></div>}
  </div>;
}
