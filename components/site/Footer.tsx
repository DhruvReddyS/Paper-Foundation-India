'use client';

import React from 'react';
import Link from 'next/link';
import { TornEdge } from '@/components/paper-ui/TornEdge';

const columns = [
  {
    title: 'Learn',
    links: [
      { label: 'Our Foundation', href: '/about' },
      { label: 'Myth or Material?', href: '/myths' },
      { label: 'Field Notes', href: '/knowledge' },
      { label: 'Paper Dictionary', href: '/glossary' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'The Reading Room', href: '/resources' },
      { label: 'Paper Playground', href: '/games' },
      { label: 'Follow the Fibre', href: '/journey' },
      { label: 'The Fibre Loop', href: '/circularity' },
    ],
  },
  {
    title: 'Engage',
    links: [
      { label: 'Join the Fold', href: '/get-involved' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'India Fibre Map', href: '/india-map' },
      { label: 'India by Numbers', href: '/india-snapshot' },
    ],
  },
];

const socialLinks = [
  { label: 'Twitter', icon: '𝕏', href: '#' },
  { label: 'LinkedIn', icon: 'in', href: '#' },
  { label: 'Instagram', icon: '📷', href: '#' },
  { label: 'YouTube', icon: '▶', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative">
      <TornEdge direction="up" fromColour="#1a3c2a" toColour="transparent" intensity="strong" />

      <div className="bg-[#1a3c2a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PF</span>
                </div>
                <span className="font-bold text-lg">Paper Foundation</span>
              </div>
              <p className="text-sm text-white/70 mb-6 leading-relaxed">
                Science-backed education about India&apos;s paper industry — sustainability,
                innovation, and the truth about paper.
              </p>

              {/* Newsletter */}
              <div>
                <p className="text-sm font-semibold mb-2">Stay Updated</p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-white text-[#1a3c2a] px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Link Columns */}
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Paper Foundation India. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
