"use client";

import { motion } from "framer-motion";

const data = [
  { year: "2020", collected: 28, processed: 21 },
  { year: "2021", collected: 31, processed: 24 },
  { year: "2022", collected: 34, processed: 27 },
  { year: "2023", collected: 37, processed: 30 },
  { year: "2024", collected: 40, processed: 33 },
];

const maxVal = 45;

export default function RecyclingRateChart() {
  return (
    <section className="py-12 px-6 bg-sage/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-forest mb-2">
            Collection vs Processing
          </h2>
          <p className="text-forest/60 text-sm">
            Waste paper collected vs actually recycled (million tonnes)
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2 text-sm text-forest/70">
            <div className="w-4 h-4 rounded bg-forest/70" /> Collected
          </div>
          <div className="flex items-center gap-2 text-sm text-forest/70">
            <div className="w-4 h-4 rounded bg-sage" /> Processed
          </div>
        </div>

        <div className="space-y-4">
          {data.map((d, i) => (
            <motion.div
              key={d.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-1"
            >
              <span className="text-sm font-medium text-forest">{d.year}</span>
              <div className="flex gap-1">
                <motion.div
                  className="h-6 bg-forest/70 rounded-r-md"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(d.collected / maxVal) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              </div>
              <div className="flex gap-1">
                <motion.div
                  className="h-6 bg-sage rounded-r-md"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(d.processed / maxVal) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.1 }}
                />
              </div>
              <div className="flex gap-4 text-xs text-forest/50">
                <span>{d.collected}M collected</span>
                <span>{d.processed}M processed</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
