"use client";

import { motion } from "framer-motion";

const partners = [
  "TERI", "IIT Delhi", "NCERT", "WWF India",
  "Ministry of Environment", "FSC India", "CII",
  "FICCI", "IPMA", "CSE India", "IIFM", "UNESCO India",
];

export default function PartnerLogos() {
  return (
    <section className="bg-paper-warm py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
            Our Partners
          </h2>
          <p className="text-charcoal/60 max-w-lg mx-auto">
            We&apos;re proud to work with leading institutions in sustainability and education.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {partners.map((partner, index) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center justify-center h-24 bg-paper-white rounded-xl border border-kraft/15 hover:border-forest/20 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-bold text-charcoal/40">{partner}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
