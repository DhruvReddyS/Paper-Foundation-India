"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Stamp } from "@/components/paper-ui/icons";
import { useEffect, useRef, useState } from "react";
import { GameFrame, GameIntro, ResultPanel, shuffleItems, useGameConfiguration, useGameTimer } from "./GameShared";
import { playGameSound } from "./gameAudio";
import { truthClaims, type TruthClaim } from "./gameData";

type Verdict = "myth" | "fact" | "context";

const verdicts: Verdict[] = ["myth", "context", "fact"];
const verdictLabels: Record<Verdict, string> = { myth: "Myth", context: "Needs context", fact: "Fact" };
const verdictReadout: Record<Verdict, string> = {
  myth: "MYTH",
  context: "NEEDS CONTEXT",
  fact: "FACT",
};

function toVerdict(value: unknown): Verdict {
  return value === "fact" ? "fact" : value === "context" ? "context" : "myth";
}

function normalizeClaims(items: readonly TruthClaim[]): TruthClaim[] {
  return items.map((item) => ({ ...item, verdict: toVerdict(item.verdict) }));
}

export default function TruthPressGame() {
  const configuration = useGameConfiguration("truth-press");
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [claims, setClaims] = useState<TruthClaim[]>(() => shuffleItems(normalizeClaims(truthClaims)));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Verdict | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [stamped, setStamped] = useState<{ claim: string; chose: Verdict; actual: Verdict }[]>([]);
  const { seconds, resetTimer } = useGameTimer(phase === "play");
  // Clamped so a shorter configured set, or any other desynchronisation
  // between the cursor and the data, cannot render from an empty slot.
  const advancedFrom = useRef<number | null>(null);
  const answeredAt = useRef<number | null>(null);
  const safeIndex = claims.length ? Math.min(index, claims.length - 1) : 0;
  const claim = claims[safeIndex];
  useEffect(() => {
    if (index !== safeIndex) setIndex(safeIndex);
  }, [index, safeIndex]);
  useEffect(() => {
    const configured = configuration?.content?.claims;
    if (phase !== "intro" || !Array.isArray(configured) || !configured.length) return;
    setClaims(shuffleItems(normalizeClaims(configured as TruthClaim[])));
  }, [configuration, phase]);

  function stamp(verdict: Verdict) {
    if (selected || answeredAt.current === safeIndex) return;
    answeredAt.current = safeIndex;
    setSelected(verdict);
    setStamped((value) => [...value, { claim: claim.claim, chose: verdict, actual: toVerdict(claim.verdict) }]);
    if (verdict === claim.verdict) {
      playGameSound("correct");
      setScore((value) => value + 200);
      setCorrect((value) => value + 1);
    } else playGameSound("wrong");
  }

  function next() {
    if (!selected || advancedFrom.current === safeIndex) return;
    advancedFrom.current = safeIndex;
    if (safeIndex >= claims.length - 1) {
      playGameSound("complete");
      setPhase("result");
    }
    else { setIndex((value) => value + 1); setSelected(null); }
  }

  function reset() {
    const configured = configuration?.content?.claims;
    const source = Array.isArray(configured) && configured.length
      ? normalizeClaims(configured as TruthClaim[])
      : normalizeClaims(truthClaims);
    advancedFrom.current = null;
    answeredAt.current = null;
    setPhase("intro");
    setIndex(0);
    setSelected(null);
    setScore(0);
    setCorrect(0);
    setStamped([]);
    setClaims(shuffleItems(source));
    resetTimer();
  }
  // Thresholds follow the number of claims actually in play, so an editor
  // adding or removing a claim cannot make a badge unreachable.
  const badge = correct === claims.length
    ? "Chief Fact Checker"
    : correct >= Math.ceil(claims.length * 0.6)
      ? "Claim Reader"
      : "Evidence Apprentice";

  return (
    <GameFrame gameId="truth-press" immersive={phase !== "intro"} title="The Truth Press" kicker="Game 02 · Claim investigation" elapsedSeconds={phase === "intro" ? undefined : seconds} progress={phase === "play" && claims.length ? ((safeIndex + (selected ? 1 : 0)) / claims.length) * 100 : undefined}>
      {phase === "intro" && <GameIntro gameId="truth-press" eyebrow="Myth, context or fact?" title="Do not repeat the claim. Put it through the press." description="Read each statement, stamp it Myth, Needs context or Fact, then inspect the evidence before the next sheet enters the press." rules={["Read the printed claim without guessing from the headline alone.", "Stamp it Myth, Needs context, or Fact. Some claims are true only under stated conditions.", "Compare your verdict with the explanation and inspect the named source."]} onStart={() => setPhase("play")} />}

      {phase === "play" && claim && (
        <section className="truth-stage">
          <div className={`press-machine ${selected ? "is-cycling" : ""} ${selected === claim.verdict ? "is-success" : selected ? "is-error" : ""}`} aria-hidden="true">
            <div className="press-status"><i /><span>{selected ? "PRESS CYCLE" : "READY"}</span></div>
            <div className="press-wheel"><i /><i /><i /><i /><b /></div>
            <div className="press-piston"><i /></div>
            <div className="press-bar" />
            <div className="press-roller press-roller-top"><i /></div>
            <div className="press-feed-sheet"><span>CLAIM {String(safeIndex + 1).padStart(2, "0")}</span></div>
            <div className="press-roller press-roller-bottom"><i /></div>
            <div className="press-bed"><span>TRUTH PRESS · No. {safeIndex + 1}</span></div>
          </div>
          <motion.div key={safeIndex} initial={{ opacity: 0, y: 28, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} className={`claim-sheet ${selected ? "is-stamped" : ""}`}>
              <p className="game-kicker">Claim {safeIndex + 1} / {claims.length}</p>
              <blockquote>“{claim.claim}”</blockquote>
              <div className="stamp-options" role="group" aria-label="Choose a verdict: myth, needs context, or fact">
                {verdicts.map((verdict) => <button key={verdict} onClick={() => stamp(verdict)} disabled={Boolean(selected)} className={`stamp-${verdict} ${selected === verdict ? "stamp-selected" : ""} ${selected && claim.verdict === verdict ? "stamp-correct" : ""}`}><Stamp size={19} />{verdictLabels[verdict]}</button>)}
              </div>
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="truth-evidence" role="status" aria-live="polite">
                    <div className="truth-verdict-line"><span className={`verdict-${claim.verdict}`}>{verdictReadout[toVerdict(claim.verdict)]}</span><strong>{selected === claim.verdict ? "+200 · Strong verdict" : "Correction printed"}</strong></div>
                    <p>{claim.explanation}</p>
                    {claim.repair && <div className="repair-strip"><small>Repair the claim</small>{claim.repair}</div>}
                    <div className="evidence-ticket"><span>Evidence note</span><p>{claim.evidence}</p><a href={claim.source} target="_blank" rel="noreferrer">Inspect source <ExternalLink size={13} /></a></div>
                    <button className="game-primary-button ml-auto" onClick={next}>{index === claims.length - 1 ? "Print my result" : "Next claim"} →</button>
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>
        </section>
      )}

      {phase === "result" && <ResultPanel gameId="truth-press" game="The Truth Press" score={score} outOf={claims.length * 200} badge={badge} message={`You correctly classified ${correct} of ${claims.length} claims, and checked the context before sharing.`} durationSeconds={seconds} metrics={{ correctClaims: correct, claimsReviewed: claims.length }} onReplay={reset}><>
        <div className="result-newspaper"><span>THE EVIDENCE EDITION</span><strong>{correct}/{claims.length}</strong><p>claims responsibly checked</p></div>
        <ol className="truth-result-ledger">
          {stamped.map((entry, entryIndex) => (
            <li key={`${entry.claim}-${entryIndex}`} className={entry.chose === entry.actual ? "is-correct" : "is-wrong"}>
              <span>{String(entryIndex + 1).padStart(2, "0")}</span>
              <p>{entry.claim}</p>
              <small>You stamped {verdictLabels[entry.chose]} · Verified {verdictLabels[entry.actual]}</small>
            </li>
          ))}
        </ol>
      </></ResultPanel>}
    </GameFrame>
  );
}
