"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  Building2,
  ChevronDown,
  FileText,
  Flag,
  Gamepad2,
  HeartHandshake,
  Library,
  Mail,
  MapPinned,
  Menu,
  PackageOpen,
  Grid3X3,
  Recycle,
  Search,
  Sprout,
  Stamp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GooeySearch } from "@/components/ui/gooey-search";
import { searchSite } from "@/content/searchIndex";

type NavItem = { href: string; label: string; description: string; icon: LucideIcon };
type NavGroup = { label: string; slug: string; eyebrow: string; introduction: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Knowledge Hub",
    slug: "knowledge",
    eyebrow: "Evidence and learning",
    introduction: "Read researched perspectives, consult source material and understand the language of paper.",
    items: [
      { href: "/knowledge", label: "Articles", description: "Editorial stories and explainers", icon: BookOpen },
      { href: "/knowledge/featured", label: "Featured Articles", description: "Our special long-form reading room", icon: FileText },
      { href: "/resources", label: "Resources", description: "Reports, guides and source documents", icon: Library },
      { href: "/glossary", label: "Glossary", description: "Clear definitions for paper terminology", icon: BookMarked },
    ],
  },
  {
    label: "Discover",
    slug: "discover",
    eyebrow: "Interactive learning",
    introduction: "Short, evidence-led activities that make paper knowledge easier to explore and remember.",
    items: [
      { href: "/games", label: "Games Lab", description: "Begin with the complete games collection", icon: Gamepad2 },
      { href: "/discover/grow-or-shred", label: "Grow or Shred", description: "Test system-level choices", icon: Sprout },
      { href: "/discover/hidden-paper", label: "Hidden Paper", description: "Find fibre in unexpected places", icon: Search },
      { href: "/discover/mill-master", label: "Mill Master", description: "Build the papermaking sequence", icon: PackageOpen },
      { href: "/discover/truth-press", label: "Truth Press", description: "Evaluate familiar paper claims", icon: Stamp },
      { href: "/discover/paper-word-search", label: "Fibre Word Search", description: "Find ten paper words against the clock", icon: Grid3X3 },
    ],
  },
  {
    label: "Paper Everywhere",
    slug: "paper",
    eyebrow: "Paper in context",
    introduction: "See how paper moves through Indian industry, daily life and circular material systems.",
    items: [
      { href: "/everyday-paper", label: "Everyday Paper", description: "Paper products around us", icon: PackageOpen },
      { href: "/india-map", label: "India Fibre Map", description: "Explore the story state by state", icon: MapPinned },
      { href: "/india-snapshot", label: "India Facts & Numbers", description: "Production, recovery, trade and people", icon: BarChart3 },
      { href: "/circularity", label: "Paper Circularity", description: "Follow fibre through use and recovery", icon: Recycle },
    ],
  },
  {
    label: "Foundation",
    slug: "foundation",
    eyebrow: "About the organisation",
    introduction: "Learn about our public mission, participate in the work or contact the foundation.",
    items: [
      { href: "/about", label: "About Us", description: "Mission, principles and people", icon: Building2 },
      { href: "/join", label: "Join the Foundation", description: "Complete the membership application", icon: Users },
      { href: "/contact", label: "Contact", description: "Reach the foundation directly", icon: Mail },
      { href: "/report", label: "Report a Claim", description: "Send misinformation for review", icon: Flag },
    ],
  },
];

function routeMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/games") return pathname === "/games" || pathname === "/discover";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const desktopMenuRef = useRef<HTMLUListElement>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 24); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function closeOutside(event: MouseEvent) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) setOpenGroup(null);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} sticky top-0 z-50`}>
      <nav className="container-wide flex h-[72px] items-center justify-between" aria-label="Primary navigation">
        <Link href="/" className="site-brand" aria-label="Paper Foundation India home">
          <Image src="/images/brand/paper-foundation-nav-logo.png" alt="" width={40} height={49} priority />
          <span><strong>Paper Foundation</strong><small>India</small></span>
        </Link>

        <ul ref={desktopMenuRef} className="site-desktop-nav hidden items-center xl:flex">
          <li><Link href="/" className={`site-nav-link ${pathname === "/" ? "is-active" : ""}`}>Home</Link></li>
          <li><Link href="/myths" className={`site-nav-link ${routeMatches(pathname, "/myths") ? "is-active" : ""}`}>Myths vs Facts</Link></li>
          <li><Link href="/journey" className={`site-nav-link ${routeMatches(pathname, "/journey") ? "is-active" : ""}`}>Paper Journey</Link></li>
          <DesktopGroup group={navGroups[0]} pathname={pathname} openGroup={openGroup} setOpenGroup={setOpenGroup} />
          {navGroups.slice(1).map((group) => <DesktopGroup key={group.slug} group={group} pathname={pathname} openGroup={openGroup} setOpenGroup={setOpenGroup} />)}
        </ul>

        <div className="site-nav-actions">
          <div className="site-nav-quick hidden xl:flex">
            <Link href="/join" className="site-nav-join"><HeartHandshake /> Join us</Link>
            <Link href="/contact" className="site-nav-contact"><Mail /> Contact</Link>
          </div>
          <GooeySearch
            key={`desktop-search-${pathname}`}
            className="site-gooey-search hidden md:inline-flex"
            onSearch={(query) => searchSite(query, 7)}
            buttonLabel="Search"
            placeholder="Search everything..."
            maxResults={7}
            debounceMs={90}
            onSelect={(result) => { if (result.href) router.push(result.href); }}
          />
          <GooeySearch
            key={`mobile-search-${pathname}`}
            className="site-gooey-search md:hidden"
            onSearch={(query) => searchSite(query, 7)}
            buttonLabel="Search"
            placeholder="Search everything..."
            maxResults={7}
            debounceMs={70}
            onSelect={(result) => { if (result.href) router.push(result.href); }}
          />
          <button type="button" className="site-menu-toggle xl:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="site-mobile-menu max-h-[calc(100svh-72px)] overflow-y-auto xl:hidden">
          <div className="container-wide py-3">
            <div className="site-mobile-primary"><Link href="/">Home</Link><Link href="/myths">Myths vs Facts</Link><Link href="/journey">Paper Journey</Link></div>
            <div className="site-mobile-actions"><Link href="/join"><HeartHandshake /> Join us</Link><Link href="/contact"><Mail /> Contact</Link><Link href="/report"><Flag /> Report a claim</Link></div>
            {navGroups.map((group) => {
              const expanded = mobileGroup === group.slug;
              return (
                <section key={group.slug} className={`site-mobile-section group-${group.slug} ${expanded ? "is-expanded" : ""}`}>
                  <button type="button" onClick={() => setMobileGroup(expanded ? null : group.slug)} aria-expanded={expanded}>
                    <span>{group.label}</span><ChevronDown size={17} className={expanded ? "rotate-180" : ""} />
                  </button>
                  {expanded && <div className="site-mobile-links">{group.items.map((item) => <MenuLink key={item.href} item={item} />)}</div>}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

function DesktopGroup({ group, pathname, openGroup, setOpenGroup }: { group: NavGroup; pathname: string; openGroup: string | null; setOpenGroup: (value: string | null) => void }) {
  const expanded = openGroup === group.slug;
  const active = group.items.some((item) => routeMatches(pathname, item.href));
  return (
    <li className={`site-nav-group group-${group.slug}`}>
      <button type="button" className={`site-nav-link ${active ? "is-active" : ""}`} onClick={() => setOpenGroup(expanded ? null : group.slug)} aria-expanded={expanded} aria-haspopup="true">
        {group.label}<ChevronDown size={13} className={expanded ? "rotate-180" : ""} />
      </button>
      {expanded && (
        <div className="site-mega-menu">
          <div className="site-mega-intro"><span>{group.eyebrow}</span><h2>{group.label}</h2><p>{group.introduction}</p><i aria-hidden="true" /></div>
          <div className="site-mega-links">{group.items.map((item) => <MenuLink key={item.href} item={item} />)}</div>
        </div>
      )}
    </li>
  );
}

function MenuLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="site-menu-link">
      <Icon aria-hidden="true" />
      <span><strong>{item.label}</strong><small>{item.description}</small></span>
      <ArrowRight className="site-menu-link-arrow" aria-hidden="true" />
    </Link>
  );
}
