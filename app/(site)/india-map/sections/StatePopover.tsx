"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { StateData } from "./IndiaMapSVG";
import type { DataLayer } from "./DataLayerToggle";

interface StatePopoverProps {
  state: StateData | null;
  position: { x: number; y: number };
  activeLayer: DataLayer;
}

const unitMap: Record<DataLayer, string> = {
  production: "K tonnes/yr",
  consumption: "K tonnes/yr",
  recycling: "% rate",
};

export default function StatePopover({ state, position, activeLayer }: StatePopoverProps) {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 bg-white rounded-xl shadow-xl border border-sage/20 p-4 min-w-[200px] pointer-events-none"
          style={{
            left: Math.min(position.x + 16, window?.innerWidth - 240 || 400),
            top: position.y - 20,
          }}
        >
          <h3 className="font-bold text-forest text-lg mb-2">{state.name}</h3>
          <div className="space-y-1.5">
            <div className={`flex justify-between text-sm ${activeLayer === "production" ? "font-semibold text-forest" : "text-forest/60"}`}>
              <span>Production</span>
              <span>{state.production.toLocaleString()} {unitMap.production}</span>
            </div>
            <div className={`flex justify-between text-sm ${activeLayer === "consumption" ? "font-semibold text-forest" : "text-forest/60"}`}>
              <span>Consumption</span>
              <span>{state.consumption.toLocaleString()} {unitMap.consumption}</span>
            </div>
            <div className={`flex justify-between text-sm ${activeLayer === "recycling" ? "font-semibold text-forest" : "text-forest/60"}`}>
              <span>Recycling</span>
              <span>{state.recycling}{unitMap.recycling}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
