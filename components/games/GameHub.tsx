"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Brain, Factory, Fingerprint, Grid3X3, Leaf, ScanSearch, Stamp, Timer, Trophy } from "lucide-react";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type WheelEvent } from "react";

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
  const wheelLock = useRef(false);
  const pointerStart = useRef<number | null>(null);

  const changeGame = useCallback((direction: -1 | 1) => {
    setActive((current) => (current + direction + games.length) % games.length);
  }, []);

  function getOffset(index: number) {
    let offset = index - active;
    if (offset > games.length / 2) offset -= games.length;
    if (offset < -games.length / 2) offset += games.length;
    return offset;
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
    if (!horizontalIntent || wheelLock.current) return;
    event.preventDefault();
    const delta = event.deltaX || event.deltaY;
    if (Math.abs(delta) < 8) return;
    wheelLock.current = true;
    changeGame(delta > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLock.current = false; }, 520);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStart.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 45) return;
    changeGame(distance < 0 ? 1 : -1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); changeGame(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); changeGame(-1); }
  }

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
            <motion.div className="machine-fibre fibre-one" animate={reducedMotion ? undefined : { x: [0, 16, -6, 0], y: [0, -12, 8, 0], rotate: [12, 24, -8, 12] }} transition={{ duration: 7, repeat: Infinity }} />
            <motion.div className="machine-fibre fibre-two" animate={reducedMotion ? undefined : { x: [0, -18, 5, 0], y: [0, 10, -14, 0], rotate: [-18, -4, -28, -18] }} transition={{ duration: 8, repeat: Infinity }} />
            <motion.div className="machine-fibre fibre-three" animate={reducedMotion ? undefined : { x: [0, 8, -12, 0], y: [0, -15, 4, 0], rotate: [42, 58, 31, 42] }} transition={{ duration: 6, repeat: Infinity }} />
          </motion.div>
        </div>
      </section>

      <section id="game-index" className="game-carousel-section">
        <div className="game-shell game-carousel-heading">
          <div>
            <p className="game-kicker">Choose your way in</p>
            <h2 className="game-section-title">Pick a poster.<br />Enter the game.</h2>
          </div>
          <div className="game-carousel-copy">
            <p>Every card behaves differently because every game asks for a different skill. Swipe the deck, use the arrows, or scroll sideways.</p>
            <div className="game-carousel-readout" aria-live="polite"><span>{games[active].number}</span><strong>{games[active].title}</strong></div>
          </div>
        </div>

        <div
          className="game-carousel"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Paper games"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { pointerStart.current = null; }}
          onKeyDown={onKeyDown}
        >
          <div className="game-carousel-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="game-carousel-deck">
            {games.map((game, index) => {
              const Icon = game.icon;
              const offset = getOffset(index);
              const selected = index === active;
              const distance = Math.abs(offset);
              return (
                <motion.article
                  key={game.title}
                  className={`hub-game-card ${game.className} ${selected ? "is-active" : ""}`}
                  animate={{
                    x: `${offset * 88}%`,
                    y: distance * 20,
                    scale: selected ? 1 : Math.max(.76, 1 - distance * .12),
                    rotate: offset * 2.4,
                    rotateY: offset * -5,
                    opacity: distance > 1 ? .16 : selected ? 1 : .58,
                    filter: selected ? "brightness(1) saturate(1)" : "brightness(.82) saturate(.72)",
                  }}
                  transition={reducedMotion ? { duration: .01 } : { type: "spring", stiffness: 135, damping: 24, mass: .82 }}
                  style={{ zIndex: 10 - distance, pointerEvents: distance > 1 ? "none" : "auto" }}
                  onClick={() => !selected && setActive(index)}
                  aria-hidden={!selected}
                >
                  <div className="hub-poster-no">GAME {game.number}</div>
                  <GamePosterArt game={index} icon={<Icon />} active={selected} reducedMotion={Boolean(reducedMotion)} />
                  <div className="hub-poster-copy">
                    <p className="hub-game-subtitle">{game.subtitle}</p>
                    <div className="hub-game-title-block"><h3>{game.title}</h3><strong className="hub-game-hook">{game.hook}</strong></div>
                    <p className="hub-game-description">{game.description}</p>
                    <div className="hub-game-footer"><div className="hub-game-tags"><span>{game.action}</span><span>{game.duration}</span><span>{game.difficulty}</span></div>{selected && <Link href={game.href}>Play now <ArrowRight size={17} /></Link>}</div>
                  </div>
                  <div className="hub-poster-edge" />
                </motion.article>
              );
            })}
          </div>

          <div className="game-carousel-controls">
            <button onClick={() => changeGame(-1)} aria-label="Previous game"><ArrowLeft /></button>
            <div className="game-carousel-dots">
              {games.map((game, index) => <button key={game.title} onClick={() => setActive(index)} className={index === active ? "is-active" : ""} aria-label={`Show ${game.title}`} aria-current={index === active ? "true" : undefined}><span /></button>)}
            </div>
            <button onClick={() => changeGame(1)} aria-label="Next game"><ArrowRight /></button>
          </div>
          <p className="game-carousel-hint"><span>←</span> swipe · drag · arrow keys <span>→</span></p>
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
