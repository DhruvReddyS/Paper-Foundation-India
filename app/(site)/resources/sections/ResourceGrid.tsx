"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowUpRight, BarChart3, BookOpen, FileText,
  GraduationCap, Library, Play, Search, SlidersHorizontal, X,
} from "lucide-react";
import styles from "./Resources.module.css";

const resources = [
  { title: "India's Paper Industry: 2024 Sustainability Report", type: "Report", source: "Government", publisher: "Ministry of Environment", date: "March 2024", description: "A sector-wide view of resource use, recovery systems, and sustainability practices across more than 120 mills.", format: "PDF · 8.4 MB", icon: BarChart3, accent: "green" },
  { title: "Recycling Myths vs. Facts: A Visual Guide", type: "Infographic", source: "NGO", publisher: "Paper Foundation India", date: "January 2024", description: "A printable visual guide that places ten familiar recycling claims beside the context they often leave out.", format: "PDF · 3.1 MB", icon: FileText, accent: "copper" },
  { title: "Forest Stewardship in India: Research Findings", type: "Research Paper", source: "Academic", publisher: "IIT Delhi", date: "November 2023", description: "Peer-reviewed research on plantation forestry, fibre sourcing, and forest-management outcomes in India.", format: "PDF · 5.7 MB", icon: BookOpen, accent: "sage" },
  { title: "Educator's Toolkit: Teaching Paper Sustainability", type: "Toolkit", source: "NGO", publisher: "Paper Foundation India", date: "September 2023", description: "Lesson plans, discussion prompts, activities, and printable worksheets designed for grades 6–12.", format: "ZIP · 12 MB", icon: GraduationCap, accent: "kraft" },
  { title: "Carbon Footprint Comparison: Paper vs. Digital", type: "Research Paper", source: "Academic", publisher: "TERI", date: "August 2023", description: "A life-cycle reading of paper and digital media that makes assumptions, boundaries, and trade-offs visible.", format: "PDF · 4.2 MB", icon: BookOpen, accent: "green" },
  { title: "How Paper is Made: Video Series", type: "Video", source: "Industry", publisher: "Paper Foundation India", date: "July 2023", description: "A five-part field series following fibre from preparation and pulping through forming, drying, and recovery.", format: "5 episodes · 42 min", icon: Play, accent: "copper" },
];

const types = ["All", "Research Paper", "Report", "Toolkit", "Infographic", "Video"];
const sources = ["All sources", "Government", "NGO", "Academic", "Industry"];

export default function ResourceGrid() {
  const [query, setQuery] = useState("");
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
      <section className={styles.hero}>
        <motion.div
          className={styles.heroCopy}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .65 }}
        >
          <p className={styles.eyebrow}>Reports · methods · teaching tools</p>
          <h1>Evidence you can<br /><em>take with you.</em></h1>
          <p>Open the reading room: a curated working archive for understanding paper in India beyond the headline.</p>
          <a href="#resource-archive">Browse the archive <ArrowDown aria-hidden="true" /></a>
        </motion.div>

        <motion.div
          className={styles.archiveObject}
          initial={{ opacity: 0, rotate: -4, scale: .94 }}
          animate={{ opacity: 1, rotate: 1, scale: 1 }}
          transition={{ delay: .15, duration: .7 }}
          aria-hidden="true"
        >
          <div className={styles.folderBack}><span>PFI / PUBLIC FILE</span></div>
          <div className={styles.folderSheet}>
            <Library />
            <small>Reading room selection</small>
            <strong>Sources before slogans.</strong>
            <i>06 documents · open access</i>
          </div>
          <div className={styles.folderFront}><span>ARCHIVE 01</span><b>↗</b></div>
        </motion.div>
      </section>

      <section id="resource-archive" className={styles.archive}>
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
              const Icon = resource.icon;
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
                  <button type="button" className={styles.openButton} aria-label={`Open ${resource.title}`}>
                    <span>{resource.type === "Video" ? "Watch" : "Open file"}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </button>
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
