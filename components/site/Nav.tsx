"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string; note: string };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Knowledge Desk",
    items: [
      { href: "/myths", label: "Myth or Material?", note: "Test common paper claims" },
      { href: "/knowledge", label: "Field Notes", note: "Evidence-led articles" },
      { href: "/glossary", label: "Paper Dictionary", note: "Terms made human" },
    ],
  },
  {
    label: "India in Paper",
    items: [
      { href: "/india-map", label: "India Fibre Map", note: "Explore the story state by state" },
      { href: "/india-snapshot", label: "India by Numbers", note: "Facts, charts and context" },
    ],
  },
  {
    label: "Explore",
    items: [
      { href: "/journey", label: "Follow the Fibre", note: "From source to second life" },
      { href: "/games", label: "The Paper Playground", note: "Learn by playing" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  if (href === "/games") return pathname === "/games" || pathname.startsWith("/discover");
  return pathname === href || pathname.startsWith(`${href}/`);
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
          <div className="site-logo-mark" aria-hidden="true"><span>P</span></div>
          <span className="font-serif text-lg font-bold text-charcoal">
            Paper Foundation <small>India</small>
          </span>
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
                      const active = isActive(pathname, item.href);
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

          <li>
            <Link href="/about" className={`site-nav-link ${isActive(pathname, "/about") ? "is-active" : ""}`} aria-current={isActive(pathname, "/about") ? "page" : undefined}>
              Our Foundation
            </Link>
          </li>
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
                <Link key={item.href} href={item.href} className={`site-mobile-nav-link ${isActive(pathname, item.href) ? "is-active" : ""}`}>
                  <span>{item.label}</span><small>{item.note}</small>
                </Link>
              ))}
            </section>
          ))}
          <Link href="/about" className={`site-mobile-nav-link mt-2 ${isActive(pathname, "/about") ? "is-active" : ""}`}>Our Foundation</Link>
          <div className="mt-4 flex gap-3 border-t border-charcoal/10 pt-4">
            <Link href="/search" className="site-search" aria-label="Search the archive"><Search size={17} /></Link>
            <Link href="/get-involved" className="site-nav-cta flex-1 justify-center">Join the fold <ArrowRight size={15} /></Link>
          </div>
        </div>
      )}
    </header>
  );
}
