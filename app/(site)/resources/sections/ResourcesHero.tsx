"use client";

import { motion } from "framer-motion";

export default function ResourcesHero() {
  return (
    <section className="relative bg-gradient-to-br from-forest to-dark-green py-24 text-paper-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-sage blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-copper blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full bg-sage/20 text-sage text-sm font-medium tracking-wide uppercase"
        >
          Knowledge Hub
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif font-bold mb-6"
        >
          Resources &amp; Downloads
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-paper-warm/80 max-w-2xl mx-auto leading-relaxed"
        >
          Curated research papers, reports, toolkits, and infographics — everything
          you need to understand India&apos;s paper ecosystem.
        </motion.p>
      </div>
    </section>
  );
}
