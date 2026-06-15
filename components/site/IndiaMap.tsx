'use client';

import React from 'react';

interface IndiaMapProps {
  highlightedStates?: string[];
  className?: string;
}

export default function IndiaMap({ highlightedStates = [], className = '' }: IndiaMapProps) {
  // Simplified India map outline placeholder
  return (
    <div className={`flex justify-center ${className}`}>
      <svg
        width="400"
        height="450"
        viewBox="0 0 400 450"
        className="max-w-full"
        aria-label="Map of India showing paper industry presence"
      >
        {/* Simplified India outline */}
        <path
          d="M200,20 C170,20 140,30 120,50 C100,70 90,100 85,130 
             C80,160 75,190 70,210 C65,230 55,250 50,270 
             C45,290 50,310 60,330 C70,350 85,370 100,385 
             C115,400 135,410 155,415 C175,420 195,425 200,430 
             C205,425 225,420 245,415 C265,410 285,400 300,385 
             C315,370 330,350 340,330 C350,310 355,290 350,270 
             C345,250 340,230 335,210 C330,190 325,170 320,150 
             C315,130 305,100 290,75 C275,50 250,30 230,22 
             C215,18 207,18 200,20 Z"
          fill="#e8f5e9"
          stroke="#1a3c2a"
          strokeWidth="2"
        />

        {/* Major regions (placeholder dots) */}
        {[
          { x: 150, y: 120, label: 'Delhi NCR', active: true },
          { x: 120, y: 200, label: 'Maharashtra', active: true },
          { x: 250, y: 160, label: 'West Bengal', active: true },
          { x: 180, y: 300, label: 'Karnataka', active: false },
          { x: 220, y: 350, label: 'Tamil Nadu', active: true },
          { x: 140, y: 160, label: 'Gujarat', active: true },
          { x: 280, y: 120, label: 'Assam', active: false },
          { x: 200, y: 230, label: 'Andhra Pradesh', active: false },
        ].map((dot, i) => {
          const isHighlighted =
            highlightedStates.length === 0
              ? dot.active
              : highlightedStates.includes(dot.label);

          return (
            <g key={i}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r={isHighlighted ? 8 : 5}
                fill={isHighlighted ? '#1a3c2a' : '#a8b5a0'}
                opacity={isHighlighted ? 1 : 0.5}
              />
              {isHighlighted && (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={14}
                  fill="none"
                  stroke="#1a3c2a"
                  strokeWidth="1"
                  opacity={0.3}
                />
              )}
              <text
                x={dot.x}
                y={dot.y - 14}
                textAnchor="middle"
                className={`text-[9px] ${
                  isHighlighted ? 'fill-stone-800 font-semibold' : 'fill-stone-400'
                }`}
              >
                {dot.label}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(10, 420)">
          <circle cx={8} cy={4} r={4} fill="#1a3c2a" />
          <text x={18} y={8} className="text-[10px] fill-stone-600">
            Major Paper Hubs
          </text>
        </g>
      </svg>
    </div>
  );
}
