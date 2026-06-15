"use client";

import { motion } from "framer-motion";

interface CircularityDiagramProps {
  activeNode: number | null;
  onNodeClick: (index: number) => void;
}

const nodes = [
  { label: "Sustainable Sourcing", icon: "🌱", angle: 0 },
  { label: "Production", icon: "🏭", angle: 60 },
  { label: "Distribution", icon: "🚛", angle: 120 },
  { label: "Use & Reuse", icon: "📝", angle: 180 },
  { label: "Collection", icon: "📦", angle: 240 },
  { label: "Recycling", icon: "♻️", angle: 300 },
];

export default function CircularityDiagram({ activeNode, onNodeClick }: CircularityDiagramProps) {
  const radius = 140;
  const center = 200;

  return (
    <section className="py-12 px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative"
      >
        <svg viewBox="0 0 400 400" className="w-80 h-80 md:w-[420px] md:h-[420px]">
          {/* Central ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#8fae8b"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Directional arrows along ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#225534"
            strokeWidth="3"
            strokeDasharray="502"
            initial={{ strokeDashoffset: 880 }}
            whileInView={{ strokeDashoffset: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />

          {/* Center label */}
          <text x={center} y={center - 8} textAnchor="middle" fill="#225534" fontSize="14" fontWeight="700">
            Circular
          </text>
          <text x={center} y={center + 12} textAnchor="middle" fill="#225534" fontSize="14" fontWeight="700">
            Economy
          </text>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const rad = (node.angle - 90) * (Math.PI / 180);
            const x = center + radius * Math.cos(rad);
            const y = center + radius * Math.sin(rad);
            const isActive = activeNode === i;

            return (
              <g key={node.label} onClick={() => onNodeClick(i)} className="cursor-pointer">
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isActive ? 32 : 28}
                  fill={isActive ? "#225534" : "#fff"}
                  stroke="#225534"
                  strokeWidth="2"
                  whileHover={{ scale: 1.1 }}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="20"
                  className="pointer-events-none"
                >
                  {node.icon}
                </text>
              </g>
            );
          })}
        </svg>

        {/* External labels */}
        {nodes.map((node, i) => {
          const rad = (node.angle - 90) * (Math.PI / 180);
          const labelRadius = radius + 55;
          const x = center + labelRadius * Math.cos(rad);
          const y = center + labelRadius * Math.sin(rad);
          const isActive = activeNode === i;

          return (
            <button
              key={`label-${node.label}`}
              onClick={() => onNodeClick(i)}
              className={`absolute text-xs font-medium text-center leading-tight transition-colors -translate-x-1/2 -translate-y-1/2 ${
                isActive ? "text-forest font-bold" : "text-forest/60"
              }`}
              style={{
                left: `${(x / 400) * 100}%`,
                top: `${(y / 400) * 100}%`,
              }}
            >
              {node.label}
            </button>
          );
        })}
      </motion.div>
    </section>
  );
}
