"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const types = ["All", "Research Paper", "Report", "Toolkit", "Infographic", "Video"];
const sources = ["All Sources", "Government", "NGO", "Academic", "Industry"];

export default function ResourceFilter() {
  const [activeType, setActiveType] = useState("All");
  const [activeSource, setActiveSource] = useState("All Sources");

  return (
    <section className="bg-paper-warm py-8 border-b border-kraft/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeType === type
                    ? "bg-forest text-paper-white shadow-md"
                    : "bg-paper-white text-charcoal hover:bg-sage/20 border border-kraft/30"
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-charcoal/60 font-medium">Source:</label>
            <select
              value={activeSource}
              onChange={(e) => setActiveSource(e.target.value)}
              className="px-4 py-2 rounded-lg border border-kraft/30 bg-paper-white text-charcoal text-sm focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
