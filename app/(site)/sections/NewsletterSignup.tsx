"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 bg-paper-warm">
      <div className="container-narrow text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            Stay Informed
          </span>
          <h2 className="font-serif text-4xl font-bold text-charcoal mt-3 mb-4">
            The Paper Dispatch
          </h2>
          <p className="text-mid-grey max-w-md mx-auto mb-8">
            Monthly insights on sustainability, myth-busting, and India&apos;s paper story. No spam, just facts.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-forest/10 text-forest px-6 py-3 rounded-xl"
            >
              <span className="text-xl">✓</span>
              <span className="font-sans font-medium">
                You&apos;re subscribed! Check your inbox.
              </span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 w-full sm:w-auto px-4 py-3 rounded-xl border border-border bg-paper-white font-sans text-sm text-charcoal placeholder:text-mid-grey/50 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe →
              </button>
            </form>
          )}

          <p className="text-xs text-mid-grey/60 mt-4">
            Join 2,400+ readers · Unsubscribe anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
