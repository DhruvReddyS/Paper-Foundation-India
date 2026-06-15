"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Search, X } from "lucide-react";

/* ── Campaign Banner ─────────────────────────────────── */
function CampaignBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-forest text-white text-sm text-center py-2 px-4 relative">
      <span className="font-sans">
        <strong>New:</strong> Four evidence-led paper games are now open.{" "}
        <Link href="/games" className="underline hover:text-copper transition-colors">
          Enter the games lab <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
        aria-label="Dismiss banner"
      >
        <X size={15} />
      </button>
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────── */
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/myths", label: "Myths" },
    { href: "/knowledge", label: "Knowledge Hub" },
    { href: "/journey", label: "Paper Journey" },
    { href: "/games", label: "Games" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="site-header sticky top-0 z-50">
      <nav className="container-wide flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="site-logo-mark">
            <span>P</span>
          </div>
          <span className="font-serif font-bold text-lg text-charcoal">
            Paper Foundation <small>India</small>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="site-nav-link"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/search" className="site-search" aria-label="Search"><Search size={17} /></Link>
          <Link href="/get-involved" className="site-nav-cta">Get involved <ArrowRight size={15} /></Link>
        </div>

        <button
          className="md:hidden p-2 text-charcoal"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="site-mobile-menu md:hidden px-5 pb-5">
          <ul className="flex flex-col gap-3 pt-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm font-sans text-mid-grey hover:text-forest transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/* ── Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-lead"><p>One material.<br />Many lives.</p><Link href="/journey">Follow the fibre <ArrowRight /></Link></div>
      <div className="site-footer-grid">
        <div><h3>Paper Foundation <small>India</small></h3><p>A public, evidence-led platform for understanding paper through context rather than assumption.</p></div>
        <div><span>Explore</span><Link href="/knowledge">Knowledge hub</Link><Link href="/myths">Myths and facts</Link><Link href="/journey">Paper journey</Link><Link href="/games">Games lab</Link></div>
        <div><span>Foundation</span><Link href="/about">About us</Link><Link href="/corrections">Corrections</Link><Link href="/resources">Resources</Link><Link href="/contact">Contact</Link></div>
        <div><span>Participate</span><Link href="/get-involved">Get involved</Link><Link href="/newsroom">Newsroom</Link><Link href="/india-snapshot">India snapshot</Link><Link href="/circularity">Circularity</Link></div>
      </div>
      <div className="site-footer-bottom"><p>© {new Date().getFullYear()} Paper Foundation India</p><p>Evidence first. Sources open. Corrections visible.</p></div>
    </footer>
  );
}

/* ── Layout ──────────────────────────────────────────── */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const immersive = pathname === "/journey";

  return (
    <>
      {!immersive && <CampaignBanner />}
      {!immersive && <Nav />}
      <main className="min-h-screen">{children}</main>
      {!immersive && <Footer />}
    </>
  );
}
