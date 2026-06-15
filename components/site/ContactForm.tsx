'use client';

import React, { useState } from 'react';

interface ContactFormProps {
  className?: string;
  onSubmit?: (data: ContactFormData) => void;
}

export interface ContactFormData {
  name: string;
  email: string;
  organisation: string;
  type: string;
  subject: string;
  message: string;
}

const inquiryTypes = [
  'General Inquiry',
  'Media & Press',
  'Partnership',
  'Educational Collaboration',
  'Speaking Request',
  'Report an Error',
];

export default function ContactForm({ className = '', onSubmit }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    organisation: '',
    type: 'General Inquiry',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      if (onSubmit) {
        onSubmit(form);
      } else {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setStatus('sent');
      setForm({ name: '', email: '', organisation: '', type: 'General Inquiry', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30 focus:border-[#1a3c2a] transition-colors';

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Organisation</label>
          <input
            type="text"
            value={form.organisation}
            onChange={(e) => setForm({ ...form, organisation: e.target.value })}
            placeholder="Your organisation"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Inquiry Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputClass}
          >
            {inquiryTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Subject *</label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="What is this about?"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Your message..."
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-[#1a3c2a] px-8 py-3 text-sm font-semibold text-white hover:bg-[#245038] disabled:opacity-60 transition-colors"
      >
        {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Message Sent!' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600 text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
