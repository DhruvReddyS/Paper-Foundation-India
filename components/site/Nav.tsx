"use client";

import Link from "next/link";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/myths", label: "Myths vs Facts" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/india-snapshot", label: "India" },
  { href: "/journey", label: "Journey" },
  { href: "/games", label: "Games" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  if (href === "/games") {
    return pathname === "/games" || pathname.startsWith("/discover");
  }
  if (href === "/india-snapshot") {
    return pathname === href || pathname === "/india-map";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="site-header sticky top-0 z-50">
      <nav className="container-wide flex h-[72px] items-center justify-between" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-2" aria-label="Paper Foundation India home">
          <div className="site-logo-mark" aria-hidden="true">
            <span>P</span>
          </div>
          <span className="font-serif text-lg font-bold text-charcoal">
            Paper Foundation <small>India</small>
          </span>
        </Link>

        <ul className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`site-nav-link ${active ? "is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/search" className="site-search" aria-label="Search">
            <Search size={17} />
          </Link>
          <Link href="/get-involved" className="site-nav-cta">
            Get involved <ArrowRight size={15} />
          </Link>
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
        <div id="mobile-navigation" className="site-mobile-menu px-5 pb-5 lg:hidden">
          <ul className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-sm font-sans transition-colors ${
                      active ? "bg-forest/10 font-semibold text-forest" : "text-mid-grey hover:bg-forest/5 hover:text-forest"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex gap-3 border-t border-charcoal/10 pt-4">
            <Link href="/search" className="site-search" aria-label="Search">
              <Search size={17} />
            </Link>
            <Link href="/get-involved" className="site-nav-cta flex-1 justify-center">
              Get involved <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
