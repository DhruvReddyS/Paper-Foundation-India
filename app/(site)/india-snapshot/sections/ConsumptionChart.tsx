"use client";

import { motion } from "framer-motion";

const data = [
  { country: "USA", value: 200 },
  { country: "China", value: 85 },
  { country: "Japan", value: 210 },
  { country: "Germany", value: 225 },
  { country: "India", value: 16, highlight: true },
  { country: "World Avg", value: 55 },
];

const maxVal = Math.max(...data.map((d) => d.value));

export default function ConsumptionChart() {
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
            Per Capita Consumption
          </h2>
          <p className="text-forest/60 text-sm">
            Kg per person per year — India has significant room for growth
          </p>
        </motion.div>

        <div className="space-y-4">
          {data.map((d, i) => {
            const width = (d.value / maxVal) * 100;
            return (
              <motion.div
                key={d.country}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4"
              >
                <span className={`w-24 text-sm text-right ${d.highlight ? "font-bold text-forest" : "text-forest/70"}`}>
                  {d.country}
                </span>
                <div className="flex-1 h-8 bg-sage/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full flex items-center justify-end pr-3 ${
                      d.highlight ? "bg-forest" : "bg-forest/40"
                    }`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${width}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                  >
                    <span className={`text-xs font-medium ${d.highlight ? "text-paper-white" : "text-forest"}`}>
                      {d.value} kg
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
