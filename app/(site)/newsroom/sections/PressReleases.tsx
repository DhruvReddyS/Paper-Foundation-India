"use client";

import { motion } from "framer-motion";

const pressReleases = [
  {
    title: "Paper Foundation India Launches National Sustainability Campaign",
    date: "May 15, 2024",
    excerpt: "A multi-city initiative to educate citizens about paper sustainability reaches 50 cities across India.",
    featured: true,
  },
  {
    title: "New Research: India's Paper Recycling Rate Reaches 65%",
    date: "April 8, 2024",
    excerpt: "Landmark study reveals significant progress in recycling infrastructure.",
    featured: false,
  },
  {
    title: "Partnership with NCERT for Environmental Education",
    date: "March 22, 2024",
    excerpt: "Paper Foundation India collaborates with NCERT to include paper sustainability modules in school curricula.",
    featured: false,
  },
  {
    title: "Annual Report 2023: Impact and Growth",
    date: "February 1, 2024",
    excerpt: "Our annual report highlights reaching 10 million readers and publishing over 200 fact-checked articles.",
    featured: false,
  },
];

export default function PressReleases() {
  const featured = pressReleases.find((p) => p.featured);
  const rest = pressReleases.filter((p) => !p.featured);

  return (
    <section className="bg-paper-warm py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-12"
        >
          Press Releases
        </motion.h2>

        {/* Featured */}
        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-forest to-dark-green rounded-2xl p-8 md:p-12 text-paper-white mb-10 shadow-lg cursor-pointer group"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-copper text-paper-white text-xs font-bold uppercase mb-4">
              Featured
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 group-hover:text-sage transition-colors">
              {featured.title}
            </h3>
            <p className="text-paper-warm/70 mb-4 max-w-2xl">{featured.excerpt}</p>
            <span className="text-sm text-paper-warm/50">{featured.date}</span>
          </motion.article>
        )}

        {/* List */}
        <div className="space-y-4">
          {rest.map((release, index) => (
            <motion.article
              key={release.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-paper-white rounded-xl p-6 border border-kraft/15 hover:shadow-md hover:border-forest/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-charcoal group-hover:text-forest transition-colors mb-1">
                    {release.title}
                  </h3>
                  <p className="text-sm text-charcoal/60">{release.excerpt}</p>
                </div>
                <span className="text-xs text-charcoal/40 whitespace-nowrap ml-4">{release.date}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
