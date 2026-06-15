"use client";

import { useState } from "react";

export function ArticlePagination() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="py-12 bg-paper-white">
      <div className="container-wide text-center">
        {loaded ? (
          <p className="text-sm text-mid-grey font-sans">
            ✓ All articles loaded
          </p>
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="btn-secondary"
          >
            Load More Articles ↓
          </button>
        )}
        <p className="text-xs text-mid-grey/60 mt-4">
          Showing 6 of 24 articles
        </p>
      </div>
    </section>
  );
}
