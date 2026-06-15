"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <section className="bg-gradient-to-b from-forest to-dark-green py-32 text-paper-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif font-bold mb-4"
        >
          Search Everything
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-paper-warm/70 mb-10"
        >
          Articles, myths, resources, glossary terms — find it all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-charcoal/40"
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, myths, glossary, resources…"
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-paper-white text-charcoal placeholder:text-charcoal/40 shadow-2xl focus:ring-4 focus:ring-sage/30 outline-none text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
            >
              ✕
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
