"use client";

import { motion, AnimatePresence } from "framer-motion";

interface NodeDetailPanelProps {
  activeNode: number | null;
}

const nodeDetails = [
  {
    title: "Sustainable Sourcing",
    icon: "🌱",
    description: "Raw materials for paper come from renewable sources — plantation timber, agri-residues, and recycled fibre.",
    stats: "75% recycled fibre + 25% plantation/agri-based virgin fibre",
    impact: "No natural forests are used for papermaking in India.",
  },
  {
    title: "Production",
    icon: "🏭",
    description: "Modern mills convert raw materials into paper using water, energy, and chemical processes with increasing efficiency.",
    stats: "Water usage reduced by 40% over the last decade",
    impact: "Industry investing ₹25,000 Cr+ in green technology upgrades.",
  },
  {
    title: "Distribution",
    icon: "🚛",
    description: "Finished paper products are shipped to converters, printers, publishers, and retailers across India.",
    stats: "860+ mills serving domestic and export markets",
    impact: "Short supply chains reduce transport emissions.",
  },
  {
    title: "Use & Reuse",
    icon: "📝",
    description: "Paper serves essential roles — education, packaging, hygiene, communication — and can be reused before recycling.",
    stats: "Average Indian uses ~16 kg of paper per year",
    impact: "Paper replaces single-use plastics in packaging.",
  },
  {
    title: "Collection",
    icon: "📦",
    description: "India's vast informal sector of kabadiwalas and waste-pickers ensures high collection rates for used paper.",
    stats: "~40 million tonnes collected annually",
    impact: "Supports livelihoods of 3+ million waste workers.",
  },
  {
    title: "Recycling",
    icon: "♻️",
    description: "Collected paper is sorted, pulped, de-inked, and processed into new paper — closing the loop.",
    stats: "A fibre can be recycled up to 7 times",
    impact: "Recycling saves 70% energy vs virgin production.",
  },
];

export default function NodeDetailPanel({ activeNode }: NodeDetailPanelProps) {
  const detail = activeNode !== null ? nodeDetails[activeNode] : null;

  return (
    <div className="max-w-2xl mx-auto px-6 min-h-[200px]">
      <AnimatePresence mode="wait">
        {detail ? (
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-sage/20 p-6 overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{detail.icon}</span>
              <h3 className="text-xl font-bold text-forest">{detail.title}</h3>
            </div>
            <p className="text-forest/70 mb-4 leading-relaxed">{detail.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-sage/10 rounded-lg px-4 py-3">
                <p className="text-xs text-forest/50 uppercase font-medium mb-1">Key Stat</p>
                <p className="text-sm text-forest font-medium">{detail.stats}</p>
              </div>
              <div className="bg-forest/5 rounded-lg px-4 py-3">
                <p className="text-xs text-forest/50 uppercase font-medium mb-1">Impact</p>
                <p className="text-sm text-forest font-medium">{detail.impact}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-forest/50 py-8"
          >
            👆 Click a node on the diagram to explore each stage
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
