"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string; note: string };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { href: "/knowledge", label: "Field Notes", note: "Evidence-led articles" },
      { href: "/knowledge/how-fibre-sourcing-shapes-the-paper-story", label: "Cover Essay", note: "Read the featured fibre story" },
      { href: "/myths", label: "Myth or Material?", note: "Test common paper claims" },
      { href: "/glossary", label: "Paper Dictionary", note: "Terms made human" },
      { href: "/resources", label: "The Reading Room", note: "Reports, guides and downloads" },
      { href: "/search", label: "Search the Archive", note: "Find anything across the site" },
    ],
  },
  {
    label: "India & Fibre",
    items: [
      { href: "/journey", label: "Follow the Fibre", note: "From source to second life" },
      { href: "/india-map", label: "India Fibre Map", note: "Explore the story state by state" },
      { href: "/india-snapshot", label: "India by Numbers", note: "Facts, charts and context" },
      { href: "/circularity", label: "The Fibre Loop", note: "See how paper moves in circles" },
      { href: "/everyday-paper", label: "Paper Everywhere", note: "Find paper in daily life" },
    ],
  },
  {
    label: "Play",
    items: [
      { href: "/discover", label: "Discover", note: "Start at the interactive hub" },
      { href: "/games", label: "The Paper Playground", note: "Learn by playing" },
      { href: "/discover/grow-or-shred", label: "Grow or Shred", note: "Make the system-level choice" },
      { href: "/discover/hidden-paper", label: "Hidden Paper", note: "Spot paper in unexpected places" },
      { href: "/discover/mill-master", label: "Mill Master", note: "Put papermaking in order" },
      { href: "/discover/truth-press", label: "Truth Press", note: "Print the evidence, reject the myth" },
    ],
  },
  {
    label: "Foundation",
    items: [
      { href: "/about", label: "Our Foundation", note: "Mission, principles and people" },
      { href: "/get-involved", label: "Join the Fold", note: "Contribute, partner or participate" },
      { href: "/contact", label: "Contact Desk", note: "Reach the foundation directly" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  if (href === "/games") return pathname === "/games" || pathname.startsWith("/discover");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isItemActive(pathname: string, href: string) {
  return pathname === href;
}

export default function Nav() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLUListElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenGroup(null);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="site-header sticky top-0 z-50">
      <nav className="container-wide flex h-[72px] items-center justify-between" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-2" aria-label="Paper Foundation India home">
          <span className="site-brand-avatar" aria-hidden="true">
            <Image src="/images/brand/paper-foundation-logo.png" alt="" width={48} height={48} priority />
          </span>
          <span className="site-brand-name">Paper Foundation <small>India</small></span>
        </Link>

        <ul ref={menuRef} className="hidden items-center gap-6 lg:flex">
          <li>
            <Link href="/" className={`site-nav-link ${pathname === "/" ? "is-active" : ""}`} aria-current={pathname === "/" ? "page" : undefined}>
              Home
            </Link>
          </li>

          {navGroups.map((group) => {
            const groupActive = group.items.some((item) => isActive(pathname, item.href));
            const expanded = openGroup === group.label;
            return (
              <li key={group.label} className="site-nav-group">
                <button
                  type="button"
                  className={`site-nav-link site-nav-group-trigger ${groupActive ? "is-active" : ""}`}
                  onClick={() => setOpenGroup(expanded ? null : group.label)}
                  aria-expanded={expanded}
                  aria-haspopup="true"
                >
                  {group.label}<ChevronDown size={14} className={expanded ? "rotate-180" : ""} />
                </button>
                {expanded && (
                  <div className="site-nav-dropdown">
                    {group.items.map((item) => {
                      const active = isItemActive(pathname, item.href);
                      return (
                        <Link key={item.href} href={item.href} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
                          <strong>{item.label}</strong>
                          <span>{item.note}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}

        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/search" className="site-search" aria-label="Search the archive"><Search size={17} /></Link>
          <Link href="/get-involved" className="site-nav-cta">Join the fold <ArrowRight size={15} /></Link>
        </div>

        <button
          type="button"
          className="p-2 text-charcoal lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="site-mobile-menu max-h-[calc(100svh-72px)] overflow-y-auto px-5 pb-5 lg:hidden">
          <Link href="/" className={`site-mobile-nav-link mt-3 ${pathname === "/" ? "is-active" : ""}`}>Home</Link>
          {navGroups.map((group) => (
            <section key={group.label} className="site-mobile-nav-group">
              <p>{group.label}</p>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} className={`site-mobile-nav-link ${isItemActive(pathname, item.href) ? "is-active" : ""}`}>
                  <span>{item.label}</span><small>{item.note}</small>
                </Link>
              ))}
            </section>
          ))}
          <div className="mt-4 flex gap-3 border-t border-charcoal/10 pt-4">
            <Link href="/search" className="site-search" aria-label="Search the archive"><Search size={17} /></Link>
            <Link href="/get-involved" className="site-nav-cta flex-1 justify-center">Join the fold <ArrowRight size={15} /></Link>
          </div>
        </div>
      )}
    </header>
  );
}
