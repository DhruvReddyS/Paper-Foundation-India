'use client';

import React from 'react';

interface PaperTextureProps {
  opacity?: number;
  type?: 'smooth' | 'grain' | 'kraft';
  className?: string;
}

export function PaperTexture({ opacity = 0.04, type = 'grain', className = '' }: PaperTextureProps) {
  const baseFrequency = type === 'smooth' ? '0.01' : type === 'kraft' ? '0.08' : '0.04';
  const numOctaves = type === 'smooth' ? 2 : type === 'kraft' ? 5 : 3;
  
  return (
    <div 
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-multiply ${className}`}
      style={{ opacity }}
    >
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id={`paper-texture-${type}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#paper-texture-${type})`} />
      </svg>
    </div>
  );
}
