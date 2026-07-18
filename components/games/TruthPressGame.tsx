"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Stamp } from "lucide-react";
import { useState } from "react";
import { GameFrame, GameIntro, ResultPanel, shuffleItems, useGameTimer } from "./GameShared";
import { truthClaims, type TruthClaim } from "./gameData";

type Verdict = "myth" | "fact";
type BinaryClaim = Omit<TruthClaim, "verdict"> & { verdict: Verdict };
const binaryClaims = truthClaims.map((claim): BinaryClaim => ({ ...claim, verdict: claim.verdict === "fact" ? "fact" : "myth" }));

export default function TruthPressGame() {
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [claims, setClaims] = useState<BinaryClaim[]>(() => shuffleItems(binaryClaims));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Verdict | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { seconds, resetTimer } = useGameTimer(phase === "play");
  const claim = claims[index];

  function stamp(verdict: Verdict) {
    if (selected) return;
    setSelected(verdict);
    if (verdict === claim.verdict) {
      setScore((value) => value + 200);
      setCorrect((value) => value + 1);
    }
  }

  function next() {
    if (index === claims.length - 1) setPhase("result");
    else { setIndex((value) => value + 1); setSelected(null); }
  }

  function reset() { setPhase("intro"); setIndex(0); setSelected(null); setScore(0); setCorrect(0); setClaims(shuffleItems(binaryClaims)); resetTimer(); }
  const badge = correct === claims.length ? "Chief Fact Checker" : correct >= 3 ? "Claim Reader" : "Evidence Apprentice";

  return (
    <GameFrame gameId="truth-press" immersive={phase !== "intro"} title="The Truth Press" kicker="Game 02 · Claim investigation" elapsedSeconds={phase === "intro" ? undefined : seconds} progress={phase === "play" ? ((index + (selected ? 1 : 0)) / claims.length) * 100 : undefined}>
      {phase === "intro" && <GameIntro gameId="truth-press" eyebrow="Myth or fact?" title="Do not repeat the claim. Put it through the press." description="Read each statement, stamp it Myth or Fact, then inspect the evidence before the next sheet enters the press." rules={["Read the printed claim without guessing from the headline alone.", "Choose only Myth or Fact.", "Compare your verdict with the explanation and inspect the named source."]} onStart={() => setPhase("play")} />}

      {phase === "play" && (
        <section className="truth-stage">
          <div className="press-machine" aria-hidden="true"><div className="press-wheel" /><div className="press-bar" /><div className="press-bed"><span>TRUTH PRESS · No. {index + 1}</span></div></div>
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, y: 28, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -20 }} className="claim-sheet">
              <p className="game-kicker">Claim {index + 1} / {claims.length}</p>
              <blockquote>“{claim.claim}”</blockquote>
              <div className="stamp-options" role="group" aria-label="Choose a verdict">
                {(["myth", "fact"] as Verdict[]).map((verdict) => <button key={verdict} onClick={() => stamp(verdict)} disabled={Boolean(selected)} className={`${selected === verdict ? "stamp-selected" : ""} ${selected && claim.verdict === verdict ? "stamp-correct" : ""}`}><Stamp size={19} />{verdict}</button>)}
              </div>
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="truth-evidence">
                    <div className="truth-verdict-line"><span className={`verdict-${claim.verdict}`}>{claim.verdict.toUpperCase()}</span><strong>{selected === claim.verdict ? "+200 · Strong verdict" : "Correction printed"}</strong></div>
                    <p>{claim.explanation}</p>
                    {claim.repair && <div className="repair-strip"><small>Repair the claim</small>{claim.repair}</div>}
                    <div className="evidence-ticket"><span>Evidence note</span><p>{claim.evidence}</p><a href={claim.source} target="_blank" rel="noreferrer">Inspect source <ExternalLink size={13} /></a></div>
                    <button className="game-primary-button ml-auto" onClick={next}>{index === claims.length - 1 ? "Print my result" : "Next claim"} →</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {phase === "result" && <ResultPanel gameId="truth-press" game="The Truth Press" score={score} outOf={claims.length * 200} badge={badge} message={`You correctly classified ${correct} of ${claims.length} claims—and checked the context before sharing.`} durationSeconds={seconds} metrics={{ correctClaims: correct }} onReplay={reset}><div className="result-newspaper"><span>THE EVIDENCE EDITION</span><strong>{correct}/{claims.length}</strong><p>claims responsibly checked</p></div></ResultPanel>}
    </GameFrame>
  );
}
