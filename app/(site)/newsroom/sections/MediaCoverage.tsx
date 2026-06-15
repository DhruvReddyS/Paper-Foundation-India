"use client";

import { motion } from "framer-motion";

const outlets = [
  "The Hindu", "Times of India", "NDTV", "India Today",
  "The Economic Times", "Mint", "Down to Earth", "The Wire",
  "Scroll.in", "Business Standard", "The Print", "News18",
];

export default function MediaCoverage() {
  return (
    <section className="bg-paper-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
            Media Coverage
          </h2>
          <p className="text-charcoal/60">As seen in leading publications across India</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {outlets.map((outlet, index) => (
            <motion.div
              key={outlet}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center justify-center h-20 bg-kraft/5 rounded-xl border border-kraft/15 hover:border-forest/20 hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="text-sm font-bold text-charcoal/50 hover:text-forest transition-colors">
                {outlet}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
