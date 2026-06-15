'use client';

import React, { useState } from 'react';

interface ArticleEditorProps {
  initialData?: {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    body: string;
    status: string;
    featured: boolean;
  };
  onSave?: (data: Record<string, unknown>) => void;
  className?: string;
}

const categories = [
  'Sustainability',
  'Innovation',
  'Recycling',
  'Industry',
  'Environment',
  'Education',
];

const toolbarButtons = [
  { label: 'B', title: 'Bold', style: 'font-bold' },
  { label: 'I', title: 'Italic', style: 'italic' },
  { label: 'H2', title: 'Heading 2', style: 'font-semibold text-xs' },
  { label: 'H3', title: 'Heading 3', style: 'font-medium text-xs' },
  { label: '•', title: 'Bullet List', style: '' },
  { label: '1.', title: 'Numbered List', style: 'text-xs' },
  { label: '"', title: 'Blockquote', style: 'font-serif' },
  { label: '<>', title: 'Code', style: 'font-mono text-xs' },
  { label: '🔗', title: 'Link', style: '' },
  { label: '📷', title: 'Image', style: '' },
];

export default function ArticleEditor({
  initialData,
  onSave,
  className = '',
}: ArticleEditorProps) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Sustainability',
    excerpt: initialData?.excerpt || '',
    body: initialData?.body || '',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
  });

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, title, slug });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article title..."
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm bg-stone-50 focus:outline-none"
          />
        </div>
      </div>

      {/* Category, Status, Featured */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30"
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
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-stone-300"
            />
            <span className="text-sm text-stone-700">Featured Article</span>
          </label>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Excerpt</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          placeholder="Brief summary..."
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30"
        />
      </div>

      {/* Editor Toolbar + Body */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Content</label>
        <div className="rounded-lg border border-stone-300 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-3 py-2 bg-stone-50 border-b border-stone-200 flex-wrap">
            {toolbarButtons.map((btn) => (
              <button
                key={btn.title}
                title={btn.title}
                type="button"
                className={`h-8 min-w-[32px] px-2 rounded text-stone-600 hover:bg-stone-200 transition-colors ${btn.style}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Content Area (Tiptap placeholder) */}
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={16}
            placeholder="Write your article content here... (Tiptap editor will be integrated here)"
            className="w-full px-4 py-3 text-sm focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => onSave?.(form)}
          className="rounded-lg bg-[#1a3c2a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#245038] transition-colors"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
