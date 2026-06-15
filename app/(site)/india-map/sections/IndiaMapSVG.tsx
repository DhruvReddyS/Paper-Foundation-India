"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DataLayer } from "./DataLayerToggle";

interface StateData {
  id: string;
  name: string;
  d: string;
  production: number;
  consumption: number;
  recycling: number;
}

// Simplified representative paths for key states
const states: StateData[] = [
  { id: "MH", name: "Maharashtra", d: "M140,320 L180,310 L190,350 L160,370 L130,360 Z", production: 4200, consumption: 3800, recycling: 72 },
  { id: "GJ", name: "Gujarat", d: "M100,280 L140,270 L150,310 L120,330 L90,320 Z", production: 2800, consumption: 2100, recycling: 68 },
  { id: "AP", name: "Andhra Pradesh", d: "M180,380 L230,370 L240,410 L200,430 L170,420 Z", production: 3100, consumption: 2600, recycling: 65 },
  { id: "TN", name: "Tamil Nadu", d: "M200,440 L240,430 L250,480 L220,500 L190,490 Z", production: 2600, consumption: 2400, recycling: 70 },
  { id: "UP", name: "Uttar Pradesh", d: "M190,200 L260,190 L270,240 L220,260 L180,250 Z", production: 3500, consumption: 3200, recycling: 58 },
  { id: "WB", name: "West Bengal", d: "M280,260 L310,250 L320,310 L300,330 L270,320 Z", production: 1800, consumption: 1900, recycling: 62 },
  { id: "KA", name: "Karnataka", d: "M150,390 L190,380 L200,430 L170,450 L140,440 Z", production: 2200, consumption: 2000, recycling: 66 },
  { id: "MP", name: "Madhya Pradesh", d: "M150,260 L220,250 L230,300 L180,320 L140,310 Z", production: 1500, consumption: 1200, recycling: 55 },
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

  const handleMouseEnter = (state: StateData, e: React.MouseEvent) => {
    setHoveredState(state.id);
    onStateHover(state, { x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
    onStateHover(null, { x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center py-4"
    >
      <svg viewBox="50 100 320 450" className="w-full max-w-lg h-auto">
        {/* India outline (simplified) */}
        <path
          d="M180,120 L280,130 L320,180 L330,260 L310,340 L270,400 L240,460 L220,510 L200,520 L180,500 L160,460 L130,400 L100,350 L80,300 L90,240 L120,180 Z"
          fill="#f5f0e8"
          stroke="#225534"
          strokeWidth="1.5"
          opacity={0.3}
        />

        {/* States */}
        {states.map((state) => {
          const value = state[activeLayer];
          const fill = colorScales[activeLayer](value);

          return (
            <motion.path
              key={state.id}
              d={state.d}
              fill={fill}
              stroke={hoveredState === state.id ? "#fff" : "#225534"}
              strokeWidth={hoveredState === state.id ? 2 : 0.5}
              className="cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onMouseEnter={(e) => handleMouseEnter(state, e as unknown as React.MouseEvent)}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* State labels */}
        {states.map((state) => {
          const match = state.d.match(/M(\d+),(\d+)/);
          if (!match) return null;
          const x = parseInt(match[1]) + 20;
          const y = parseInt(match[2]) + 20;
          return (
            <text
              key={`label-${state.id}`}
              x={x}
              y={y}
              fontSize="8"
              fill="#225534"
              fontWeight="600"
              textAnchor="middle"
              className="pointer-events-none"
            >
              {state.id}
            </text>
          );
        })}
      </svg>
    </motion.div>
  );
}

export type { StateData };
