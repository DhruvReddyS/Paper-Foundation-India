"use client";

import { useState } from "react";

const categories = [
  "All",
  "Forests",
  "Recycling",
  "Environment",
  "Digital vs Paper",
  "Health",
  "Economy",
  "Water",
  "Energy",
];

export function CategoryFilter() {
  const [active, setActive] = useState("All");

  return (
    <section className="py-8 bg-paper-white border-b border-border">
      <div className="container-wide">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-sans font-medium transition-colors ${
                active === cat
                  ? "bg-forest text-white"
                  : "bg-paper-warm text-mid-grey hover:text-charcoal hover:bg-kraft"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
