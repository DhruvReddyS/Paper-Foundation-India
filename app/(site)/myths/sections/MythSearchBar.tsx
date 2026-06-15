"use client";

import { useState } from "react";

export function MythSearchBar() {
  const [query, setQuery] = useState("");

  return (
    <section className="py-6 bg-paper-white">
      <div className="container-wide">
        <div className="relative max-w-lg mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mid-grey">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search myths... e.g. 'deforestation', 'plastic'"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-paper-warm font-sans text-sm text-charcoal placeholder:text-mid-grey/50 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mid-grey hover:text-charcoal text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
