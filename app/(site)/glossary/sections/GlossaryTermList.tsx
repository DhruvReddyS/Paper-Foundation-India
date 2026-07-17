"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, Search, X } from "lucide-react";
import styles from "./Glossary.module.css";

interface Term {
  term: string;
  definition: string;
}

const glossaryData: Record<string, Term[]> = {
  A: [
    { term: "Agro-residue Pulp", definition: "Pulp derived from agricultural waste such as bagasse, wheat straw, or rice husk, used as an alternative to wood-based pulp." },
    { term: "Acid-free Paper", definition: "Paper made with a neutral or slightly alkaline pH, ensuring long-term durability and resistance to yellowing." },
  ],
  B: [
    { term: "Bagasse", definition: "The fibrous residue left after sugarcane stalks are crushed to extract juice. Widely used in Indian paper mills as a sustainable pulp source." },
    { term: "Bleaching", definition: "A process used to brighten pulp by removing or altering colour-forming material. The chemistry and environmental controls used matter." },
    { term: "Biodegradable", definition: "Capable of being broken down by natural biological processes under suitable conditions. The time and conditions required should always be stated." },
  ],
  C: [
    { term: "Carbon Sequestration", definition: "The capture and long-term storage of carbon dioxide in forests, soils, products, or geological formations." },
    { term: "Cellulose", definition: "The primary structural component of plant cell walls and the main fibrous raw material used to make paper." },
    { term: "Corrugated Board", definition: "A packaging material with a fluted inner sheet held between one or more flat linerboards." },
  ],
  D: [
    { term: "Deinking", definition: "The industrial separation of printing inks, adhesives, and other contaminants from recovered paper during recycling." },
  ],
  F: [
    { term: "FSC Certification", definition: "A certification system intended to support responsible forest management and traceable forest-based supply chains." },
  ],
  P: [
    { term: "Pulp", definition: "A suspension of separated plant fibres produced mechanically, chemically, or through recovered-paper processing before a sheet is formed." },
    { term: "Post-Consumer Waste", definition: "Material collected after a product has completed its intended use by a household or business." },
  ],
  R: [
    { term: "Recycled Fibre", definition: "Fibre recovered from used paper products and prepared for another paper-making cycle. Fibre quality changes with repeated use." },
  ],
  S: [
    { term: "Sustainable Forestry", definition: "Forest management that considers ecological health, community needs, and economic viability over the long term." },
  ],
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const availableLetters = Object.keys(glossaryData);
const termCount = Object.values(glossaryData).flat().length;

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
