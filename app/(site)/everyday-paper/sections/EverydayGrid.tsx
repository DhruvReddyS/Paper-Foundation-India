"use client";

import EverydayCard from "./EverydayCard";

const items = [
  {
    title: "Notebooks",
    emoji: "📓",
    front: "The student's essential companion",
    back: "India produces 2 billion+ notebooks annually, mostly from recycled fibre. Each notebook uses about 0.05 trees worth of pulp.",
    category: "Education",
  },
  {
    title: "Corrugated Boxes",
    emoji: "📦",
    front: "E-commerce's backbone",
    back: "92% of corrugated boxes in India are recycled. The corrugated industry is the single largest consumer of recycled fibre.",
    category: "Packaging",
  },
  {
    title: "Tissue Paper",
    emoji: "🧻",
    front: "Hygiene you take for granted",
    back: "India's tissue market is growing at 15% annually. Modern tissue mills use 100% recycled fibre for standard grades.",
    category: "Hygiene",
  },
  {
    title: "Newspaper",
    emoji: "📰",
    front: "Still reaching 400M+ readers daily",
    back: "India remains the world's largest newspaper market by circulation. Most newsprint is made from de-inked recycled fibre.",
    category: "Media",
  },
  {
    title: "Tea Bags",
    emoji: "🍵",
    front: "Filter paper in every cup",
    back: "Specialty filter paper for tea bags is made from food-grade virgin pulp with precise porosity for optimal brewing.",
    category: "Food",
  },
  {
    title: "Currency Notes",
    emoji: "💵",
    front: "Not quite paper, but close",
    back: "Indian banknotes are printed on cotton-rag paper, an extremely durable specialty grade that lasts years of handling.",
    category: "Specialty",
  },
  {
    title: "Medicine Boxes",
    emoji: "💊",
    front: "Protecting your prescriptions",
    back: "Pharmaceutical packaging uses high-quality bleached board with barrier coatings to protect medicines from moisture.",
    category: "Healthcare",
  },
  {
    title: "Paper Bags",
    emoji: "🛍️",
    front: "The sustainable shopping choice",
    back: "Paper bags biodegrade in 2-6 months vs. 500+ years for plastic. India's paper bag market has tripled since the plastic ban.",
    category: "Retail",
  },
  {
    title: "Textbooks",
    emoji: "📚",
    front: "Knowledge on every page",
    back: "India prints 1 billion+ textbooks annually for its 320M students. Maplitho paper is the preferred grade for durability.",
    category: "Education",
  },
];

export default function EverydayGrid() {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-forest/50 mb-8">
          👆 Tap any card to flip and learn more
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <EverydayCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
