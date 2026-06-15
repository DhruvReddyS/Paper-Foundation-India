'use client';

import React from 'react';

interface PaperStackProps {
  children: React.ReactNode;
  className?: string;
}

export default function PaperStack({ children, className = '' }: PaperStackProps) {
  return (
    <div className={`paper-stack relative ${className}`}>
      {children}

      <style jsx>{`
        .paper-stack {
          position: relative;
        }
        .paper-stack::before,
        .paper-stack::after {
          content: '';
          position: absolute;
          left: 4px;
          right: 4px;
          bottom: -4px;
          height: 100%;
          border-radius: 0.75rem;
          background: #e8dfd3;
          z-index: -1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .paper-stack::after {
          left: 8px;
          right: 8px;
          bottom: -8px;
          background: #ddd4c6;
          z-index: -2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
}
