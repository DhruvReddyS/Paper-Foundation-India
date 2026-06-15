"use client";

import { motion } from "framer-motion";

export default function SnapshotHeader() {
  return (
    <section className="pt-24 pb-10 px-6 bg-paper-warm">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            India Paper Snapshot
          </h1>
          <p className="text-lg text-forest/70 max-w-2xl mx-auto">
            Key statistics and trends shaping India&apos;s paper and paperboard industry — 
            production, consumption, trade, recycling, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3"
        >
          <button className="flex items-center gap-2 bg-forest text-paper-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest/90 transition-colors">
            <span>📄</span> Cite this page
          </button>
          <button className="flex items-center gap-2 bg-white text-forest px-5 py-2.5 rounded-full text-sm font-medium border border-sage/30 hover:border-forest/30 transition-colors">
            <span>⬇️</span> Download PDF
          </button>
        </motion.div>
      </div>
    </section>
  );
}
