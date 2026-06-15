'use client';

import React, { useState } from 'react';

interface CorrectionEntry {
  id: string;
  date: string;
  articleTitle: string;
  originalText: string;
  correctedText: string;
  reason: string;
}

interface CorrectionLogProps {
  corrections?: CorrectionEntry[];
  className?: string;
}

const sampleCorrections: CorrectionEntry[] = [
  {
    id: '1',
    date: '2024-12-15',
    articleTitle: 'The Water Footprint of Paper Production',
    originalText: 'Paper production uses 10,000 litres per tonne.',
    correctedText: 'Paper production uses approximately 10–20 cubic metres per tonne, varying by mill.',
    reason: 'Updated with more accurate range from IPPTA 2024 data.',
  },
  {
    id: '2',
    date: '2024-11-28',
    articleTitle: 'India\'s Recycling Infrastructure',
    originalText: 'India has 200 recycling facilities.',
    correctedText: 'India has over 500 registered recycling units as per CPCB 2023.',
    reason: 'Corrected outdated statistic.',
  },
];

export default function CorrectionLog({
  corrections = sampleCorrections,
  className = '',
}: CorrectionLogProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-4">
        Correction Log
      </h3>

      {corrections.map((c) => (
        <div key={c.id} className="rounded-lg border border-stone-200 bg-white overflow-hidden">
          <button
            onClick={() => setOpenId(openId === c.id ? null : c.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-stone-800">{c.articleTitle}</p>
              <p className="text-xs text-stone-400 mt-0.5">{c.date}</p>
            </div>
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${openId === c.id ? 'rotate-180' : ''}`}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>

          {openId === c.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase mb-1">Original</p>
                <p className="text-sm text-stone-600 line-through">{c.originalText}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-700 uppercase mb-1">Corrected</p>
                <p className="text-sm text-stone-800">{c.correctedText}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Reason</p>
                <p className="text-sm text-stone-600">{c.reason}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
