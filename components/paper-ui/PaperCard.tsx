import React from 'react';
import { PaperTexture } from './PaperTexture';

interface PaperCardProps {
  children: React.ReactNode;
  variant?: 'standard' | 'kraft' | 'white';
  hover?: 'stack' | 'lift' | 'none';
  className?: string;
}

export function PaperCard({
  children,
  variant = 'standard',
  hover = 'stack',
  className = ''
}: PaperCardProps) {
  const bgColors = {
    standard: 'bg-paper-white',
    kraft: 'bg-kraft',
    white: 'bg-white'
  };

  const hoverClasses = {
    stack: 'paper-stack',
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
    none: ''
  };

  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-sm border border-border/50 ${bgColors[variant]} ${hoverClasses[hover]} ${className}`}
    >
      {variant === 'kraft' && <PaperTexture type="kraft" opacity={0.06} />}
      {variant === 'standard' && <PaperTexture type="smooth" opacity={0.03} />}
      
      <div className="relative z-10 p-6 h-full">
        {children}
      </div>
    </div>
  );
}
