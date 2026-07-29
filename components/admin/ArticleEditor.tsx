'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface ArticleEditorProps {
  initialData?: {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    body: string;
    status: string;
    featured: boolean;
    coverImage?: string;
    readingMinutes?: number;
    revisionNote?: string;
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
  { label: 'Link', title: 'Link', style: 'text-xs' },
  { label: 'Image', title: 'Image', style: 'text-xs' },
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
    coverImage: initialData?.coverImage || '',
    readingMinutes: initialData?.readingMinutes || 6,
    revisionNote: initialData?.revisionNote || '',
  });
  const draftKey = `pfi:article-draft:${initialData?.slug || 'new'}`;
  const wordCount = useMemo(() => form.body.trim() ? form.body.trim().split(/\s+/).length : 0, [form.body]);
  const suggestedMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const readiness = useMemo(() => [
    { label: 'Clear title', ready: form.title.trim().length >= 20 },
    { label: 'Useful excerpt', ready: form.excerpt.trim().length >= 80 },
    { label: 'Substantial reading content', ready: wordCount >= 600 },
    { label: 'Cover asset', ready: Boolean(form.coverImage) },
    { label: 'Revision note', ready: Boolean(form.revisionNote.trim()) },
  ], [form.coverImage, form.excerpt, form.revisionNote, form.title, wordCount]);
  const readyCount = readiness.filter(item => item.ready).length;

  useEffect(() => {
    if (!initialData) {
      const saved = window.localStorage.getItem(draftKey);
      if (saved) {
        try { setForm(current => ({ ...current, ...JSON.parse(saved) })); } catch {}
      }
    }
  }, [draftKey, initialData]);

  useEffect(() => {
    const timer = window.setTimeout(() => window.localStorage.setItem(draftKey, JSON.stringify(form)), 500);
    return () => window.clearTimeout(timer);
  }, [draftKey, form]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, title, slug });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <section className="admin-editor-readiness">
        <div><span>{readyCount === readiness.length ? <CheckCircle2 /> : <AlertCircle />}</span><div><small>EDITORIAL READINESS</small><strong>{readyCount} of {readiness.length} checks complete</strong><p>These checks guide quality without blocking a draft save.</p></div></div>
        <ul>{readiness.map(item => <li className={item.ready ? 'is-ready' : ''} key={item.label}>{item.ready ? <CheckCircle2 /> : <i />}{item.label}</li>)}</ul>
      </section>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">Cover asset URL</label>
          <input
            type="url"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="Paste a URL copied from Media"
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Reading time</label>
          <input
            type="number"
            min={1}
            max={90}
            value={form.readingMinutes}
            onChange={(e) => setForm({ ...form, readingMinutes: Number(e.target.value) })}
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30"
          />
          {wordCount > 0 && <button type="button" className="admin-editor-suggestion" onClick={() => setForm(current => ({ ...current, readingMinutes: suggestedMinutes }))}><Sparkles /> Use {suggestedMinutes} min from word count</button>}
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
                onClick={() => {
                  const snippets: Record<string, string> = { Bold: '**bold text**', Italic: '*italic text*', 'Heading 2': '\\n## Heading\\n', 'Heading 3': '\\n### Heading\\n', 'Bullet List': '\\n- List item\\n', 'Numbered List': '\\n1. List item\\n', Blockquote: '\\n> Note\\n', Code: '`code`', Link: '[label](https://)', Image: '![alternative text](https://)' };
                  setForm(current => ({ ...current, body: `${current.body}${snippets[btn.title] || ''}` }));
                }}
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
            placeholder="Write the complete article in clear sections. Use the toolbar to add simple Markdown structure."
            className="w-full px-4 py-3 text-sm focus:outline-none resize-none"
          />
        </div>
        <div className="flex justify-between pt-2 text-xs text-stone-500"><span>{wordCount.toLocaleString()} words · about {suggestedMinutes} min</span><span>Draft saved locally as you type</span></div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Revision note</label>
        <input value={form.revisionNote} onChange={(e) => setForm({ ...form, revisionNote: e.target.value })} placeholder="What changed in this revision?" className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => onSave?.({ ...form, status: 'draft' })}
          className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem(draftKey);
            onSave?.(form);
          }}
          className="rounded-lg bg-[#1a3c2a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#245038] transition-colors"
        >
          {form.status === 'published' ? 'Publish changes' : 'Save article'}
        </button>
      </div>
    </div>
  );
}
