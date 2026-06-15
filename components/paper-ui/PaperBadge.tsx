import React from 'react';

interface PaperBadgeProps {
  label: string;
  variant?: 'sage' | 'forest' | 'copper';
  className?: string;
}

export function PaperBadge({
  label,
  variant = 'sage',
  className = ''
}: PaperBadgeProps) {
  const bgColors = {
    sage: 'bg-sage',
    forest: 'bg-forest',
    copper: 'bg-copper'
  };

  return (
    <span 
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-white uppercase ${bgColors[variant]} shadow-sm ${className}`}
    >
      {label}
    </span>
  );
}
