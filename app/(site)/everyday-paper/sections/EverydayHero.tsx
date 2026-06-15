"use client";

import { motion } from "framer-motion";

export default function EverydayHero() {
  return (
    <section className="pt-24 pb-10 px-6 bg-paper-warm">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-forest mb-4">
            Paper in Everyday Life
          </h1>
          <p className="text-lg text-forest/70 max-w-2xl mx-auto">
            From the notebook on your desk to the box your food arrives in — discover
            the 50+ types of paper products that shape your daily life.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
