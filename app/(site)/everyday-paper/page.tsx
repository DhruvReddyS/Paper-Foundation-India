"use client";

import EverydayHero from "./sections/EverydayHero";
import EverydayGrid from "./sections/EverydayGrid";

export default function EverydayPaperPage() {
  return (
    <main className="min-h-screen">
      <EverydayHero />
      <EverydayGrid />
    </main>
  );
}
