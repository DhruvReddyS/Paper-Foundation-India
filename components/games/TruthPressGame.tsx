"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Stamp } from "lucide-react";
import { useState } from "react";
import { GameFrame, GameIntro, ResultPanel } from "./GameShared";
import { truthClaims } from "./gameData";

type Verdict = "myth" | "fact" | "context";

export default function TruthPressGame() {
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Verdict | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const claim = truthClaims[index];

  function stamp(verdict: Verdict) {
    if (selected) return;
    setSelected(verdict);
    if (verdict === claim.verdict) {
      setScore((value) => value + 200);
      setCorrect((value) => value + 1);
    }
  }

  function next() {
    if (index === truthClaims.length - 1) setPhase("result");
    else { setIndex((value) => value + 1); setSelected(null); }
  }

  function reset() { setPhase("intro"); setIndex(0); setSelected(null); setScore(0); setCorrect(0); }
  const badge = correct === truthClaims.length ? "Chief Fact Checker" : correct >= 3 ? "Context Keeper" : "Evidence Apprentice";

  return (
    <GameFrame title="The Truth Press" kicker="Game 02 · Claim investigation" progress={phase === "play" ? ((index + (selected ? 1 : 0)) / truthClaims.length) * 100 : undefined}>
      {phase === "intro" && <GameIntro eyebrow="Myth, fact, or missing context?" title="Do not repeat the claim. Put it through the press." description="A claim can be false, true, or technically true while hiding the part that matters. Stamp your verdict, inspect the evidence and repair weak wording." rules={["Read the printed claim and choose Myth, Fact or Missing Context.", "Compare your verdict with the evidence and original source.", "When a claim is incomplete, read the repaired sentence that should be shared instead."]} accent="ink" onStart={() => setPhase("play")} />}

      {phase === "play" && (
        <section className="truth-stage">
          <div className="press-machine" aria-hidden="true"><div className="press-wheel" /><div className="press-bar" /><div className="press-bed"><span>TRUTH PRESS · No. {index + 1}</span></div></div>
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, y: 28, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -20 }} className="claim-sheet">
              <p className="game-kicker">Claim {index + 1} / {truthClaims.length}</p>
              <blockquote>“{claim.claim}”</blockquote>
              <div className="stamp-options" role="group" aria-label="Choose a verdict">
                {(["myth", "fact", "context"] as Verdict[]).map((verdict) => <button key={verdict} onClick={() => stamp(verdict)} disabled={Boolean(selected)} className={`${selected === verdict ? "stamp-selected" : ""} ${selected && claim.verdict === verdict ? "stamp-correct" : ""}`}><Stamp size={19} />{verdict === "context" ? "Missing context" : verdict}</button>)}
              </div>
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="truth-evidence">
                    <div className="truth-verdict-line"><span className={`verdict-${claim.verdict}`}>{claim.verdict === "context" ? "NEEDS CONTEXT" : claim.verdict.toUpperCase()}</span><strong>{selected === claim.verdict ? "+200 · Strong verdict" : "Correction printed"}</strong></div>
                    <p>{claim.explanation}</p>
                    {claim.repair && <div className="repair-strip"><small>Repair the claim</small>{claim.repair}</div>}
                    <div className="evidence-ticket"><span>Evidence note</span><p>{claim.evidence}</p><a href={claim.source} target="_blank" rel="noreferrer">Inspect source <ExternalLink size={13} /></a></div>
                    <button className="game-primary-button ml-auto" onClick={next}>{index === truthClaims.length - 1 ? "Print my result" : "Next claim"} →</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {phase === "result" && <ResultPanel game="The Truth Press" score={score} outOf={1000} badge={badge} message={`You correctly classified ${correct} of ${truthClaims.length} claims—and checked the context before sharing.`} onReplay={reset}><div className="result-newspaper"><span>THE EVIDENCE EDITION</span><strong>{correct}/{truthClaims.length}</strong><p>claims responsibly checked</p></div></ResultPanel>}
    </GameFrame>
  );
}
