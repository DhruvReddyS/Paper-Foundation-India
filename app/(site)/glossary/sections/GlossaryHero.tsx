"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function GlossaryHero() {
  const [search, setSearch] = useState("");

  return (
    <section className="relative bg-gradient-to-br from-forest to-dark-green py-24 text-paper-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-copper blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full bg-sage/20 text-sage text-sm font-medium tracking-wide uppercase"
        >
          A–Z Reference
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif font-bold mb-6"
        >
          Paper &amp; Sustainability Glossary
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-paper-warm/80 max-w-2xl mx-auto mb-10"
        >
          Your comprehensive guide to the terminology behind paper production,
          recycling, and environmental sustainability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms…"
              className="w-full pl-12 pr-6 py-4 rounded-xl bg-paper-white text-charcoal placeholder:text-charcoal/40 shadow-lg focus:ring-2 focus:ring-sage/50 outline-none text-base"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
