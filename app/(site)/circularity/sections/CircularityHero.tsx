"use client";

import { motion } from "framer-motion";

export default function CircularityHero() {
  return (
    <section className="pt-24 pb-12 px-6 bg-gradient-to-b from-paper-warm to-sage/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span>♻️</span> The Circular Economy
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-forest mb-5 leading-tight">
            Paper: A Perfectly
            <br />
            <span className="text-sage">Circular Material</span>
          </h1>
          <p className="text-lg text-forest/70 max-w-2xl mx-auto leading-relaxed">
            Unlike plastics or metals, paper is inherently renewable, recyclable,
            and biodegradable. Discover how the paper lifecycle embodies circular
            economy principles.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
