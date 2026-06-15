"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["All", "Articles", "Myths", "Resources", "Glossary"];

const mockResults = [
  { type: "Article", title: "The Truth About Paper and Deforestation", excerpt: "India's paper industry relies primarily on farm-grown trees, not natural forests…", date: "May 2024" },
  { type: "Myth", title: "Paper Production Causes Massive Deforestation", excerpt: "Busted: Over 80% of raw material for Indian paper mills comes from sustainable…", date: "April 2024" },
  { type: "Resource", title: "Sustainability Report 2024", excerpt: "Comprehensive data on the Indian paper industry's environmental footprint…", date: "March 2024" },
  { type: "Article", title: "How Paper Recycling Works in India", excerpt: "A deep dive into the recycling infrastructure and the journey of a used newspaper…", date: "February 2024" },
  { type: "Glossary", title: "Carbon Sequestration", excerpt: "The long-term storage of carbon dioxide. Managed forests for paper production act as…", date: "" },
  { type: "Myth", title: "Digital is Always Greener Than Paper", excerpt: "Busted: The carbon footprint of digital infrastructure is often underestimated…", date: "January 2024" },
];

const typeBadgeColors: Record<string, string> = {
  Article: "bg-forest/10 text-forest",
  Myth: "bg-copper/15 text-copper",
  Resource: "bg-sage/20 text-dark-green",
  Glossary: "bg-kraft/30 text-charcoal",
};

export default function SearchResults() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? mockResults : mockResults.filter((r) => r.type === activeTab.slice(0, -1) || r.type === activeTab);

  return (
    <section className="bg-paper-warm py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-paper-white rounded-xl p-1.5 border border-kraft/20 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-forest text-paper-white shadow-sm"
                  : "text-charcoal/60 hover:text-charcoal hover:bg-sage/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-charcoal/50 mb-6">
          Showing <span className="font-bold text-charcoal">{filtered.length}</span> results
        </p>

        {/* Results List */}
        <div className="space-y-4">
          {filtered.map((result, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-paper-white rounded-xl p-6 border border-kraft/15 hover:shadow-md hover:border-forest/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${typeBadgeColors[result.type] || "bg-kraft/20 text-charcoal"}`}>
                  {result.type}
                </span>
                {result.date && (
                  <span className="text-xs text-charcoal/40">{result.date}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-charcoal group-hover:text-forest transition-colors mb-1">
                {result.title}
              </h3>
              <p className="text-sm text-charcoal/60 leading-relaxed">{result.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
