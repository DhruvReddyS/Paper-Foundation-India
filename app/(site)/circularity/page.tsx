"use client";

import { useState } from "react";
import CircularityHero from "./sections/CircularityHero";
import CircularityDiagram from "./sections/CircularityDiagram";
import NodeDetailPanel from "./sections/NodeDetailPanel";
import CircularityText from "./sections/CircularityText";

export default function CircularityPage() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-paper-warm">
      <CircularityHero />
      <CircularityDiagram activeNode={activeNode} onNodeClick={setActiveNode} />
      <NodeDetailPanel activeNode={activeNode} />
      <CircularityText />
    </main>
  );
}
