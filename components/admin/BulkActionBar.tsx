'use client';

import React from 'react';

interface BulkActionBarProps {
  selectedCount: number;
  onDelete?: () => void;
  onPublish?: () => void;
  onArchive?: () => void;
  onClear?: () => void;
  className?: string;
}

export default function BulkActionBar({
  selectedCount,
  onDelete,
  onPublish,
  onArchive,
  onClear,
  className = '',
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-xl bg-[#1c1c1e] text-white px-6 py-3 shadow-2xl ${className}`}
    >
      <span className="text-sm">
        <span className="font-bold">{selectedCount}</span> item{selectedCount !== 1 ? 's' : ''}{' '}
        selected
      </span>

      <div className="h-5 w-px bg-white/20" />

      {onPublish && (
        <button
          onClick={onPublish}
          className="rounded-lg bg-[#1a3c2a] px-4 py-1.5 text-xs font-semibold hover:bg-[#245038] transition-colors"
        >
          Publish
        </button>
      )}
      {onArchive && (
        <button
          onClick={onArchive}
          className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"
        >
          Archive
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      )}

      {onClear && (
        <>
          <div className="h-5 w-px bg-white/20" />
          <button
            onClick={onClear}
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            Clear selection
          </button>
        </>
      )}
    </div>
  );
}
