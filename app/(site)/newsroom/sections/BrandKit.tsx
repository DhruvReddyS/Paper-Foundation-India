"use client";

import { motion } from "framer-motion";

const assets = [
  { name: "Logo Pack", format: "SVG, PNG, AI", size: "2.4 MB", icon: "🎨" },
  { name: "Brand Guidelines", format: "PDF", size: "5.1 MB", icon: "📖" },
  { name: "Fact Sheets", format: "PDF", size: "1.8 MB", icon: "📋" },
  { name: "Photography Pack", format: "JPG, ZIP", size: "45 MB", icon: "📸" },
];

export default function BrandKit() {
  return (
    <section className="bg-paper-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
            Brand &amp; Media Kit
          </h2>
          <p className="text-charcoal/60 max-w-lg mx-auto">
            Download our official brand assets for use in news coverage and features.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-sage/5 rounded-2xl p-6 border border-sage/15 text-center hover:shadow-md transition-shadow group cursor-pointer"
            >
              <span className="text-4xl mb-4 block">{asset.icon}</span>
              <h3 className="text-lg font-bold text-charcoal mb-1">{asset.name}</h3>
              <p className="text-xs text-charcoal/50 mb-1">{asset.format}</p>
              <p className="text-xs text-charcoal/40 mb-4">{asset.size}</p>
              <button className="w-full py-2.5 rounded-lg bg-forest text-paper-white text-sm font-semibold hover:bg-dark-green transition-colors">
                Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
