"use client";

import { motion } from "framer-motion";

export type DataLayer = "production" | "consumption" | "recycling";

interface DataLayerToggleProps {
  active: DataLayer;
  onChange: (layer: DataLayer) => void;
}

const layers: { key: DataLayer; label: string; icon: string }[] = [
  { key: "production", label: "Production", icon: "🏭" },
  { key: "consumption", label: "Consumption", icon: "📊" },
  { key: "recycling", label: "Recycling", icon: "♻️" },
];

export default function DataLayerToggle({ active, onChange }: DataLayerToggleProps) {
  return (
    <div className="flex justify-center gap-3 py-6">
      {layers.map((layer) => (
        <motion.button
          key={layer.key}
          onClick={() => onChange(layer.key)}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
            active === layer.key
              ? "bg-forest text-paper-white shadow-md"
              : "bg-white text-forest border border-sage/30 hover:border-forest/30"
          }`}
        >
          <span>{layer.icon}</span>
          {layer.label}
        </motion.button>
      ))}
    </div>
  );
}
