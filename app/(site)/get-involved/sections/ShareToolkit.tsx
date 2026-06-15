"use client";

import { motion } from "framer-motion";

const tools = [
  {
    title: "Social Media Kit",
    description: "Ready-to-post graphics, captions, and hashtags for Instagram, Twitter, and LinkedIn.",
    icon: "📱",
    format: "ZIP • 12 MB",
  },
  {
    title: "Fact Cards",
    description: "Printable cards with key facts about paper sustainability — perfect for events and classrooms.",
    icon: "🃏",
    format: "PDF • 3.2 MB",
  },
  {
    title: "Presentation Deck",
    description: "Ready-made slide deck for talks, workshops, and corporate sustainability sessions.",
    icon: "📊",
    format: "PPTX • 8.5 MB",
  },
];

export default function ShareToolkit() {
  return (
    <section className="bg-paper-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
            Share Toolkit
          </h2>
          <p className="text-charcoal/60 max-w-lg mx-auto">
            Download free resources to spread the word about paper sustainability.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-sage/5 rounded-2xl p-8 border border-sage/15 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-5xl mb-5 block">{tool.icon}</span>
              <h3 className="text-lg font-bold text-charcoal mb-2">{tool.title}</h3>
              <p className="text-sm text-charcoal/60 mb-3 leading-relaxed">{tool.description}</p>
              <p className="text-xs text-charcoal/40 mb-5">{tool.format}</p>
              <button className="w-full py-3 rounded-lg bg-forest text-paper-white font-semibold hover:bg-dark-green transition-colors">
                Download Free
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
