'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  icon?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  icon = '📊',
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-stone-200 bg-white p-5 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-stone-900">{value}</p>
          {change && (
            <p
              className={`text-xs font-medium mt-1.5 ${
                change.positive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.positive ? '↑' : '↓'} {Math.abs(change.value)}%
              <span className="text-stone-400 ml-1">vs last month</span>
            </p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
