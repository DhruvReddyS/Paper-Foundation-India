"use client";

import { motion } from "framer-motion";

const sources = [
  {
    id: 1,
    title: "Indian Paper Manufacturers Association (IPMA) — Annual Report 2024",
    url: "https://www.ipma.co.in",
  },
  {
    id: 2,
    title: "Central Pulp and Paper Research Institute (CPPRI) — Industry Statistics",
    url: "https://www.cppri.org.in",
  },
  {
    id: 3,
    title: "Ministry of Commerce & Industry — Trade Data Portal",
    url: "https://tradestat.commerce.gov.in",
  },
  {
    id: 4,
    title: "FAO — Forestry Statistics (FAOSTAT)",
    url: "https://www.fao.org/faostat",
  },
  {
    id: 5,
    title: "RISI / Fastmarkets — Global Pulp & Paper Market Intelligence",
    url: "https://www.fastmarkets.com",
  },
  {
    id: 6,
    title: "Bureau of International Recycling (BIR) — Recovered Paper Statistics",
    url: "https://www.bir.org",
  },
];

export default function SourcesBibliography() {
  return (
    <section className="py-12 px-6 bg-sage/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-forest mb-2">Sources &amp; Bibliography</h2>
          <p className="text-forest/60 text-sm">
            Data sources and references used for the statistics on this page
          </p>
        </motion.div>

        <div className="space-y-3">
          {sources.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 bg-white rounded-lg px-5 py-3 border border-sage/20"
            >
              <span className="text-forest/40 font-mono text-sm mt-0.5">[{s.id}]</span>
              <div>
                <p className="text-sm text-forest">{s.title}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-forest/50 hover:text-forest underline"
                >
                  {s.url}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
