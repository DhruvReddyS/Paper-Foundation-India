"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, BarChart3, BookOpen, FileText,
  GraduationCap, Library, Search, SlidersHorizontal, X,
} from "lucide-react";
import { resourceCatalog as resources } from "@/content/resources";
import styles from "./Resources.module.css";

const types = ["All", "Report", "Guide", "Standard", "Data portal", "Toolkit", "Research"];
const sources = ["All sources", "Government", "Intergovernmental", "Standards body"];
const iconFor = (type: string) => type === "Data portal" ? BarChart3 : type === "Toolkit" ? GraduationCap : type === "Standard" ? FileText : type === "Report" || type === "Research" ? BookOpen : Library;

export default function ResourceGrid({ initialSearch = "" }: { initialSearch?: string }) {
  const [query, setQuery] = useState(initialSearch);
  const [type, setType] = useState("All");
  const [source, setSource] = useState("All sources");

  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    return resources.filter((resource) =>
      (type === "All" || resource.type === type) &&
      (source === "All sources" || resource.source === source) &&
      (!normalised || `${resource.title} ${resource.description} ${resource.publisher}`.toLowerCase().includes(normalised))
    );
  }, [query, source, type]);

  const reset = () => { setQuery(""); setType("All"); setSource("All sources"); };

  return (
    <main className={styles.page}>
      <section id="resource-archive" className={styles.archive}>
        <motion.div className={styles.compactIntro} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div><p className={styles.eyebrow}>Public evidence desk / open access</p><h1>Resources</h1></div>
          <p>Reports, methods and teaching tools—each labelled with publisher, format and date before you open it.</p>
          <aside><Library /><span>READING ROOM</span><strong>{resources.length}</strong><small>official sources on this shelf</small></aside>
        </motion.div>
        <header className={styles.archiveHeader}>
          <div>
            <p className={styles.eyebrow}>The public evidence desk</p>
            <h2>Choose a shelf.<br />Follow the source.</h2>
          </div>
          <p>Every item shows its publisher, format, and date before you open it. Filters work together, so the archive stays quick to navigate.</p>
        </header>

        <div className={styles.controls}>
          <label className={styles.search}>
            <Search aria-hidden="true" />
            <span className="sr-only">Search resources</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, publisher or subject…" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X /></button>}
          </label>
          <label className={styles.source}>
            <SlidersHorizontal aria-hidden="true" />
            <span className="sr-only">Filter by source</span>
            <select value={source} onChange={(event) => setSource(event.target.value)}>
              {sources.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <nav className={styles.typeTabs} aria-label="Filter resources by format">
          {types.map((item) => (
            <button type="button" key={item} className={type === item ? styles.activeType : ""} onClick={() => setType(item)} aria-pressed={type === item}>
              {item}<small>{item === "All" ? resources.length : resources.filter((resource) => resource.type === item).length}</small>
            </button>
          ))}
        </nav>

        <div className={styles.resultsMeta}>
          <span>{filtered.length.toString().padStart(2, "0")} items on this shelf</span>
          {(query || type !== "All" || source !== "All sources") && <button type="button" onClick={reset}>Clear all filters <X /></button>}
        </div>

        <div className={styles.resourceList} aria-live="polite">
          <AnimatePresence mode="popLayout">
            {filtered.map((resource, index) => {
              const Icon = iconFor(resource.type);
              return (
                <motion.article
                  layout
                  key={resource.title}
                  className={`${styles.resource} ${styles[resource.accent]}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: .98 }}
                  transition={{ delay: index * .045 }}
                >
                  <div className={styles.resourceNumber}>{(index + 1).toString().padStart(2, "0")}</div>
                  <div className={styles.resourceIcon}><Icon aria-hidden="true" /><span>{resource.type}</span></div>
                  <div className={styles.resourceCopy}>
                    <small>{resource.publisher} · {resource.date}</small>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div><span>{resource.format}</span><span>{resource.source}</span></div>
                  </div>
                  <a href={resource.href} target="_blank" rel="noreferrer" className={styles.openButton} aria-label={`Open ${resource.title}`}>
                    <span>Open source</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </motion.article>
              );
            })}
          </AnimatePresence>
          {!filtered.length && (
            <div className={styles.empty}>
              <Library aria-hidden="true" />
              <h3>That shelf is empty.</h3>
              <p>Change one filter or return to the complete public archive.</p>
              <button type="button" onClick={reset}>Show all resources</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
