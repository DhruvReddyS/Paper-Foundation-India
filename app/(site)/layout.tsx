"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import Nav from "@/components/site/Nav";

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

/* ── Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-lead"><p>One material.<br />Many lives.</p><Link href="/journey">Follow the fibre <ArrowRight /></Link></div>
      <div className="site-footer-grid">
        <div><h3>Paper Foundation <small>India</small></h3><p>A public, evidence-led platform for understanding paper through context rather than assumption.</p></div>
        <div><span>Explore</span><Link href="/knowledge">Knowledge hub</Link><Link href="/myths">Myths and facts</Link><Link href="/journey">Paper journey</Link><Link href="/games">Games lab</Link></div>
        <div><span>Foundation</span><Link href="/about">About us</Link><Link href="/resources">Resources</Link><Link href="/glossary">Glossary</Link><Link href="/contact">Contact</Link></div>
        <div><span>Participate</span><Link href="/get-involved">Get involved</Link><Link href="/india-map">India map</Link><Link href="/india-snapshot">India snapshot</Link><Link href="/circularity">Circularity</Link></div>
      </div>
      <div className="site-footer-bottom"><p>© {new Date().getFullYear()} Paper Foundation India</p><p>Evidence first. Sources open. Context visible.</p></div>
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
      <Nav />
      <main className="min-h-screen">{children}</main>
      {!immersive && <Footer />}
    </>
  );
}
