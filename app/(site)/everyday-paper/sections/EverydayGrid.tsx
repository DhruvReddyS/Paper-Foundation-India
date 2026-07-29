"use client";

import { useMemo, useState } from "react";
import { paperEverywhereObjects } from "@/content/paperEverywhere";
import EverydayCard from "./EverydayCard";
import styles from "./EverydayGrid.module.css";

const categories = ["All objects", ...new Set(paperEverywhereObjects.map((item) => item.category))];

export default function EverydayGrid() {
  const [active, setActive] = useState("All objects");
  const visible = useMemo(
    () => active === "All objects" ? paperEverywhereObjects : paperEverywhereObjects.filter((item) => item.category === active),
    [active],
  );

  return (
    <section className={styles.section} aria-labelledby="atlas-title">
      <header>
        <div>
          <p>Everyday atlas / nine evidence files</p>
          <h2 id="atlas-title">Choose an object.<br />Follow the evidence.</h2>
        </div>
        <p>
          Each file separates material function from marketing language, gives a carefully scoped figure and links to the primary source.
        </p>
      </header>

      <div className={styles.filters} aria-label="Filter object files">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={active === category ? styles.activeFilter : ""}
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((item, index) => <EverydayCard key={item.slug} item={item} index={index} />)}
      </div>
    </section>
  );
}
