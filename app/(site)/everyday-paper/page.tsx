"use client";

import PaperEverywhere from "@/components/home/sections/paper-everywhere/PaperEverywhere";
import EverydayGrid from "./sections/EverydayGrid";
import PaperFeatureExplorer from "@/components/editorial/PaperFeatureExplorer";

export default function EverydayPaperPage() {
  return (
    <main className="min-h-screen">
      <PaperEverywhere />
      <PaperFeatureExplorer />
      <div id="everyday-atlas"><EverydayGrid /></div>
    </main>
  );
}
