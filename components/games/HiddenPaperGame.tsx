"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ExternalLink, Lightbulb, ScanSearch, Sparkles } from "@/components/paper-ui/icons";
import { useEffect, useRef, useState } from "react";
import { GameFrame, GameIntro, ResultPanel, shuffleItems, useGameConfiguration, useGameTimer } from "./GameShared";
import { playGameSound } from "./gameAudio";
import { hiddenProducts, type HiddenProduct } from "./gameData";

/**
 * Objects dealt per round.
 *
 * The pool is small, because every object needs a photograph that is ours to
 * use, so four per round rather than five already cuts how much of it any one
 * play reveals. dealRound then puts the objects that were not used last time
 * first, so a second play leads with things the player has not just seen
 * instead of reshuffling the same handful.
 */
const ROUND_SIZE = 4;

function dealRound(pool: readonly HiddenProduct[], previous: readonly HiddenProduct[] = []) {
  const seen = new Set(previous.map(item => item.name));
  const unseen = shuffleItems(pool.filter(item => !seen.has(item.name)));
  const repeats = shuffleItems(pool.filter(item => seen.has(item.name)));
  return [...unseen, ...repeats].slice(0, Math.min(ROUND_SIZE, pool.length));
}

export default function HiddenPaperGame() {
  const configuration = useGameConfiguration("hidden-paper");
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [products, setProducts] = useState<HiddenProduct[]>(() => dealRound(hiddenProducts));
  const [index, setIndex] = useState(0);
  const [clues, setClues] = useState(1);
  const [wrong, setWrong] = useState(0);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [clueHistory, setClueHistory] = useState<number[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const { seconds, resetTimer } = useGameTimer(phase === "play");
  const advancedFrom = useRef<number | null>(null);
  const answeredAt = useRef<number | null>(null);
  const safeIndex = products.length ? Math.min(index, products.length - 1) : 0;
  const product = products[safeIndex];
  useEffect(() => {
    if (index !== safeIndex) setIndex(safeIndex);
  }, [index, safeIndex]);
  const availablePoints = Math.max(20, 120 - (clues - 1) * 20 - wrong * 15);
  useEffect(() => {
    const configured = configuration?.content?.products;
    if (phase === "intro" && Array.isArray(configured) && configured.length) setProducts(previous => dealRound(configured as HiddenProduct[], previous));
  }, [configuration, phase]);

  const normalize = (value: string) => value.toLocaleLowerCase().replace(/\s+/g, " ").trim();

  function guess(option: string) {
    if (solved || revealed) return;
    if (normalize(option) === normalize(product.name)) {
      if (answeredAt.current === safeIndex) return;
      answeredAt.current = safeIndex;
      playGameSound("correct");
      setSolved(true);
      setScore((value) => value + availablePoints);
      setSolvedCount((value) => value + 1);
      setClueHistory((value) => [...value, clues]);
    } else {
      playGameSound("wrong");
      setWrong((value) => value + 1);
      setClues((value) => Math.min(product.clues.length, value + 1));
    }
  }

  // Without this a player who cannot name the object has no way forward, since
  // advancing is only offered once the object is identified.
  function revealAnswer() {
    if (solved || revealed || answeredAt.current === safeIndex) return;
    answeredAt.current = safeIndex;
    playGameSound("reveal");
    setRevealed(true);
    setClues(product.clues.length);
    setClueHistory((value) => [...value, product.clues.length]);
  }

  function next() {
    if ((!solved && !revealed) || advancedFrom.current === safeIndex) return;
    advancedFrom.current = safeIndex;
    if (safeIndex >= products.length - 1) {
      playGameSound("complete");
      setPhase("result");
    }
    else { setIndex((value) => value + 1); setClues(1); setWrong(0); setSolved(false); setRevealed(false); }
  }

  function reset() { const configured = configuration?.content?.products; advancedFrom.current = null; answeredAt.current = null;
    setPhase("intro"); setIndex(0); setClues(1); setWrong(0); setSolved(false); setRevealed(false); setScore(0); setClueHistory([]); setSolvedCount(0); setProducts(previous => dealRound(Array.isArray(configured) && configured.length ? configured as HiddenProduct[] : hiddenProducts, previous)); resetTimer(); }
  const averageClues = clueHistory.length ? clueHistory.reduce((a, b) => a + b, 0) / clueHistory.length : 0;
  const identifiedEverything = solvedCount === products.length;
  const badge = identifiedEverything && averageClues <= 1.8
    ? "Fibre Visionary"
    : solvedCount >= Math.ceil(products.length * 0.6)
      ? "Material Detective"
      : "Curious Observer";

  return (
    <GameFrame gameId="hidden-paper" immersive={phase !== "intro"} title="Hidden Paper" kicker="Game 04 · The clue hunt" elapsedSeconds={phase === "intro" ? undefined : seconds} progress={phase === "play" && products.length ? ((safeIndex + (solved || revealed ? 1 : 0)) / products.length) * 100 : undefined}>
      {phase === "intro" && <GameIntro gameId="hidden-paper" eyebrow="Unexpected paper, hiding in plain sight" title="How soon can you see the paper?" description={`Identify ${products.length} everyday products using as few clues as you can. Start with a riddle, then earn clearer hints about how the material behaves. Each extra clue costs points.`} rules={["Read the first cryptic clue and make a guess or request another clue.", "A wrong guess automatically reveals more information and lowers the available score.", "After solving, peel back the object to learn exactly why a paper component works there."]} onStart={() => setPhase("play")} />}

      {phase === "play" && product && (
        <section className="hidden-stage">
          <div className="mystery-visual">
            <div className={`mystery-image-frame ${solved || revealed ? "is-solved" : ""}`}>
              <Image src={product.image} alt={solved || revealed ? product.name : "Mystery paper-based product"} fill sizes="(max-width: 900px) 100vw, 50vw" priority className="object-cover" style={{ filter: solved || revealed ? "none" : `blur(${Math.max(0, 22 - clues * 4)}px) saturate(${.5 + clues * .12})`, transform: solved || revealed ? "scale(1)" : `scale(${1.12 - clues * .012})` }} />
              <div className="mystery-scan-system" aria-hidden="true">
                <i className="mystery-scan-line" />
                <i className="mystery-focus-ring mystery-focus-ring-one" />
                <i className="mystery-focus-ring mystery-focus-ring-two" />
                <span className="mystery-reticle"><i /><i /><i /><i /></span>
              </div>
              {!solved && !revealed && <div className="mystery-mask"><ScanSearch size={46} /><span>Visual clarity {clues}/{product.clues.length}</span></div>}
              <div className="mystery-points"><strong>{availablePoints}</strong><span>points available</span></div>
            </div>
            <div className="mystery-meter"><span>Cryptic</span><div>{product.clues.map((_, clueIndex) => <i key={clueIndex} className={clueIndex < clues ? "clue-active" : ""} />)}</div><span>Clear</span></div>
          </div>

          <div className="clue-console">
            <div className="flex items-center justify-between gap-4"><p className="game-kicker">Mystery {safeIndex + 1} / {products.length}</p><span className="clue-score"><Sparkles size={14} /> {score} total</span></div>
            <h1>{solved || revealed ? product.name : "What am I?"}</h1>
            <div className="clue-stack">
              {product.clues.slice(0, clues).map((clue, clueIndex) => <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} key={clue}><span>{String(clueIndex + 1).padStart(2, "0")}</span><p>{clue}</p></motion.div>)}
            </div>

            {!solved && !revealed ? (
              <>
                <div className="mystery-options">{product.options.map((option) => <button key={option} onClick={() => guess(option)}>{option}</button>)}</div>
                <button disabled={clues === product.clues.length} onClick={() => { playGameSound("reveal"); setClues((value) => Math.min(product.clues.length, value + 1)); }} className="reveal-clue-button"><Lightbulb size={18} /> Reveal another clue <span>−20 pts</span></button>
                {wrong > 0 && <p className="wrong-guess-note" role="status" aria-live="polite">Not that one. The next clue has been uncovered.</p>}
                {clues === product.clues.length && wrong > 0 && (
                  <button onClick={revealAnswer} className="reveal-answer-button">Show me the answer <span>0 pts</span></button>
                )}
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="product-reveal-card">
                <div><Eye size={20} /><span>{revealed ? "Answer revealed · +0" : `Solved in ${clues} clue${clues === 1 ? "" : "s"} · +${availablePoints}`}</span></div>
                <h2>Why paper?</h2><p>{product.whyPaper}</p>
                <blockquote>{product.reveal}</blockquote>
                <small>{product.credit}</small>
                <div className="flex flex-wrap items-center justify-between gap-4"><a href={product.source} target="_blank" rel="noreferrer">Read source <ExternalLink size={13} /></a><button className="game-primary-button" onClick={next}>{safeIndex >= products.length - 1 ? "See detective report" : "Next mystery"} →</button></div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {phase === "result" && <ResultPanel gameId="hidden-paper" game="Hidden Paper" score={score} outOf={products.length * 120} badge={badge} message={`You identified ${solvedCount} of ${products.length} hidden paper products, using an average of ${averageClues.toFixed(1)} clues each.`} durationSeconds={seconds} metrics={{ averageClues: Number(averageClues.toFixed(1)), identified: solvedCount }} onReplay={reset}><div className="clue-result-grid">{clueHistory.map((count, itemIndex) => products[itemIndex] ? <div key={products[itemIndex].name}><span>{itemIndex + 1}</span><strong>{products[itemIndex]?.name}</strong><small>{count} clue{count === 1 ? "" : "s"}</small></div> : null)}</div></ResultPanel>}
    </GameFrame>
  );
}
