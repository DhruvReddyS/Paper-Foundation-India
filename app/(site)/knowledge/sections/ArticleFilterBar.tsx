"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const categories = ["All", "Forestry", "Recycling", "Sustainability", "Economy", "Innovation"];
const sortOptions = ["Latest", "Most Read", "Oldest"];

export function ArticleFilterBar() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [search, setSearch] = useState("");

  return (
    <section className="py-6 bg-paper-white border-b border-border sticky top-16 z-30 backdrop-blur bg-paper-white/95">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="knowledge-filter-scroll flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-sans font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-forest text-white"
                    : "bg-paper-warm text-mid-grey hover:text-charcoal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mid-grey" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-9 pr-3 py-2 rounded-lg border border-border bg-paper-warm text-sm font-sans text-charcoal placeholder:text-mid-grey/50 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition w-48"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-paper-warm text-sm font-sans text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/20"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
