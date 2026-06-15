'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/myths', label: 'Myths vs Facts' },
  { href: '/articles', label: 'Articles' },
  { href: '/resources', label: 'Resources' },
  { href: '/games', label: 'Games' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setVisible(y < lastScrollY.current || y < 40);
      lastScrollY.current = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}
        ${visible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#1a3c2a] flex items-center justify-center">
            <span className="text-white font-bold text-sm">PF</span>
          </div>
          <span className={`font-bold text-lg ${scrolled ? 'text-stone-900' : 'text-white'}`}>
            Paper Foundation
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#1a3c2a] ${
                  scrolled ? 'text-stone-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + Search */}
        <div className="hidden md:flex items-center gap-4">
          <button
            aria-label="Search"
            className={`p-2 rounded-lg transition-colors ${
              scrolled ? 'text-stone-600 hover:bg-stone-100' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="6" />
              <path d="M12.5 12.5 16 16" />
            </svg>
          </button>
          <Link
            href="/contact"
            className="rounded-full bg-[#1a3c2a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#245038] transition-colors"
          >
            Get Involved
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 transition-all ${
                scrolled ? 'bg-stone-800' : 'bg-white'
              } ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block h-0.5 w-6 transition-all ${
                scrolled ? 'bg-stone-800' : 'bg-white'
              } ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-6 transition-all ${
                scrolled ? 'bg-stone-800' : 'bg-white'
              } ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <ul className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-stone-700 font-medium text-lg hover:text-[#1a3c2a]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                className="block w-full rounded-full bg-[#1a3c2a] px-5 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Get Involved
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
