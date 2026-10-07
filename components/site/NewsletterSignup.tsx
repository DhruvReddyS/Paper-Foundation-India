'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

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
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const formStartedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const form = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter', consent, _website: form.get('_website'), formStartedAt: formStartedAt.current }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Subscription could not be started.');
      setMessage(result.confirmationRequired === false ? 'You are already subscribed.' : 'Check your inbox and confirm within 24 hours.');
      setStatus('success');
      setEmail('');
      setConsent(false);
      formStartedAt.current = Date.now();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-[#1a3c2a] font-semibold">✓ Almost there</p>
        <p className="text-sm text-stone-500 mt-1">{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${variant === 'stacked' ? 'space-y-3' : 'flex flex-wrap gap-3'} ${className}`}
    >
      <input aria-hidden="true" tabIndex={-1} autoComplete="off" name="_website" style={{ display: 'none' }} />
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
      <label className="flex basis-full items-start gap-2 text-xs text-stone-600"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5" /><span>I agree to receive updates and understand I can unsubscribe anytime. <Link className="underline" href="/privacy">Privacy notice</Link></span></label>
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
