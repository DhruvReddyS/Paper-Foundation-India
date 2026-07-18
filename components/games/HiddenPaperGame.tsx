"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ExternalLink, Lightbulb, ScanSearch, Sparkles } from "lucide-react";
import { useState } from "react";
import { GameFrame, GameIntro, ResultPanel, shuffleItems, useGameTimer } from "./GameShared";
import { hiddenProducts, type HiddenProduct } from "./gameData";

export default function HiddenPaperGame() {
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [products, setProducts] = useState<HiddenProduct[]>(() => shuffleItems(hiddenProducts));
  const [index, setIndex] = useState(0);
  const [clues, setClues] = useState(1);
  const [wrong, setWrong] = useState(0);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [clueHistory, setClueHistory] = useState<number[]>([]);
  const { seconds, resetTimer } = useGameTimer(phase === "play");
  const product = products[index];
  const availablePoints = Math.max(20, 120 - (clues - 1) * 20 - wrong * 15);

  function guess(option: string) {
    if (solved) return;
    const normalizedOption = option.toLocaleLowerCase();
    const normalizedAnswer = product.name.toLocaleLowerCase();
    if (normalizedOption === normalizedAnswer || normalizedAnswer.includes(normalizedOption)) {
      setSolved(true);
      setScore((value) => value + availablePoints);
      setClueHistory((value) => [...value, clues]);
    } else {
      setWrong((value) => value + 1);
      setClues((value) => Math.min(product.clues.length, value + 1));
    }
  }

  function next() {
    if (index === products.length - 1) setPhase("result");
    else { setIndex((value) => value + 1); setClues(1); setWrong(0); setSolved(false); }
  }

  function reset() { setPhase("intro"); setIndex(0); setClues(1); setWrong(0); setSolved(false); setScore(0); setClueHistory([]); setProducts(shuffleItems(hiddenProducts)); resetTimer(); }
  const averageClues = clueHistory.length ? clueHistory.reduce((a, b) => a + b, 0) / clueHistory.length : 0;
  const badge = averageClues <= 1.8 ? "Fibre Visionary" : averageClues <= 2.8 ? "Material Detective" : "Curious Observer";

  return (
    <GameFrame gameId="hidden-paper" immersive={phase !== "intro"} title="Hidden Paper" kicker="Game 04 · The clue hunt" progress={phase === "play" ? ((index + (solved ? 1 : 0)) / products.length) * 100 : undefined}>
      {phase === "intro" && <GameIntro gameId="hidden-paper" eyebrow="Unexpected paper, hiding in plain sight" title="How soon can you see the paper?" description="Identify five products using the fewest clues possible. Begin with language, then unlock material behaviour and a clearer visual—but every clue costs points." rules={["Read the first cryptic clue and make a guess or request another clue.", "A wrong guess automatically reveals more information and lowers the available score.", "After solving, peel back the object to learn exactly why a paper component works there."]} onStart={() => setPhase("play")} />}

      {phase === "play" && (
        <section className="hidden-stage">
          <div className="mystery-visual">
            <div className="mystery-image-frame">
              <Image src={product.image} alt={solved ? product.name : "Mystery paper-based product"} fill sizes="(max-width: 900px) 100vw, 50vw" priority className="object-cover" style={{ filter: solved ? "none" : `blur(${Math.max(0, 22 - clues * 4)}px) saturate(${.5 + clues * .12})`, transform: solved ? "scale(1)" : `scale(${1.12 - clues * .012})` }} />
              {!solved && <div className="mystery-mask"><ScanSearch size={46} /><span>Visual clarity {clues}/{product.clues.length}</span></div>}
              <div className="mystery-points"><strong>{availablePoints}</strong><span>points available</span></div>
            </div>
            <div className="mystery-meter"><span>Cryptic</span><div>{product.clues.map((_, clueIndex) => <i key={clueIndex} className={clueIndex < clues ? "clue-active" : ""} />)}</div><span>Clear</span></div>
          </div>

          <div className="clue-console">
            <div className="flex items-center justify-between gap-4"><p className="game-kicker">Mystery {index + 1} / {products.length}</p><span className="clue-score"><Sparkles size={14} /> {score} total</span></div>
            <h1>{solved ? product.name : "What am I?"}</h1>
            <div className="clue-stack">
              {product.clues.slice(0, clues).map((clue, clueIndex) => <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} key={clue}><span>{String(clueIndex + 1).padStart(2, "0")}</span><p>{clue}</p></motion.div>)}
            </div>

            {!solved ? (
              <>
                <div className="mystery-options">{product.options.map((option) => <button key={option} onClick={() => guess(option)}>{option}</button>)}</div>
                <button disabled={clues === product.clues.length} onClick={() => setClues((value) => Math.min(product.clues.length, value + 1))} className="reveal-clue-button"><Lightbulb size={18} /> Reveal another clue <span>−20 pts</span></button>
                {wrong > 0 && <p className="wrong-guess-note">Not that one. The next clue has been uncovered.</p>}
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="product-reveal-card">
                <div><Eye size={20} /><span>Solved in {clues} clue{clues === 1 ? "" : "s"} · +{availablePoints}</span></div>
                <h2>Why paper?</h2><p>{product.whyPaper}</p>
                <blockquote>{product.reveal}</blockquote>
                <small>{product.credit}</small>
                <div className="flex flex-wrap items-center justify-between gap-4"><a href={product.source} target="_blank" rel="noreferrer">Read source <ExternalLink size={13} /></a><button className="game-primary-button" onClick={next}>{index === products.length - 1 ? "See detective report" : "Next mystery"} →</button></div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {phase === "result" && <ResultPanel gameId="hidden-paper" game="Hidden Paper" score={score} outOf={products.length * 120} badge={badge} message={`You uncovered ${products.length} hidden paper products using an average of ${averageClues.toFixed(1)} clues each.`} durationSeconds={seconds} metrics={{ averageClues: Number(averageClues.toFixed(1)) }} onReplay={reset}><div className="clue-result-grid">{clueHistory.map((count, itemIndex) => <div key={products[itemIndex].name}><span>{itemIndex + 1}</span><strong>{products[itemIndex].name}</strong><small>{count} clue{count === 1 ? "" : "s"}</small></div>)}</div></ResultPanel>}
    </GameFrame>
  );
}
