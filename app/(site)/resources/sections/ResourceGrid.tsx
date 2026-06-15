"use client";

import { motion } from "framer-motion";

const resources = [
  {
    title: "India's Paper Industry: 2024 Sustainability Report",
    type: "Report",
    source: "Ministry of Environment",
    date: "March 2024",
    description: "Comprehensive overview of sustainability practices across 120+ mills.",
    icon: "📊",
  },
  {
    title: "Recycling Myths vs. Facts: A Visual Guide",
    type: "Infographic",
    source: "Paper Foundation India",
    date: "January 2024",
    description: "Printable infographic debunking the top 10 recycling myths.",
    icon: "🖼️",
  },
  {
    title: "Forest Stewardship in India: Research Findings",
    type: "Research Paper",
    source: "IIT Delhi",
    date: "November 2023",
    description: "Peer-reviewed study on paper-plantation linked forest management.",
    icon: "📄",
  },
  {
    title: "Educator's Toolkit: Teaching Paper Sustainability",
    type: "Toolkit",
    source: "Paper Foundation India",
    date: "September 2023",
    description: "Lesson plans, activities, and worksheets for grades 6–12.",
    icon: "🧰",
  },
  {
    title: "Carbon Footprint Comparison: Paper vs. Digital",
    type: "Research Paper",
    source: "TERI",
    date: "August 2023",
    description: "Life-cycle analysis comparing environmental impact of paper and digital media.",
    icon: "📄",
  },
  {
    title: "How Paper is Made: Video Series",
    type: "Video",
    source: "Paper Foundation India",
    date: "July 2023",
    description: "5-part video series exploring the paper manufacturing process in India.",
    icon: "🎬",
  },
];

export default function ResourceGrid() {
  return (
    <section className="bg-paper-warm py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <motion.article
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group bg-paper-white rounded-2xl border border-kraft/20 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{resource.icon}</span>
                  <span className="inline-block px-3 py-1 rounded-full bg-sage/15 text-forest text-xs font-semibold uppercase tracking-wide">
                    {resource.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-charcoal group-hover:text-forest transition-colors mb-2 leading-snug">
                  {resource.title}
                </h3>

                <p className="text-sm text-charcoal/60 mb-4 leading-relaxed">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between text-xs text-charcoal/40">
                  <span>{resource.source}</span>
                  <span>{resource.date}</span>
                </div>
              </div>

              <div className="px-6 py-4 bg-kraft/5 border-t border-kraft/10">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-forest text-paper-white rounded-lg text-sm font-semibold hover:bg-dark-green transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 rounded-full border-2 border-forest text-forest font-semibold hover:bg-forest hover:text-paper-white transition-all">
            Load More Resources
          </button>
        </div>
      </div>
    </section>
  );
}
