'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CampaignBannerProps {
  message?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function CampaignBanner({
  message = '🌿 India recycles 70% of its paper — learn how the industry leads in sustainability.',
  ctaText = 'Read More',
  ctaHref = '/articles',
}: CampaignBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-[#1a3c2a] text-white py-2.5 px-6 z-[60]">
      <div className="mx-auto max-w-7xl flex items-center justify-center gap-3 text-sm">
        <p className="text-white/90">{message}</p>
        <Link
          href={ctaHref}
          className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 transition-colors"
        >
          {ctaText}
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1l12 12M13 1 1 13" />
          </svg>
        </button>
      </div>
    </div>
  );
}
