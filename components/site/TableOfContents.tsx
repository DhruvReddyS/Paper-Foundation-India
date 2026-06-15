'use client';

import React, { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  selector?: string;
  className?: string;
}

export default function TableOfContents({
  selector = 'article h2, article h3',
  className = '',
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const items: TocItem[] = Array.from(elements).map((el) => ({
      id: el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }));

    // Ensure IDs are set
    elements.forEach((el, i) => {
      if (!el.id && items[i]) {
        el.id = items[i].id;
      }
    });

    setHeadings(items);
  }, [selector]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={`sticky top-24 ${className}`} aria-label="Table of contents">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
        On this page
      </h4>
      <ul className="space-y-1.5 border-l-2 border-stone-200">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`
                block text-sm transition-colors duration-200 border-l-2 -ml-[2px]
                ${h.level === 3 ? 'pl-6' : 'pl-4'}
                ${
                  activeId === h.id
                    ? 'border-[#1a3c2a] text-[#1a3c2a] font-medium'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }
              `}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
