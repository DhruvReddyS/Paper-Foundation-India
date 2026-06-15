"use client";

import { motion } from "framer-motion";

export default function MapHero() {
  return (
    <section className="pt-24 pb-8 px-6 bg-paper-warm">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold text-forest mb-4"
        >
          India&apos;s Paper Landscape
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-lg text-forest/70 max-w-2xl mx-auto"
        >
          Explore state-by-state data on production, consumption, and recycling
          across India&apos;s paper industry.
        </motion.p>
      </div>
    </section>
  );
}
