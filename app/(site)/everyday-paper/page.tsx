"use client";

import PaperEverywhere from "@/components/home/sections/paper-everywhere/PaperEverywhere";
import EverydayGrid from "./sections/EverydayGrid";

export default function EverydayPaperPage() {
  return (
    <main className="min-h-screen">
      <PaperEverywhere />
      <EverydayGrid />
    </main>
  );
}
