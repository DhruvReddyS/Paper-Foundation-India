'use client';

import React, { useState } from 'react';

interface MythEditorProps {
  initialData?: {
    myth: string;
    fact: string;
    explanation: string;
    category: string;
    tags: string[];
    sources: string[];
    status: string;
  };
  onSave?: (data: Record<string, unknown>) => void;
  className?: string;
}

const categories = ['Environment', 'Recycling', 'Production', 'Health', 'Economy', 'General'];

export default function MythEditor({ initialData, onSave, className = '' }: MythEditorProps) {
  const [form, setForm] = useState({
    myth: initialData?.myth || '',
    fact: initialData?.fact || '',
    explanation: initialData?.explanation || '',
    category: initialData?.category || 'General',
    tags: initialData?.tags?.join(', ') || '',
    sources: initialData?.sources?.join('\n') || '',
    status: initialData?.status || 'draft',
  });

  const handleSubmit = () => {
    onSave?.({
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sources: form.sources.split('\n').map((s) => s.trim()).filter(Boolean),
    });
  };

  const inputClass =
    'w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30';

  return (
    <div className={`space-y-5 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Myth Statement</label>
        <textarea
          value={form.myth}
          onChange={(e) => setForm({ ...form, myth: e.target.value })}
          rows={2}
          placeholder="The commonly held myth..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Fact / Truth</label>
        <textarea
          value={form.fact}
          onChange={(e) => setForm({ ...form, fact: e.target.value })}
          rows={2}
          placeholder="The actual fact..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Detailed Explanation</label>
        <textarea
          value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          rows={4}
          placeholder="Full explanation with context..."
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Tags <span className="text-stone-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="deforestation, sustainability, recycling"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Sources <span className="text-stone-400">(one per line)</span>
        </label>
        <textarea
          value={form.sources}
          onChange={(e) => setForm({ ...form, sources: e.target.value })}
          rows={3}
          placeholder="FAO Report 2023&#10;IPPTA Journal"
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 justify-end pt-2">
        <button
          type="button"
          className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg bg-[#1a3c2a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#245038] transition-colors"
        >
          Save Myth
        </button>
      </div>
    </div>
  );
}
