'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperBadge } from '@/components/paper-ui/PaperBadge';

interface MythCardProps {
  myth: string;
  fact: string;
  category?: string;
  sources?: string[];
  className?: string;
}

export default function MythCard({
  myth,
  fact,
  category = 'General',
  sources = [],
  className = '',
}: MythCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={`perspective-1000 cursor-pointer ${className}`}
      onClick={() => setRevealed(!revealed)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setRevealed(!revealed)}
      aria-label={revealed ? 'Show myth' : 'Reveal fact'}
    >
      <motion.div
        className="relative w-full min-h-[280px]"
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — Myth */}
        <div
          className="absolute inset-0 rounded-xl bg-[#c4a97d] p-6 flex flex-col justify-between shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <PaperBadge label={category} variant="forest" />
            <p className="mt-4 text-xl font-bold text-stone-900 leading-snug">&ldquo;{myth}&rdquo;</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700/60">
              Myth
            </span>
            <span className="text-xs text-stone-700/50">Tap to reveal →</span>
          </div>
        </div>

        {/* Back — Fact */}
        <div
          className="absolute inset-0 rounded-xl bg-white p-6 flex flex-col justify-between shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <PaperBadge label="Fact" variant="sage" />
            <p className="mt-4 text-lg font-medium text-stone-800 leading-relaxed">{fact}</p>
          </div>
          {sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-stone-200">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Sources
              </p>
              <ul className="text-xs text-stone-500 space-y-0.5">
                {sources.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
