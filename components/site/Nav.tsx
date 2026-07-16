"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookMarked,
  BookOpen,
  Building2,
  ChevronDown,
  FileText,
  Gamepad2,
  Library,
  Mail,
  MapPinned,
  Menu,
  PackageOpen,
  Recycle,
  Search,
  Sprout,
  Stamp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavCard = {
  href: string;
  label: string;
  kicker: string;
  description: string;
  icon: LucideIcon;
  tone: "green" | "copper" | "blue" | "berry";
  featured?: boolean;
};

type NavGroup = { label: string; slug: string; cards: NavCard[] };

const navGroups: NavGroup[] = [
  {
    label: "Knowledge Hub",
    slug: "knowledge",
    cards: [
      { href: "/knowledge", label: "Articles", kicker: "01 · Read", description: "Evidence-led stories and explainers", icon: BookOpen, tone: "green", featured: true },
      { href: "/knowledge/how-fibre-sourcing-shapes-the-paper-story", label: "Cover Article", kicker: "02 · Featured", description: "How fibre sourcing shapes the paper story", icon: FileText, tone: "copper" },
      { href: "/resources", label: "Resources", kicker: "03 · Library", description: "Reports, guides and source documents", icon: Library, tone: "blue" },
      { href: "/glossary", label: "Glossary", kicker: "04 · Terms", description: "Paper language, clearly defined", icon: BookMarked, tone: "berry" },
    ],
  },
  {
    label: "Discover",
    slug: "discover",
    cards: [
      { href: "/games", label: "Games Lab", kicker: "Playable edition", description: "All four evidence-led paper games in one place", icon: Gamepad2, tone: "green", featured: true },
      { href: "/discover/grow-or-shred", label: "Grow or Shred", kicker: "Game 01", description: "Grow evidence into a living tree", icon: Sprout, tone: "green" },
      { href: "/discover/hidden-paper", label: "Hidden Paper", kicker: "Game 02", description: "Find fibre hiding in daily life", icon: Search, tone: "blue" },
      { href: "/discover/mill-master", label: "Mill Master", kicker: "Game 03", description: "Build the paper process in order", icon: PackageOpen, tone: "copper" },
      { href: "/discover/truth-press", label: "Truth Press", kicker: "Game 04", description: "Stamp claims with the right verdict", icon: Stamp, tone: "berry" },
    ],
  },
  {
    label: "Paper Everywhere",
    slug: "paper",
    cards: [
      { href: "/everyday-paper", label: "Everyday Paper", kicker: "01 · Products", description: "See where paper lives around you", icon: PackageOpen, tone: "copper", featured: true },
      { href: "/india-map", label: "India Fibre Map", kicker: "02 · Map", description: "Explore the paper story state by state", icon: MapPinned, tone: "green" },
      { href: "/india-snapshot", label: "India Facts & Numbers", kicker: "03 · Data", description: "Production, recovery, trade and people", icon: BarChart3, tone: "blue" },
      { href: "/circularity", label: "Paper Circularity", kicker: "04 · Loop", description: "Follow fibre through use and recovery", icon: Recycle, tone: "berry" },
    ],
  },
  {
    label: "Foundation",
    slug: "foundation",
    cards: [
      { href: "/about", label: "About Us", kicker: "01 · Story", description: "Our mission, principles and people", icon: Building2, tone: "green", featured: true },
      { href: "/get-involved", label: "Get Involved", kicker: "02 · Participate", description: "Contribute, collaborate or partner", icon: Users, tone: "copper" },
      { href: "/contact", label: "Contact", kicker: "03 · Connect", description: "Reach the foundation directly", icon: Mail, tone: "blue" },
    ],
  },
];

function routeMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/games") return pathname === "/games" || pathname === "/discover";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavTicket({ card }: { card: NavCard }) {
  const Icon = card.icon;
  return (
    <Link href={card.href} className={`site-nav-ticket tone-${card.tone} ${card.featured ? "is-featured" : ""}`}>
      <span className="site-nav-ticket-kicker">{card.kicker}</span>
      <Icon className="site-nav-ticket-icon" aria-hidden="true" />
      <strong>{card.label}</strong>
      <small>{card.description}</small>
      <ArrowUpRight className="site-nav-ticket-arrow" aria-hidden="true" />
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const desktopMenuRef = useRef<HTMLUListElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMobileGroup(null);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) setOpenGroup(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className="site-header sticky top-0 z-50">
      <nav className="container-wide flex h-[68px] items-center justify-between" aria-label="Primary navigation">
        <Link href="/" className="site-brand" aria-label="Paper Foundation India home">
          <span className="site-brand-avatar" aria-hidden="true"><Image src="/images/brand/paper-foundation-logo.png" alt="" width={42} height={42} priority /></span>
          <span className="site-brand-name">Paper Foundation <small>India</small></span>
        </Link>

        <ul ref={desktopMenuRef} className="site-desktop-nav hidden items-center lg:flex">
          <li><Link href="/" className={`site-nav-link ${pathname === "/" ? "is-active" : ""}`}>Home</Link></li>
          <li><Link href="/myths" className={`site-nav-link ${routeMatches(pathname, "/myths") ? "is-active" : ""}`}>Myths vs Facts</Link></li>

          {navGroups.slice(0, 1).map((group) => <NavGroupMenu key={group.slug} group={group} pathname={pathname} openGroup={openGroup} setOpenGroup={setOpenGroup} />)}

          <li><Link href="/journey" className={`site-nav-link ${routeMatches(pathname, "/journey") ? "is-active" : ""}`}>Paper Journey</Link></li>

          {navGroups.slice(1).map((group) => <NavGroupMenu key={group.slug} group={group} pathname={pathname} openGroup={openGroup} setOpenGroup={setOpenGroup} />)}
        </ul>

        <div className="flex items-center gap-1.5">
          <Link href="/search" className="site-search" aria-label="Search"><Search size={17} /></Link>
          <button type="button" className="site-menu-toggle lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="site-mobile-menu max-h-[calc(100svh-68px)] overflow-y-auto lg:hidden">
          <div className="container-wide py-4">
            <div className="site-mobile-primary"><Link href="/">Home</Link><Link href="/myths">Myths vs Facts</Link><Link href="/journey">Paper Journey</Link></div>
            {navGroups.map((group) => (
              <section key={group.slug} className={`site-mobile-nav-group mobile-section-${group.slug}`}>
                <button type="button" className="site-mobile-group-trigger" onClick={() => setMobileGroup(mobileGroup === group.slug ? null : group.slug)} aria-expanded={mobileGroup === group.slug}>
                  <span><small>{String(group.cards.length).padStart(2, "0")} pages</small><strong>{group.label}</strong></span>
                  <ChevronDown size={18} className={mobileGroup === group.slug ? "rotate-180" : ""} />
                </button>
                {mobileGroup === group.slug && <div className="site-mobile-ticket-grid">{group.cards.map((card) => <NavTicket key={card.href} card={card} />)}</div>}
              </section>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function NavGroupMenu({ group, pathname, openGroup, setOpenGroup }: { group: NavGroup; pathname: string; openGroup: string | null; setOpenGroup: (value: string | null) => void }) {
  const active = group.cards.some((card) => routeMatches(pathname, card.href));
  const expanded = openGroup === group.slug;
  return (
    <li className={`site-nav-group group-${group.slug}`}>
      <button type="button" className={`site-nav-link site-nav-group-trigger ${active ? "is-active" : ""}`} onClick={() => setOpenGroup(expanded ? null : group.slug)} aria-expanded={expanded} aria-haspopup="true">
        {group.label}<ChevronDown size={13} className={expanded ? "rotate-180" : ""} />
      </button>
      {expanded && <div className={`site-mega-menu menu-${group.slug}`}><div className="site-mega-menu-heading"><span>{group.label}</span><small>Choose a page</small></div><div className="site-mega-grid">{group.cards.map((card) => <NavTicket key={card.href} card={card} />)}</div></div>}
    </li>
  );
}
