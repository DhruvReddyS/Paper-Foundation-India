'use client';
import React, { useEffect, useState } from 'react';

interface InkBleedTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'display';
  trigger?: 'mount' | 'inview';
  className?: string;
}

export function InkBleedText({
  children,
  as = 'h1',
  trigger = 'mount',
  className = ''
}: InkBleedTextProps) {
  const [animating, setAnimating] = useState(trigger === 'mount');

  useEffect(() => {
    if (trigger === 'mount') {
      // Small delay to ensure render
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const Component = as === 'display' ? 'h1' : as;
  
  const baseClasses = as === 'display' ? 'text-5xl md:text-7xl font-serif font-bold tracking-tight' 
                    : as === 'h1' ? 'text-4xl md:text-5xl font-serif font-bold tracking-tight'
                    : 'text-3xl md:text-4xl font-serif font-semibold';

  return (
    <Component 
      className={`${baseClasses} ink-bleed ${animating ? 'animating' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}
