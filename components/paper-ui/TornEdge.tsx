import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TornEdgeProps {
  direction?: 'up' | 'down';
  fromColour?: string;
  toColour?: string;
  intensity?: 'subtle' | 'strong';
  className?: string;
}

export function TornEdge({
  direction = 'down',
  fromColour = 'var(--paper-white)',
  toColour = 'var(--paper-warm)',
  intensity = 'subtle',
  className = ''
}: TornEdgeProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, direction === 'down' ? -8 : 8]);

  const height = intensity === 'strong' ? 'h-8 md:h-12' : 'h-4 md:h-6';

  return (
    <div className={`relative w-full ${height} overflow-hidden ${className}`} style={{ backgroundColor: fromColour }}>
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y, backgroundColor: toColour }}
      >
        <svg 
          viewBox="0 0 1200 48" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full text-current"
          style={{ 
            color: fromColour, 
            transform: direction === 'up' ? 'rotate(180deg)' : 'none' 
          }}
        >
          {/* A jagged, hand-drawn style path simulating torn paper */}
          <path 
            fill="currentColor" 
            d="M0,0 L0,12 C40,15 80,8 120,13 C160,18 200,5 240,10 C280,15 320,11 360,16 C400,21 440,9 480,14 C520,19 560,12 600,16 C640,20 680,10 720,15 C760,20 800,13 840,17 C880,21 920,9 960,14 C1000,19 1040,11 1080,16 C1120,21 1160,8 1200,12 L1200,0 Z"
          />
        </svg>
      </motion.div>
    </div>
  );
}
