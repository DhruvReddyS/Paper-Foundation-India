"use client";

import { motion } from "framer-motion";

const data = [
  { year: "2018", value: 17200 },
  { year: "2019", value: 17800 },
  { year: "2020", value: 16400 },
  { year: "2021", value: 18500 },
  { year: "2022", value: 20100 },
  { year: "2023", value: 22400 },
  { year: "2024", value: 24800 },
];

const maxVal = Math.max(...data.map((d) => d.value));

export default function ProductionChart() {
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
            Paper &amp; Paperboard Production
          </h2>
          <p className="text-forest/60 text-sm">
            Annual production in thousand tonnes (2018–2024)
          </p>
        </motion.div>

        {/* Simple bar-based line chart visualisation */}
        <div className="relative h-64 flex items-end gap-4 border-b border-l border-sage/20 pl-2 pb-2">
          {data.map((d, i) => {
            const height = (d.value / maxVal) * 100;
            return (
              <motion.div
                key={d.year}
                className="flex-1 flex flex-col items-center gap-1"
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "auto" }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-xs font-medium text-forest">
                  {(d.value / 1000).toFixed(1)}M
                </span>
                <motion.div
                  className="w-full max-w-[40px] bg-forest/80 rounded-t-md"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{ minHeight: 4 }}
                />
                <span className="text-xs text-forest/50 mt-1">{d.year}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
