"use client";

import { motion } from "framer-motion";

export default function CorrectionsHeader() {
  return (
    <section className="bg-gradient-to-br from-forest to-dark-green py-20 text-paper-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-copper/20 text-copper text-sm font-medium uppercase mb-4">
            Transparency
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Corrections &amp; Updates
          </h1>
          <p className="text-lg text-paper-warm/80 max-w-2xl mx-auto leading-relaxed">
            We believe in radical transparency. When we make mistakes, we correct them
            publicly. This page documents every correction and significant update to our
            published content.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-paper-white/10 rounded-2xl p-8 border border-paper-white/20"
        >
          <h3 className="text-lg font-bold mb-4">Our Correction Standards</h3>
          <ul className="space-y-3 text-paper-warm/70">
            <li className="flex items-start gap-3">
              <span className="text-copper font-bold">•</span>
              <span>All factual errors are corrected within 48 hours of discovery.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-copper font-bold">•</span>
              <span>Original text is preserved with a strikethrough, and corrected text is clearly marked.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-copper font-bold">•</span>
              <span>Corrections are dated and include an explanation of what was changed and why.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-copper font-bold">•</span>
              <span>Readers can report errors via our contact page or email corrections@paperfoundation.in.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
