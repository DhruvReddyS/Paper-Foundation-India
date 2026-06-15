"use client";

import { motion } from "framer-motion";

const data = [
  { year: "2015", value: 47 },
  { year: "2016", value: 50 },
  { year: "2017", value: 55 },
  { year: "2018", value: 58 },
  { year: "2019", value: 62 },
  { year: "2020", value: 60 },
  { year: "2021", value: 65 },
  { year: "2022", value: 68 },
  { year: "2023", value: 71 },
  { year: "2024", value: 75 },
];

export default function RecycledFibreChart() {
  const maxVal = 100;

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
            Recycled Fibre Usage
          </h2>
          <p className="text-forest/60 text-sm">
            Percentage of recycled fibre in India&apos;s paper production (2015–2024)
          </p>
        </motion.div>

        <div className="relative h-56 flex items-end gap-2 border-b border-l border-sage/20 pl-2 pb-2">
          {/* Y-axis labels */}
          <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-forest/40 -translate-x-full pr-2">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>

          {data.map((d, i) => {
            const height = (d.value / maxVal) * 100;
            return (
              <div key={d.year} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <motion.div
                  className="w-full max-w-[32px] bg-sage rounded-t-sm mx-auto"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  style={{ minHeight: 2 }}
                />
                <span className="text-[10px] text-forest/50 truncate">{d.year}</span>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-forest/5 rounded-lg px-4 py-3 text-center"
        >
          <p className="text-sm text-forest/70">
            🌱 India uses <strong>75%</strong> recycled fibre — among the highest globally,
            ahead of most developed nations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
