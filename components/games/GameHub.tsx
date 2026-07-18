"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Clock3,
  Download,
  Fingerprint,
} from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";
import { gameCatalog, type GameDefinition } from "./gameCatalog";

type HistoryResult = {
  gameId: string;
  score: number;
  outOf: number;
};

export default function GameHub() {
  const reducedMotion = useReducedMotion();
  const [history, setHistory] = useState<HistoryResult[]>([]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const cursorX = useSpring(pointerX, { stiffness: 110, damping: 18 });
  const cursorY = useSpring(pointerY, { stiffness: 110, damping: 18 });

  useEffect(() => {
    try {
      setHistory(JSON.parse(window.localStorage.getItem("pfi-game-history") || "[]"));
    } catch {
      setHistory([]);
    }
  }, []);

  function trackPointer(event: PointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  const played = new Set(history.map((item) => item.gameId)).size;
  const bestPercent = history.length
    ? Math.max(...history.map((item) => Math.round((item.score / item.outOf) * 100)))
    : 0;

  return (
    <div className="games-new">
      <section className="games-new-hero" onPointerMove={trackPointer}>
        <div className="game-shell games-new-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            className="games-new-hero-copy"
          >
            <div className="games-new-edition">
              <span>Paper Foundation India</span>
              <b>The Playable Edition / 01</b>
            </div>
            <h1>
              Paper makes more sense
              <em>when your hands are in it.</em>
            </h1>
            <p>
              Five short experiments in fibre, evidence, material science and making.
              Each game has a different rhythm. Every finish leaves you with something
              worth sharing.
            </p>
            <div className="games-new-actions">
              <Link href={gameCatalog[0].href}>
                Start with the living quiz <ArrowRight />
              </Link>
              <a href="#game-deck">
                Open the game deck <ArrowDown />
              </a>
            </div>
            <div className="games-new-proof">
              <span><Clock3 /> 3–7 minutes</span>
              <span><Fingerprint /> No account</span>
              <span><Download /> Branded result PNG</span>
            </div>
          </motion.div>

          <div className="games-new-hero-art" aria-hidden="true">
            <motion.div
              className="games-new-folder"
              style={{
                rotateY: reducedMotion ? 0 : cursorX,
                rotateX: reducedMotion ? 0 : cursorY,
              }}
            >
              <span>PFI / PLAY</span>
              <strong>THE<br />PLAYABLE<br />EDITION</strong>
              <small>Five field games<br />Issue 01 · India</small>
              <i />
            </motion.div>
            {gameCatalog.map((game, index) => (
              <motion.div
                key={game.id}
                className={`games-new-tab games-new-tab-${game.theme}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.07 }}
              >
                <span>{game.number}</span>
                <b>{game.shortTitle}</b>
              </motion.div>
            ))}
            <motion.div
              className="games-new-thread thread-a"
              animate={reducedMotion ? undefined : { rotate: [0, 6, 0], x: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="games-new-thread thread-b"
              animate={reducedMotion ? undefined : { rotate: [0, -7, 0], y: [0, -9, 0] }}
              transition={{ duration: 6.5, repeat: Infinity }}
            />
          </div>
        </div>
      </section>

      <section id="game-deck" className="games-new-deck">
        <div className="game-shell">
          <header className="games-new-deck-heading">
            <div>
              <p className="game-kicker">Five games · five visual worlds</p>
              <h2>Choose what you want<br />to understand.</h2>
            </div>
            <p>
              There is no level order. Begin with a question, a process, an object or a
              word. Completed games are marked on this device.
            </p>
          </header>

          <div className="games-new-cards">
            {gameCatalog.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                completed={history.some((result) => result.gameId === game.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="games-new-passport">
        <div className="game-shell games-new-passport-grid">
          <div className="games-new-passport-card">
            <span>PLAYER FIELD NOTE</span>
            <strong>{history.length ? "WELCOME BACK" : "NO LOGIN NEEDED"}</strong>
            <p>Progress belongs to this browser. Scores can also be saved by the game service when connected.</p>
            <div>
              <i />
              <small>PAPER FOUNDATION INDIA<br />paperfoundation.in</small>
            </div>
          </div>
          <div className="games-new-passport-copy">
            <p className="game-kicker">Your local game desk</p>
            <h2>{played ? `${played} of 5 games played.` : "Your first score is waiting."}</h2>
            <div>
              <span><strong>{String(played).padStart(2, "0")}</strong> titles explored</span>
              <span><strong>{history.length}</strong> completed sessions</span>
              <span><strong>{bestPercent}%</strong> best score</span>
            </div>
            <Link href={gameCatalog.find((game) => !history.some((result) => result.gameId === game.id))?.href ?? gameCatalog[0].href}>
              {played === 5 ? "Play another round" : "Continue the edition"} <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function GameCard({
  game,
  index,
  completed,
}: {
  game: GameDefinition;
  index: number;
  completed: boolean;
}) {
  return (
    <motion.article
      className={`games-new-card games-new-card-${game.theme}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ delay: index * 0.045, duration: 0.55 }}
    >
      <Link href={game.href} aria-label={`Play ${game.title}`}>
        <header>
          <span>GAME {game.number}</span>
          <small>{completed ? "PLAYED ✓" : game.duration}</small>
        </header>
        <div className="games-new-card-art">
          <CardArt theme={game.theme} />
        </div>
        <div className="games-new-card-copy">
          <p>{game.subtitle}</p>
          <h3>{game.title}</h3>
          <em>{game.hook}</em>
          <span>{game.description}</span>
          <footer>
            <div><small>{game.skill}</small><small>{game.difficulty}</small></div>
            <b>{game.verb} <ArrowRight /></b>
          </footer>
        </div>
      </Link>
    </motion.article>
  );
}

function CardArt({ theme }: { theme: GameDefinition["theme"] }) {
  if (theme === "botanical") {
    return <div className="card-art-tree"><i /><i /><i /><i /><b /><b /><span>+ EVIDENCE</span></div>;
  }
  if (theme === "press") {
    return <div className="card-art-press"><span>CLAIM No. 024</span><p>ALWAYS<br />QUESTION<br />“ALWAYS”</p><b>CHECKED</b></div>;
  }
  if (theme === "mill") {
    return <div className="card-art-mill"><span /><span /><span /><span /><i>01</i><i>02</i><i>03</i><i>04</i></div>;
  }
  if (theme === "detective") {
    return <div className="card-art-hidden"><span>?</span><i /><b>FIBRE<br />FOUND</b></div>;
  }
  return <div className="card-art-type">{["F", "I", "B", "R", "E", "P", "A", "P", "E", "R", "M", "I", "L", "L", "S", "T"].map((letter, index) => <span key={index}>{letter}</span>)}</div>;
}
