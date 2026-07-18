"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, Search, X } from "lucide-react";
import { glossaryAlphabet as alphabet, glossaryData, glossaryTermCount as termCount } from "@/content/glossary";
import styles from "./Glossary.module.css";
const availableLetters = Object.keys(glossaryData);

export default function GlossaryTermList() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("ALL");

  const groups = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    return Object.entries(glossaryData)
      .filter(([group]) => letter === "ALL" || group === letter)
      .map(([group, terms]) => ({
        letter: group,
        terms: terms.filter(({ term, definition }) =>
          !normalised || `${term} ${definition}`.toLowerCase().includes(normalised)
        ),
      }))
      .filter((group) => group.terms.length);
  }, [letter, query]);

  const visibleCount = groups.reduce((total, group) => total + group.terms.length, 0);

  return (
    <main className={styles.page}>
      <section id="glossary-index" className={styles.index}>
        <motion.div className={styles.compactIntro} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div><p className={styles.eyebrow}>Paper language / field index</p><h1>Glossary</h1></div>
          <p>Plain-language definitions for paper, fibre, forestry and circular systems. Search first, or browse the live alphabet.</p>
          <aside><BookOpenText /><span>TERM ON THE DESK</span><strong>cir·cu·lar·i·ty</strong><small>Keeping materials useful for longer.</small></aside>
        </motion.div>
        <header className={styles.indexHeader}>
          <div>
            <p className={styles.eyebrow}>A—Z field index</p>
            <h2>Find the word behind the claim.</h2>
          </div>
          <label className={styles.search}>
            <Search aria-hidden="true" />
            <span className="sr-only">Search glossary terms</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a term or idea…"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X aria-hidden="true" />
              </button>
            )}
            <small>{visibleCount} of {termCount} entries</small>
          </label>
        </header>

        <nav className={styles.alphabet} aria-label="Filter glossary by first letter">
          <button
            type="button"
            className={letter === "ALL" ? styles.activeLetter : ""}
            onClick={() => setLetter("ALL")}
          >
            All
          </button>
          {alphabet.map((item) => (
            <button
              type="button"
              key={item}
              disabled={!availableLetters.includes(item)}
              className={letter === item ? styles.activeLetter : ""}
              onClick={() => setLetter(item)}
              aria-pressed={letter === item}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className={styles.ledger} aria-live="polite">
          <AnimatePresence mode="popLayout">
            {groups.map((group) => (
              <motion.section
                layout
                key={group.letter}
                className={styles.letterGroup}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <div className={styles.letterRail}>
                  <span>{group.letter}</span>
                  <small>{group.terms.length.toString().padStart(2, "0")} entries</small>
                </div>
                <div className={styles.terms}>
                  {group.terms.map((item, index) => (
                    <motion.article
                      layout
                      key={item.term}
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: index * .04 }}
                    >
                      <span>{group.letter}.{(index + 1).toString().padStart(2, "0")}</span>
                      <h3>{item.term}</h3>
                      <p>{item.definition}</p>
                    </motion.article>
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
          {!groups.length && (
            <div className={styles.empty}>
              <BookOpenText aria-hidden="true" />
              <h3>No entry on this sheet—yet.</h3>
              <p>Try a shorter phrase or return to the complete index.</p>
              <button type="button" onClick={() => { setQuery(""); setLetter("ALL"); }}>Reset the index</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
