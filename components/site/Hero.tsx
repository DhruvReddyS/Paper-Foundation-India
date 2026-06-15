'use client';

import React from 'react';
import { PaperTexture } from '@/components/paper-ui/PaperTexture';
import { InkBleedText } from '@/components/paper-ui/InkBleedText';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundColour?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}

export default function Hero({
  title,
  subtitle,
  backgroundColour = '#f5f0e8',
  breadcrumb,
  className = '',
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden py-24 md:py-32 ${className}`}
      style={{ backgroundColor: backgroundColour }}
    >
      <PaperTexture opacity={0.04} type="grain" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {breadcrumb && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 text-sm text-stone-500">
              {breadcrumb.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  {item.href ? (
                    <a href={item.href} className="hover:text-[#1a3c2a] transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-stone-800 font-medium">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <InkBleedText as="h1" trigger="mount">
          {title}
        </InkBleedText>

        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
