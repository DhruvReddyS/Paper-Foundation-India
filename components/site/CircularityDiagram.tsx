'use client';

import React from 'react';

const nodes = [
  { label: 'Sustainable\nForestry', angle: 0, emoji: '🌲' },
  { label: 'Pulp &\nPaper Making', angle: 60, emoji: '🏭' },
  { label: 'Paper\nProducts', angle: 120, emoji: '📦' },
  { label: 'Consumer\nUse', angle: 180, emoji: '📄' },
  { label: 'Collection &\nRecycling', angle: 240, emoji: '♻️' },
  { label: 'New\nFibre', angle: 300, emoji: '🌱' },
];

export default function CircularityDiagram({ className = '' }: { className?: string }) {
  const cx = 200;
  const cy = 200;
  const r = 140;

  return (
    <div className={`flex justify-center ${className}`}>
      <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-full">
        {/* Central ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#1a3c2a"
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity={0.3}
        />

        {/* Arrow ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 20}
          fill="none"
          stroke="#a8b5a0"
          strokeWidth="1.5"
          strokeDasharray="12 6"
          opacity={0.5}
        />

        {/* Center Text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="text-sm font-bold fill-[#1a3c2a]"
        >
          Circular
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          className="text-sm font-bold fill-[#1a3c2a]"
        >
          Economy
        </text>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const rad = (node.angle - 90) * (Math.PI / 180);
          const nx = cx + r * Math.cos(rad);
          const ny = cy + r * Math.sin(rad);

          return (
            <g key={i}>
              <circle cx={nx} cy={ny} r={32} fill="#f5f0e8" stroke="#1a3c2a" strokeWidth="2" />
              <text x={nx} y={ny - 6} textAnchor="middle" className="text-lg">
                {node.emoji}
              </text>
              <text
                x={nx}
                y={ny + 14}
                textAnchor="middle"
                className="text-[8px] font-semibold fill-stone-700"
              >
                {node.label.split('\n').map((line, li) => (
                  <tspan key={li} x={nx} dy={li === 0 ? 0 : 10}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
