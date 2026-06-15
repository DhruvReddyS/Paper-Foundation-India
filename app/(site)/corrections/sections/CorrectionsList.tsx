"use client";

import { motion } from "framer-motion";

const corrections = [
  {
    date: "May 28, 2024",
    article: "India's Paper Recycling Rate: A Closer Look",
    type: "Factual Correction",
    original: "India recycles 75% of its paper waste.",
    corrected: "India recycles approximately 65% of its paper waste, based on 2023 IPMA data.",
    reason: "The 75% figure was sourced from an outdated 2019 report. Updated with 2023 industry data.",
  },
  {
    date: "April 15, 2024",
    article: "How Trees Are Grown for Paper Production",
    type: "Clarification",
    original: "All paper mills in India use plantation-grown timber exclusively.",
    corrected: "The majority of paper mills in India (over 80%) use plantation-grown timber and agro-residues as their primary raw material.",
    reason: "The original statement was overly absolute. Updated to reflect more accurate industry data.",
  },
  {
    date: "March 3, 2024",
    article: "The Carbon Footprint of a Sheet of Paper",
    type: "Data Update",
    original: "A single A4 sheet produces approximately 10g of CO₂.",
    corrected: "A single A4 sheet produces approximately 4.7g of CO₂ equivalent (lifecycle analysis, 2023 methodology).",
    reason: "Updated with the latest lifecycle analysis methodology, which includes carbon sequestration credits.",
  },
  {
    date: "January 20, 2024",
    article: "Paper vs Digital: Environmental Comparison",
    type: "Attribution Correction",
    original: "According to a MIT study…",
    corrected: "According to a Swedish Royal Institute of Technology (KTH) study…",
    reason: "The study was incorrectly attributed. The correct source is KTH, published in the Journal of Cleaner Production.",
  },
];

const typeBadgeColors: Record<string, string> = {
  "Factual Correction": "bg-red-50 text-red-700 border-red-200",
  "Clarification": "bg-amber-50 text-amber-700 border-amber-200",
  "Data Update": "bg-blue-50 text-blue-700 border-blue-200",
  "Attribution Correction": "bg-purple-50 text-purple-700 border-purple-200",
};

export default function CorrectionsList() {
  return (
    <section className="bg-paper-warm py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">
          Correction Log
        </h2>

        <div className="space-y-6">
          {corrections.map((c, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-paper-white rounded-2xl p-8 border border-kraft/15 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <time className="text-sm font-medium text-charcoal/50">{c.date}</time>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${typeBadgeColors[c.type] || "bg-kraft/10"}`}>
                  {c.type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-forest mb-4">{c.article}</h3>

              <div className="space-y-3">
                <div className="bg-red-50/50 rounded-lg p-4 border-l-4 border-red-300">
                  <p className="text-xs font-semibold text-red-600/70 uppercase mb-1">Original</p>
                  <p className="text-sm text-charcoal/70 line-through">{c.original}</p>
                </div>

                <div className="bg-green-50/50 rounded-lg p-4 border-l-4 border-green-400">
                  <p className="text-xs font-semibold text-green-700/70 uppercase mb-1">Corrected</p>
                  <p className="text-sm text-charcoal/80 font-medium">{c.corrected}</p>
                </div>

                <div className="text-sm text-charcoal/50 italic mt-2">
                  <strong className="not-italic text-charcoal/70">Reason:</strong> {c.reason}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
