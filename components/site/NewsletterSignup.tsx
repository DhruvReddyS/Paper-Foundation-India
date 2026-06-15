'use client';

import React, { useState } from 'react';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'inline' | 'stacked';
}

export default function NewsletterSignup({
  className = '',
  variant = 'inline',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-[#1a3c2a] font-semibold">✓ You&apos;re subscribed!</p>
        <p className="text-sm text-stone-500 mt-1">Thank you for joining our community.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${variant === 'stacked' ? 'space-y-3' : 'flex gap-3'} ${className}`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={`rounded-full border border-stone-300 bg-white px-5 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1a3c2a]/30 focus:border-[#1a3c2a] transition-colors ${
          variant === 'stacked' ? 'w-full' : 'flex-1'
        }`}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 rounded-full bg-[#1a3c2a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245038] disabled:opacity-60 transition-colors"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
