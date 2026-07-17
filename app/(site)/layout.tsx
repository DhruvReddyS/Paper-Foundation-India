"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/site/Footer";
import Nav from "@/components/site/Nav";
import PaperCursor from "@/components/site/PaperCursor";
import PageTransition from "@/components/site/PageTransition";

/* ── Layout ──────────────────────────────────────────── */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const immersive =
    /^\/discover\/(grow-or-shred|truth-press|mill-master|hidden-paper|paper-word-search)$/.test(pathname);

  return (
    <>
      <PaperCursor />
      {!immersive && <Nav />}
      <main className="min-h-screen"><PageTransition>{children}</PageTransition></main>
      {!immersive && <Footer />}
    </>
  );
}
