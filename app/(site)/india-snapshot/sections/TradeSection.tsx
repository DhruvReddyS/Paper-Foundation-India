"use client";

import { motion } from "framer-motion";

const exports = [
  { product: "Writing & Printing", value: 450, unit: "K tonnes" },
  { product: "Kraft & Board", value: 320, unit: "K tonnes" },
  { product: "Newsprint", value: 80, unit: "K tonnes" },
  { product: "Specialty Papers", value: 60, unit: "K tonnes" },
];

const imports = [
  { product: "Waste Paper", value: 6200, unit: "K tonnes" },
  { product: "Newsprint", value: 420, unit: "K tonnes" },
  { product: "Coated Paper", value: 380, unit: "K tonnes" },
  { product: "Pulp", value: 250, unit: "K tonnes" },
];

export default function TradeSection() {
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
            Trade — Exports &amp; Imports
          </h2>
          <p className="text-forest/60 text-sm">
            India is a net importer of waste paper and select finished grades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Exports */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-sage/10 rounded-2xl p-6"
          >
            <h3 className="font-bold text-forest text-lg mb-4 flex items-center gap-2">
              <span>📤</span> Exports
            </h3>
            <div className="space-y-3">
              {exports.map((e) => (
                <div key={e.product} className="flex justify-between items-center border-b border-sage/20 pb-2 last:border-0">
                  <span className="text-sm text-forest/70">{e.product}</span>
                  <span className="font-semibold text-forest text-sm">{e.value} {e.unit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Imports */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-kraft/10 rounded-2xl p-6"
          >
            <h3 className="font-bold text-forest text-lg mb-4 flex items-center gap-2">
              <span>📥</span> Imports
            </h3>
            <div className="space-y-3">
              {imports.map((imp) => (
                <div key={imp.product} className="flex justify-between items-center border-b border-kraft/30 pb-2 last:border-0">
                  <span className="text-sm text-forest/70">{imp.product}</span>
                  <span className="font-semibold text-forest text-sm">{imp.value} {imp.unit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
