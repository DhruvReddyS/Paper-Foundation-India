"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/site/Nav";

/* ── Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-lead"><p>One material.<br />Many lives.</p><Link href="/journey">Follow the fibre <ArrowRight /></Link></div>
      <div className="site-footer-grid">
        <div><h3>Paper Foundation <small>India</small></h3><p>A public, evidence-led platform for understanding paper through context rather than assumption.</p></div>
        <div><span>Knowledge Desk</span><Link href="/knowledge">Field Notes</Link><Link href="/myths">Myth or Material?</Link><Link href="/glossary">Paper Dictionary</Link><Link href="/resources">The Reading Room</Link></div>
        <div><span>Explore</span><Link href="/journey">Follow the Fibre</Link><Link href="/games">Paper Playground</Link><Link href="/circularity">The Fibre Loop</Link><Link href="/everyday-paper">Paper Everywhere</Link></div>
        <div><span>India & Foundation</span><Link href="/india-map">India Fibre Map</Link><Link href="/india-snapshot">India by Numbers</Link><Link href="/about">Our Foundation</Link><Link href="/get-involved">Join the Fold</Link></div>
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
      <Nav />
      <main className="min-h-screen">{children}</main>
      {!immersive && <Footer />}
    </>
  );
}
