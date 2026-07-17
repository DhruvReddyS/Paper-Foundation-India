"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Brain, Factory, Fingerprint, Grid3X3, Leaf, ScanSearch, Stamp, Timer, Trophy } from "lucide-react";
import { useState, type ReactNode } from "react";

const games = [
  {
    number: "01",
    title: "Grow or Shred",
    subtitle: "The Paper IQ Challenge",
    href: "/discover/grow-or-shred",
    description: "Answer paper-knowledge questions and grow a living evidence tree. Wrong ideas shred into fibres; a comeback streak can rebuild the canopy.",
    action: "Answer",
    duration: "4–6 min",
    difficulty: "Explore · Challenge",
    icon: Leaf,
    className: "hub-poster-grow",
    hook: "Grow the facts. Shred the myths.",
  },
  {
    number: "02",
    title: "The Truth Press",
    subtitle: "Myth, Fact, or Missing Context?",
    href: "/discover/truth-press",
    description: "Stamp claims, inspect their evidence and repair misleading sentences. The winning move is printing the complete truth.",
    action: "Investigate",
    duration: "5–7 min",
    difficulty: "All ages",
    icon: Stamp,
    className: "hub-poster-truth",
    hook: "Put every claim under pressure.",
  },
  {
    number: "03",
    title: "Paper Mill Shuffle",
    subtitle: "Build the Process Line",
    href: "/discover/mill-master",
    description: "Drag eight papermaking stages into the correct order. Build the line from recovered fibre to finished reel, then send it through inspection.",
    action: "Arrange",
    duration: "3–5 min",
    difficulty: "Hands-on",
    icon: Factory,
    className: "hub-poster-mill",
    hook: "One wrong stage stops the whole mill.",
  },
  {
    number: "04",
    title: "Hidden Paper",
    subtitle: "The Clue Hunt",
    href: "/discover/hidden-paper",
    description: "Identify surprising paper products from material clues and gradually revealed photographs. Fewer clues mean a bigger score.",
    action: "Discover",
    duration: "4–6 min",
    difficulty: "Daily-friendly",
    icon: ScanSearch,
    className: "hub-poster-hidden",
    hook: "Paper is hiding in plain sight.",
  },
  {
    number: "05",
    title: "Fibre Word Search",
    subtitle: "The Five-Minute Hunt",
    href: "/discover/paper-word-search",
    description: "Find ten words from forestry, fibre, papermaking and recovery. Search across, down and diagonally, then beat your personal best.",
    action: "Find",
    duration: "Up to 5 min",
    difficulty: "Fast recall",
    icon: Grid3X3,
    className: "hub-poster-wordsearch",
    hook: "Ten paper words. One running clock.",
  },
] as const;

export default function GameHub() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const selectedGame = games[active];
  const SelectedIcon = selectedGame.icon;

  return (
    <div className="game-hub-page">
      <section className="game-hub-hero">
        <div className="game-shell relative z-10 grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-hero-label"><span /> Paper Foundation India presents</div>
            <h1>Learn paper<br /><em>by playing with it.</em></h1>
            <p className="game-hero-lead">Five tactile games that turn evidence, manufacturing and hidden material science into something anyone can understand—and want to share.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/discover/grow-or-shred" className="game-primary-button">Play the flagship game <ArrowRight size={18} /></Link>
              <a href="#game-index" className="game-secondary-button">Browse the game deck</a>
            </div>
            <div className="game-hero-meta">
              <span><Timer size={16} /> 3–7 minute games</span>
              <span><Fingerprint size={16} /> No login required</span>
              <span><Trophy size={16} /> Shareable results</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, rotate: 4, scale: 0.94 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.18 }} className="game-hero-machine" aria-hidden="true">
            <div className="machine-rings"><span /><span /><span /></div>
            <div className="machine-sheet">
              <p>PLAY / LEARN / PROVE</p>
              <strong>PAPER<br />IQ</strong>
              <small>Issue 01 · India</small>
            </div>
            <div className="game-hero-ticket-stack">
              {games.map((game, index) => <motion.span key={game.number} animate={reducedMotion ? undefined : { y: [0, index % 2 ? 7 : -7, 0], rotate: [index * 3 - 6, index * 3 - 3, index * 3 - 6] }} transition={{ duration: 4.5 + index * .5, repeat: Infinity }}><b>{game.number}</b><i>{game.title}</i></motion.span>)}
            </div>
            <motion.div className="machine-fibre fibre-one" animate={reducedMotion ? undefined : { x: [0, 16, -6, 0], y: [0, -12, 8, 0], rotate: [12, 24, -8, 12] }} transition={{ duration: 7, repeat: Infinity }} />
            <motion.div className="machine-fibre fibre-two" animate={reducedMotion ? undefined : { x: [0, -18, 5, 0], y: [0, 10, -14, 0], rotate: [-18, -4, -28, -18] }} transition={{ duration: 8, repeat: Infinity }} />
            <motion.div className="machine-fibre fibre-three" animate={reducedMotion ? undefined : { x: [0, 8, -12, 0], y: [0, -15, 4, 0], rotate: [42, 58, 31, 42] }} transition={{ duration: 6, repeat: Infinity }} />
          </motion.div>
        </div>
      </section>

      <section id="game-index" className="game-switchboard-section">
        <div className="game-shell">
          <header className="game-switchboard-heading"><div><p className="game-kicker">The playable edition · Issue 01</p><h2 className="game-section-title">Choose the skill.<br />Open the game.</h2></div><p>Each game has its own mechanic, pace and evidence habit. Select a numbered tab to inspect the experience before entering.</p></header>
          <nav className="game-switchboard-tabs" aria-label="Choose a paper game">{games.map((game, index) => <button key={game.number} onClick={() => setActive(index)} className={active === index ? "is-active" : ""} aria-current={active === index ? "true" : undefined}><span>{game.number}</span><strong>{game.title}</strong><small>{game.action}</small></button>)}</nav>
          <div className="game-switchboard">
            <AnimatePresence mode="wait">
              <motion.article key={selectedGame.number} initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: .42 }} className={`game-switchboard-poster ${selectedGame.className}`}>
                <div className="game-switchboard-art"><span>GAME {selectedGame.number}</span><GamePosterArt game={active} icon={<SelectedIcon />} active reducedMotion={Boolean(reducedMotion)} /></div>
                <div className="game-switchboard-copy">
                  <p>{selectedGame.subtitle}</p><h3>{selectedGame.title}</h3><em>{selectedGame.hook}</em><span>{selectedGame.description}</span>
                  <div>{[selectedGame.action, selectedGame.duration, selectedGame.difficulty].map(item => <small key={item}>{item}</small>)}</div>
                  <Link href={selectedGame.href}>Enter this game <ArrowRight /></Link>
                </div>
              </motion.article>
            </AnimatePresence>
            <aside><span>WHAT YOU PRACTISE</span><strong>{active === 0 ? "Evidence recall" : active === 1 ? "Claim verification" : active === 2 ? "Process sequencing" : active === 3 ? "Material observation" : "Fast vocabulary"}</strong><p>Every result creates a branded share card—no login and no account setup required.</p><div><Trophy /><span>Score locally<br /><b>Share responsibly</b></span></div></aside>
          </div>
        </div>
      </section>

      <section className="game-manifesto">
        <div className="game-shell grid gap-12 py-24 lg:grid-cols-[.7fr_1.3fr]">
          <div className="manifesto-mark"><Brain size={42} /><span>Evidence before opinion.</span></div>
          <div>
            <p className="game-kicker text-copper">The rules behind the games</p>
            <h2>Paper is not automatically good.<br />Paper is not automatically bad.</h2>
            <p>Every game teaches the more useful truth: sourcing, product design, manufacturing, use, collection and recovery decide the outcome. Every factual reveal includes a source, and “missing context” is always allowed as an answer.</p>
            <div className="manifesto-points">
              <span>Designed for children to professionals</span>
              <span>Clear pacing and readable controls</span>
              <span>Touch, mouse and keyboard friendly</span>
              <span>Results built for social sharing</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GamePosterArt({ game, icon, active, reducedMotion }: { game: number; icon: ReactNode; active: boolean; reducedMotion: boolean }) {
  const moving = active && !reducedMotion;
  return (
    <div className={`hub-poster-art art-${game}`}>
      <motion.div className="hub-poster-icon" animate={moving ? game === 1 ? { rotate: [-8, 7, -8], scale: [1, 1.08, 1] } : { y: [0, -10, 0], rotate: [0, 3, 0] } : undefined} transition={{ duration: game === 1 ? 1.4 : 2.4, repeat: Infinity, ease: "easeInOut" }}>{icon}</motion.div>
      {game === 0 && <><motion.i animate={moving ? { scaleY: [.55, 1, .55], rotate: [-4, 3, -4] } : undefined} transition={{ duration: 2.2, repeat: Infinity }} /><span className="poster-shreds"><b /><b /><b /><b /></span></>}
      {game === 1 && <><span className="poster-claim">MYTH?</span><motion.span className="poster-stamp" animate={moving ? { y: [-34, 4, -34], rotate: [-8, -2, -8] } : undefined} transition={{ duration: 1.7, repeat: Infinity, times: [0, .35, 1] }}>PRESS</motion.span></>}
      {game === 2 && <><span className="poster-mill-line"><b>1</b><b>?</b><b>3</b><b>?</b></span><motion.span className="poster-sheet-roll" animate={moving ? { x: [-22, 24, -22], rotate: [0, 180, 360] } : undefined} transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }} /></>}
      {game === 3 && <><span className="poster-clue clue-a">POROUS</span><span className="poster-clue clue-b">LIGHT</span><motion.span className="poster-scan" animate={moving ? { x: [-62, 72, -62] } : undefined} transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }} /></>}
      {game === 4 && <><span className="poster-grid" aria-hidden="true">F&nbsp;I&nbsp;B&nbsp;R&nbsp;E<br />&nbsp;&nbsp;&nbsp;A<br />P&nbsp;A&nbsp;P&nbsp;E&nbsp;R</span><motion.span className="poster-clock" animate={moving ? { rotate: [0, 360] } : undefined} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>05:00</motion.span></>}
    </div>
  );
}
