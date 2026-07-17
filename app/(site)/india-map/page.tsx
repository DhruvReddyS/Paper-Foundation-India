"use client";

import { useState } from "react";
import DataLayerToggle, { type DataLayer } from "./sections/DataLayerToggle";
import IndiaMapSVG, { type StateData } from "./sections/IndiaMapSVG";
import StatePopover from "./sections/StatePopover";
import NationalStatsPanel from "./sections/NationalStatsPanel";
import styles from "../paper-everywhere-pages.module.css";

export default function IndiaMapPage() {
  const [activeLayer, setActiveLayer] = useState<DataLayer>("production");
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  const handleStateHover = (state: StateData | null, pos: { x: number; y: number }) => {
    setHoveredState(state);
    setPopoverPos(pos);
  };

  return (
    <main className={styles.mapPage}>
      <header className={styles.mapHeader}>
        <div><p>India fibre map / interactive pinboard</p><h1>One country. Many paper systems.</h1></div>
        <p>Switch the evidence layer, then move across the map. The figures are presented as an editorial data desk—not decorative heat marks.</p>
      </header>
      <div className={styles.mapDesk}>
        <aside className={styles.mapControls}><span>CHOOSE A DATA LAYER</span><DataLayerToggle active={activeLayer} onChange={setActiveLayer} /></aside>
        <div className={styles.mapCanvas}>
          <IndiaMapSVG activeLayer={activeLayer} onStateHover={handleStateHover} />
        </div>
      </div>
      <StatePopover state={hoveredState} position={popoverPos} activeLayer={activeLayer} />
      <NationalStatsPanel />
    </main>
  );
}
