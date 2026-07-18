"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { DataLayer } from "./DataLayerToggle";

interface StateData {
  id: string;
  name: string;
  x: number;
  y: number;
  production: number;
  consumption: number;
  recycling: number;
}

const states: StateData[] = [
  { id: "PB", name: "Punjab", x: 36, y: 24, production: 1700, consumption: 1500, recycling: 61 },
  { id: "UP", name: "Uttar Pradesh", x: 50, y: 34, production: 3500, consumption: 3200, recycling: 58 },
  { id: "GJ", name: "Gujarat", x: 27, y: 47, production: 2800, consumption: 2100, recycling: 68 },
  { id: "MP", name: "Madhya Pradesh", x: 43, y: 48, production: 1500, consumption: 1200, recycling: 55 },
  { id: "MH", name: "Maharashtra", x: 39, y: 60, production: 4200, consumption: 3800, recycling: 72 },
  { id: "WB", name: "West Bengal", x: 66, y: 49, production: 1800, consumption: 1900, recycling: 62 },
  { id: "OD", name: "Odisha", x: 58, y: 59, production: 1900, consumption: 1500, recycling: 60 },
  { id: "TS", name: "Telangana", x: 47, y: 65, production: 2200, consumption: 1900, recycling: 64 },
  { id: "AP", name: "Andhra Pradesh", x: 51, y: 71, production: 3100, consumption: 2600, recycling: 65 },
  { id: "KA", name: "Karnataka", x: 39, y: 72, production: 2200, consumption: 2000, recycling: 66 },
  { id: "TN", name: "Tamil Nadu", x: 44, y: 84, production: 2600, consumption: 2400, recycling: 70 },
  { id: "AS", name: "Assam", x: 78, y: 34, production: 900, consumption: 700, recycling: 49 },
];

interface IndiaMapSVGProps {
  activeLayer: DataLayer;
  onStateHover: (state: StateData | null, pos: { x: number; y: number }) => void;
}

const colorScales: Record<DataLayer, (val: number) => string> = {
  production: (val) => {
    if (val > 3500) return "#225534";
    if (val > 2500) return "#3d7a54";
    if (val > 1500) return "#8fae8b";
    return "#c5d9c3";
  },
  consumption: (val) => {
    if (val > 3000) return "#225534";
    if (val > 2000) return "#3d7a54";
    if (val > 1000) return "#8fae8b";
    return "#c5d9c3";
  },
  recycling: (val) => {
    if (val > 70) return "#225534";
    if (val > 65) return "#3d7a54";
    if (val > 60) return "#8fae8b";
    return "#c5d9c3";
  },
};

export default function IndiaMapSVG({ activeLayer, onStateHover }: IndiaMapSVGProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMouseEnter = (state: StateData, e: React.MouseEvent) => {
    setHoveredState(state.id);
    onStateHover(state, { x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
    if (!selectedState) onStateHover(null, { x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto aspect-[.88] w-full max-w-[680px]"
    >
      <Image src="/images/maps/india-state-outline.png" alt="State outline map of India" fill priority sizes="(max-width: 900px) 94vw, 680px" className="object-contain" />
      <div className="absolute inset-0">
        {states.map((state) => {
          const value = state[activeLayer];
          const fill = colorScales[activeLayer](value);
          return (
            <motion.button
              type="button"
              key={state.id}
              className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#fffaf0] text-[9px] font-bold text-white shadow-lg"
              style={{ left: `${state.x}%`, top: `${state.y}%`, background: fill, zIndex: hoveredState === state.id || selectedState === state.id ? 5 : 2 }}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: .94 }}
              onMouseEnter={(e) => handleMouseEnter(state, e)}
              onMouseLeave={handleMouseLeave}
              onClick={(event) => {
                const next = selectedState === state.id ? null : state.id;
                setSelectedState(next);
                onStateHover(next ? state : null, { x: event.clientX, y: event.clientY });
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: states.indexOf(state) * .03 }}
              aria-label={`Open ${state.name} paper indicators`}
            >{state.id}</motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export type { StateData };
