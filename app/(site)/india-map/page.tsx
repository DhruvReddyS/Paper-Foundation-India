"use client";

import { useState } from "react";
import MapHero from "./sections/MapHero";
import DataLayerToggle, { type DataLayer } from "./sections/DataLayerToggle";
import IndiaMapSVG, { type StateData } from "./sections/IndiaMapSVG";
import StatePopover from "./sections/StatePopover";
import NationalStatsPanel from "./sections/NationalStatsPanel";

export default function IndiaMapPage() {
  const [activeLayer, setActiveLayer] = useState<DataLayer>("production");
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  const handleStateHover = (state: StateData | null, pos: { x: number; y: number }) => {
    setHoveredState(state);
    setPopoverPos(pos);
  };

  return (
    <main className="bg-paper-warm min-h-screen">
      <MapHero />
      <DataLayerToggle active={activeLayer} onChange={setActiveLayer} />
      <div className="max-w-5xl mx-auto px-6">
        <IndiaMapSVG activeLayer={activeLayer} onStateHover={handleStateHover} />
      </div>
      <StatePopover state={hoveredState} position={popoverPos} activeLayer={activeLayer} />
      <NationalStatsPanel />
    </main>
  );
}
