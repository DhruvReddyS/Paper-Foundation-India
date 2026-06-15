"use client";

import { motion } from "framer-motion";

const regions = [
  { name: "Western India", mills: 280, states: "Maharashtra, Gujarat" },
  { name: "Southern India", mills: 220, states: "Tamil Nadu, AP, Karnataka" },
  { name: "Northern India", mills: 200, states: "UP, Punjab, Haryana" },
  { name: "Eastern India", mills: 100, states: "West Bengal, Odisha" },
  { name: "Central India", mills: 60, states: "MP, Chhattisgarh" },
];

export default function MillDistribution() {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-forest mb-2">
            Mill Distribution
          </h2>
          <p className="text-forest/60 text-sm">
            India has 860+ paper mills spread across every region
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-forest text-paper-white rounded-2xl p-8 flex flex-col items-center justify-center"
          >
            <div className="text-6xl font-bold">860+</div>
            <p className="text-paper-white/80 mt-2 text-lg">Paper Mills</p>
            <p className="text-paper-white/60 text-sm mt-1">Across 20+ states</p>
          </motion.div>

          {/* Region breakdown */}
          <div className="space-y-3">
            {regions.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-sage/10 rounded-xl px-5 py-3 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-forest text-sm">{r.name}</h3>
                  <p className="text-xs text-forest/50">{r.states}</p>
                </div>
                <span className="font-bold text-forest text-lg">{r.mills}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
