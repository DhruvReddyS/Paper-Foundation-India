"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Direct Employment", value: "500,000+", icon: "👷" },
  { label: "Indirect Employment", value: "1.5 Million+", icon: "👥" },
  { label: "Waste Pickers", value: "3 Million+", icon: "♻️" },
  { label: "Farm Forestry Workers", value: "200,000+", icon: "🌿" },
];

export default function EmploymentSection() {
  return (
    <section className="py-12 px-6 bg-sage/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-forest mb-2">Employment</h2>
          <p className="text-forest/60 text-sm">
            The paper industry is a significant employer across urban and rural India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-sage/20 text-center"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-forest">{s.value}</div>
              <p className="text-sm text-forest/60 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
