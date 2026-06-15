import React from 'react';
import Link from 'next/link';
import { FibreParticles } from '../../../components/paper-ui/FibreParticles';
import { InkBleedText } from '../../../components/paper-ui/InkBleedText';
import { PaperBadge } from '../../../components/paper-ui/PaperBadge';

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden bg-paper-white">
      {/* Background Particles */}
      <FibreParticles density="medium" colour="var(--sage)" />
      
      {/* Decorative SVG behind text */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-forest">
          <circle cx="50" cy="50" r="45" />
          <circle cx="70" cy="30" r="20" className="fill-sage" />
          <path d="M20,80 Q50,20 80,80 Z" className="fill-copper" />
        </svg>
      </div>

      <div className="container-wide relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="text-sage uppercase tracking-widest text-sm font-semibold mb-4">
                Paper Foundation India
              </p>
              <InkBleedText as="display">
                India&apos;s paper story is remarkable. Most people just haven&apos;t heard it yet.
              </InkBleedText>
            </div>
            
            <p className="text-lg md:text-xl text-mid-grey max-w-xl font-sans">
              Evidence-based awareness about paper, recycling, and circularity in India. Use paper without hesitation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/knowledge" className="btn-primary">
                Explore the Evidence
              </Link>
              <Link href="/discover/grow-or-shred" className="btn-secondary">
                Test Your Assumptions
              </Link>
            </div>
            
            <div className="pt-8">
              <PaperBadge label="Use Paper Without Hesitation" variant="forest" />
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-sage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </section>
  );
}
