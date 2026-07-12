"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, FileSearch, Library, Search, Sparkles, Stamp, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const results = [
  { type: "Article", title: "How fibre sourcing shapes the paper story", excerpt: "Follow the evidence behind forest management, fibre origin and the limits of a material label.", href: "/knowledge/truth-about-paper-forestry", terms: "forest forestry source trees fresh fibre" },
  { type: "Article", title: "Reading recovery rates without losing the fibre story", excerpt: "Collection, contamination, yield and final use all sit behind a headline recycling number.", href: "/knowledge/recycling-rates-compared", terms: "recycling recovery collection contamination fibre" },
  { type: "Article", title: "What life-cycle studies answer, and what they do not", excerpt: "Use boundaries and methods to read comparisons between paper and other systems responsibly.", href: "/knowledge/paper-vs-plastic-lifecycle", terms: "lifecycle lca plastic comparison method" },
  { type: "Myth", title: "Paper use automatically causes deforestation", excerpt: "A material name does not reveal the forestry outcome. Source and management evidence decide the answer.", href: "/myths", terms: "myth deforestation forest trees paper bad" },
  { type: "Myth", title: "Digital communication has no material footprint", excerpt: "Paper and digital systems both have physical inputs. A useful comparison asks about devices, energy, networks, fibre and recovery instead of declaring one format impact-free.", href: "/myths", terms: "paper vs digital electronic footprint devices energy comparison myth" },
  { type: "Myth", title: "Every paper package belongs in every recycling bin", excerpt: "Food residue, wax, coatings and local mill capability can change the recovery route.", href: "/myths", terms: "package packaging bin recycling coating contamination" },
  { type: "Journey", title: "One Sheet. Many Lives.", excerpt: "Turn through the source, mill, use and recovery decisions inside an interactive paper storybook.", href: "/journey", terms: "journey process mill source recycling book" },
  { type: "Game", title: "Grow or Shred", excerpt: "Test paper knowledge and grow an evidence tree question by question.", href: "/discover/grow-or-shred", terms: "quiz tree paper iq game facts" },
  { type: "Game", title: "The Truth Press", excerpt: "Classify claims as myth, fact or missing context and inspect the evidence.", href: "/discover/truth-press", terms: "myth fact context game claim" },
  { type: "Game", title: "Paper Mill Shuffle", excerpt: "Arrange eight papermaking stages into a working process line.", href: "/discover/mill-master", terms: "mill process order pulp sheet game" },
  { type: "Foundation", title: "Paper Foundation India", excerpt: "Meet the registered society, its documented objective, office bearers, executive members and advisors.", href: "/about", terms: "team foundation members advisors hyderabad mission" },
] as const;

const types = ["All", "Article", "Myth", "Journey", "Game", "Foundation"] as const;
const prompts = ["paper and forests", "how recycling works", "paper vs digital", "who runs the foundation"];

export default function SearchExperience() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return results.filter((item) => (type === "All" || item.type === type) && (!needle || `${item.title} ${item.excerpt} ${item.terms}`.toLowerCase().includes(needle)));
  }, [query, type]);

  return <div className="search-studio">
    <section className="search-studio-hero">
      <div className="search-hero-copy"><p className="premium-kicker"><span /> Search the public paper desk</p><h1>Begin with<br /><em>a better question.</em></h1><p>Search evidence, myths, games, the paper journey and the foundation itself from one working index.</p></div>
      <div className="search-lens-art" aria-hidden="true"><i /><i /><Search /><span>PFI / INDEX 01</span></div>
      <label className="search-command"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try forests, recycling, mills, myths..." />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X /></button>}<kbd>{String(filtered.length).padStart(2,"0")} found</kbd></label>
    </section>

    <section className="search-workbench">
      <header><div><p className="premium-kicker">Live index</p><h2>{query ? <>Results for <em>“{query}”</em></> : <>Everything is<br /><em>open to inspect.</em></>}</h2></div><p>Choose a desk or type naturally. Results update immediately without sending your question anywhere.</p></header>
      <div className="search-prompt-rail"><span>Try a question</span>{prompts.map((prompt) => <button key={prompt} onClick={() => setQuery(prompt)}>{prompt}</button>)}</div>
      <div className="search-type-rail">{types.map((item) => <button key={item} onClick={() => setType(item)} className={type === item ? "is-active" : ""}>{item}</button>)}</div>
      <div className="search-result-ledger"><AnimatePresence mode="popLayout">{filtered.map((item, index) => <motion.article layout initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,scale:.97 }} transition={{ delay:index*.035 }} key={`${item.type}-${item.title}`}><Link href={item.href}><span>{String(index+1).padStart(2,"0")}</span><div><small>{item.type}</small><strong>{item.title}</strong><p>{item.excerpt}</p></div><ResultIcon type={item.type} /><ArrowRight /></Link></motion.article>)}</AnimatePresence></div>
      {filtered.length === 0 && <div className="search-zero"><FileSearch /><h3>No exact result yet.</h3><p>Try a broader phrase or ask the foundation directly.</p><Link href="/contact">Contact the foundation <ArrowRight /></Link></div>}
    </section>

    <section className="search-studio-cta"><Sparkles /><p>Not sure what to ask first?</p><h2>Follow one sheet<br />through the whole system.</h2><Link href="/journey">Open the paper journey <ArrowRight /></Link></section>
  </div>;
}

function ResultIcon({ type }: { type: string }) {
  if (type === "Myth") return <Stamp />;
  if (type === "Game") return <Sparkles />;
  if (type === "Journey") return <BookOpen />;
  if (type === "Foundation") return <Library />;
  return <FileSearch />;
}
