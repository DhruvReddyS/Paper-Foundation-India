"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/site/Footer";
import Nav from "@/components/site/Nav";

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
