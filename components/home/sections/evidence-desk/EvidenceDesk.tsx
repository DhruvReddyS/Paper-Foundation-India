"use client";

import { ArrowRight, Check, FileSearch, RotateCcw, Stamp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./EvidenceDesk.module.css";

type Verdict = "Myth" | "Fact" | "Missing context";

const claims: { claim: string; answer: Verdict; explanation: string; source: string }[] = [
  { claim: "Paper fibres can be recycled forever.", answer: "Myth", explanation: "Fibres shorten through repeated recovery. Responsibly sourced fresh fibre keeps the wider loop working.", source: "Fibre lifecycle note 04" },
  { claim: "Every paper product belongs in every recycling bin.", answer: "Missing context", explanation: "Local collection rules, contamination and product construction determine whether a paper item can be recovered.", source: "Recovery systems note 07" },
  { claim: "Source and forest management affect paper's footprint.", answer: "Fact", explanation: "The origin of fibre and the way working forests are managed are essential parts of a complete material assessment.", source: "Responsible fibre note 02" },
];

const verdicts: Verdict[] = ["Myth", "Fact", "Missing context"];

export default function EvidenceDesk() {
  const [claimIndex, setClaimIndex] = useState(0);
  const [choice, setChoice] = useState<Verdict | null>(null);
  const current = claims[claimIndex];
  const isCorrect = choice === current.answer;

  function nextClaim() {
    setClaimIndex((index) => (index + 1) % claims.length);
    setChoice(null);
  }

  return (
    <section className={styles.section} aria-labelledby="evidence-desk-title">
      <div className={styles.copy}>
        <p className={styles.kicker}><FileSearch aria-hidden="true" /> The evidence desk</p>
        <h2 id="evidence-desk-title">Don&apos;t just read a claim.<br /><em>Pressure-test it.</em></h2>
        <p>Choose a verdict. We will show what the statement includes, what it leaves out and why context changes the answer.</p>
        <div className={styles.progress} aria-label={`Claim ${claimIndex + 1} of ${claims.length}`}>
          {claims.map((_, index) => <i className={index === claimIndex ? styles.active : ""} key={index} />)}
        </div>
        <Link href="/myths">Open the full myth desk <ArrowRight aria-hidden="true" /></Link>
      </div>

      <div className={styles.machine}>
        <header><span><Stamp aria-hidden="true" /> Claim scanner</span><small>Desk 01 · live</small></header>
        <article className={choice ? styles.isStamped : ""}>
          <div className={styles.paperMeta}><span>Incoming claim</span><small>0{claimIndex + 1} / 0{claims.length}</small></div>
          <blockquote>“{current.claim}”</blockquote>
          {!choice ? (
            <div className={styles.verdicts} aria-label="Choose a verdict">
              {verdicts.map((verdict) => <button onClick={() => setChoice(verdict)} key={verdict}>{verdict}</button>)}
            </div>
          ) : (
            <div className={`${styles.result} ${isCorrect ? styles.correct : styles.reconsider}`} aria-live="polite">
              <span>{isCorrect ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}{isCorrect ? "Evidence matched" : `Best verdict: ${current.answer}`}</span>
              <p>{current.explanation}</p><small>{current.source}</small>
            </div>
          )}
          {choice && <div className={styles.stamp} aria-hidden="true">{current.answer}</div>}
        </article>
        <footer><span>Evidence first · context visible</span><button onClick={nextClaim}>{choice ? "Next claim" : "Skip claim"} <ArrowRight aria-hidden="true" /></button></footer>
      </div>
    </section>
  );
}
