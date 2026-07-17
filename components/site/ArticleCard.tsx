'use client';

import React from 'react';
import Link from 'next/link';
import { PaperBadge } from '@/components/paper-ui/PaperBadge';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category?: string;
  coverImage?: string;
  readingTime?: number;
  date?: string;
  className?: string;
}

export default function ArticleCard({
  title,
  excerpt,
  slug,
  category = 'Sustainability',
  coverImage = '/images/knowledge/editorial-v2/method.jpg',
  readingTime = 5,
  date,
  className = '',
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`} className={`group block ${className}`}>
      <article className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Cover Image */}
        <div className="relative aspect-[16/9] bg-stone-200 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
          <div className="absolute top-3 left-3">
            <PaperBadge label={category} variant="forest" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-stone-400 mb-2">
            {date && <time>{date}</time>}
            {date && <span>·</span>}
            <span>{readingTime} min read</span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 leading-snug group-hover:text-[#1a3c2a] transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="mt-2 text-sm text-stone-500 leading-relaxed line-clamp-3">{excerpt}</p>

          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1a3c2a]">
            Read more
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M1 7h12M8 2l5 5-5 5" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
