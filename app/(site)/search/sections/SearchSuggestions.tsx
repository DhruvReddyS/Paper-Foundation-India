"use client";

import { motion } from "framer-motion";

const suggestions = [
  { label: "Is paper bad for the environment?", icon: "🌿" },
  { label: "How many times can paper be recycled?", icon: "♻️" },
  { label: "Paper vs plastic packaging", icon: "📦" },
  { label: "Deforestation and paper industry", icon: "🌳" },
  { label: "Carbon footprint of paper", icon: "🏭" },
  { label: "FSC certification meaning", icon: "✅" },
];

export default function SearchSuggestions() {
  return (
    <section className="bg-paper-warm py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-sm font-semibold text-charcoal/50 uppercase tracking-wider mb-6 text-center">
          Popular Searches
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-5 py-4 bg-paper-white rounded-xl border border-kraft/20 text-left hover:border-forest/30 hover:shadow-sm transition-all"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-charcoal font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
