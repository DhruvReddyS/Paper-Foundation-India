"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Factory,
  Leaf,
  RotateCcw,
  ScanSearch,
  Sparkles,
  Stamp,
  Trees,
} from "lucide-react";
import Link from "next/link";
import { useState, type PointerEvent } from "react";

const claims = [
  {
    claim: "Paper is always bad for forests.",
    verdict: "Missing context",
    explanation: "The outcome depends on fibre source, forest management, product design, use and recovery. A material label alone is not evidence.",
  },
  {
    claim: "Every paper package can go into every recycling bin.",
    verdict: "Myth",
    explanation: "Food, wax and some barrier layers can prevent recovery. Clean, dry paper accepted by the local system has the best chance of another life.",
  },
  {
    claim: "Paper fibres can be recycled forever.",
    verdict: "Myth",
    explanation: "Fibres shorten and some are lost in each cycle. Responsibly sourced fresh fibre replenishes a working paper loop.",
  },
] as const;

const games = [
  { number: "01", title: "Grow or Shred", note: "Grow evidence into a living tree", href: "/discover/grow-or-shred", icon: Trees },
  { number: "02", title: "The Truth Press", note: "Stamp claims with the right verdict", href: "/discover/truth-press", icon: Stamp },
  { number: "03", title: "Mill Shuffle", note: "Build a working paper mill line", href: "/discover/mill-master", icon: Factory },
  { number: "04", title: "Hidden Paper", note: "Find fibre hiding in daily life", href: "/discover/hidden-paper", icon: ScanSearch },
] as const;

const reading = [
  ["01", "Context", "How paper fits a circular material system", "/knowledge"],
  ["02", "Evidence", "Why source and recovery matter more than slogans", "/myths"],
  ["03", "Journey", "Follow one sheet through eleven possible lives", "/journey"],
] as const;

export default function HomeExperience() {
  const reducedMotion = useReducedMotion();
  const [claimIndex, setClaimIndex] = useState(0);
  const [scanned, setScanned] = useState(false);

  function moveLandscape(event: PointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--home-x", `${x * 22}px`);
    event.currentTarget.style.setProperty("--home-y", `${y * 14}px`);
  }

  function nextClaim() {
    setScanned(false);
    setClaimIndex((value) => (value + 1) % claims.length);
  }

  const claim = claims[claimIndex];

  return (
    <div className="home-editorial">
      <section className="home-cover" onPointerMove={moveLandscape}>
        <div className="home-cover-grain" />
        <div className="home-sun" />
        <PaperLandscape reducedMotion={Boolean(reducedMotion)} />

        <div className="home-cover-copy">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="home-issue-label">
            <span /> Public knowledge · India · Open edition
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.75 }}>
            Paper has<br />more than <em>one life.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="home-cover-lead">
            Look past the label. Follow the fibre, question the claim, and see how responsible paper actually works.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="home-cover-actions">
            <Link href="/journey">Open the paper journey <ArrowRight /></Link>
            <Link href="/games">Learn by playing</Link>
          </motion.div>
        </div>

        <motion.aside initial={{ opacity: 0, rotate: 5, x: 30 }} animate={{ opacity: 1, rotate: 2, x: 0 }} transition={{ delay: 0.35, type: "spring" }} className="home-field-note">
          <p><Leaf /> Field note 01</p>
          <strong>A sheet is not an ending.</strong>
          <span>Clean recovery can turn yesterday&apos;s use into tomorrow&apos;s fibre.</span>
          <Link href="/circularity">Trace the loop <ArrowRight /></Link>
        </motion.aside>

        <div className="home-cover-index" aria-label="Site highlights">
          <span><strong>11</strong> journey chapters</span>
          <span><strong>04</strong> playable labs</span>
          <span><strong>01</strong> evidence-first mission</span>
        </div>
      </section>

      <SystemRail />

      <section className="home-lab">
        <div className="home-lab-copy">
          <p className="home-micro-label">Interactive evidence lab</p>
          <h2>Put the sentence<br /><em>under pressure.</em></h2>
          <p>Real sustainability claims rarely fit inside a yes or no. Scan a familiar statement and reveal the context it leaves behind.</p>
          <div className="home-lab-progress">Claim {String(claimIndex + 1).padStart(2, "0")} / {String(claims.length).padStart(2, "0")}</div>
        </div>
        <div className={`home-scanner ${scanned ? "is-scanned" : ""}`}>
          <div className="home-scanner-top"><span><ScanSearch /> Context scanner</span><small>PFI / LAB 01</small></div>
          <div className="home-claim-sheet">
            <p>{claim.claim}</p>
            {!scanned ? (
              <button onClick={() => setScanned(true)}>Scan the claim <ScanSearch /></button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="home-verdict">
                <span><Check /> {claim.verdict}</span>
                <p>{claim.explanation}</p>
                <button onClick={nextClaim}>Scan another <RotateCcw /></button>
              </motion.div>
            )}
            <div className="home-scan-line" />
          </div>
          <p className="home-lab-note">Built to teach critical reading, not to replace source checking.</p>
        </div>
      </section>

      <section className="home-paper-manifesto">
        <div className="home-paper-manifesto-text">
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Paper Foundation India · A public material story</motion.p>
          <motion.h2 initial={{ opacity: 0, filter: "blur(8px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: .8 }}>
            Paper is not<br /><em>the enemy.</em><br />Waste is.
          </motion.h2>
          <p>Source it responsibly. Use it with purpose. Keep clean fibre moving.</p>
          <div><Link href="/circularity">Explore the system <ArrowRight /></Link><Link href="/about">Our editorial position</Link></div>
        </div>
      </section>

      <section className="home-journey-portal">
        <div className="home-journey-copy">
          <p className="home-micro-label">One sheet · many lives</p>
          <h2>A book you do not<br />just <em>read.</em></h2>
          <p>Open a cinematic eleven-chapter paper journey. Turn pages, sort fibre, mix pulp, test recovery choices and see where the loop can continue.</p>
          <Link href="/journey">Enter the story <ArrowRight /></Link>
        </div>
        <Link href="/journey" className="home-book-object" aria-label="Open One Sheet, Many Lives">
          <span className="home-book-pages" />
          <span className="home-book-cover">
            <small>Paper Foundation India</small>
            <strong>One Sheet.<br />Many Lives.</strong>
            <i>An interactive paper journey</i>
          </span>
          <span className="home-book-shadow" />
        </Link>
      </section>

      <section className="home-playground">
        <div className="home-playground-heading">
          <div><p className="home-micro-label">The playable edition</p><h2>Learn with your<br /><em>hands on the idea.</em></h2></div>
          <div><p>Four short, replayable games built for curious people of every age. Every result can become a shareable proof of what you learned.</p><Link href="/games">View the games hub <ArrowRight /></Link></div>
        </div>
        <div className="home-game-grid">
          {games.map((game, index) => {
            const Icon = game.icon;
            return <Link href={game.href} className={`home-game-ticket ticket-${index + 1}`} key={game.title}>
              <span className="home-ticket-no">Game {game.number}</span>
              <Icon />
              <div><h3>{game.title}</h3><p>{game.note}</p></div>
              <ArrowRight className="home-ticket-arrow" />
            </Link>;
          })}
        </div>
      </section>

      <section className="home-reading">
        <div className="home-reading-title"><p className="home-micro-label">Knowledge desk · Start here</p><h2>Reading worth<br />your <em>questions.</em></h2></div>
        <div className="home-reading-list">
          {reading.map(([number, type, title, href]) => <Link href={href} key={number}>
            <span>{number}</span><small>{type}</small><strong>{title}</strong><ArrowRight />
          </Link>)}
        </div>
      </section>

      <section className="home-closing">
        <Sparkles />
        <p>Use paper thoughtfully.</p>
        <h2>Then give the fibre<br /><em>another life.</em></h2>
        <div><Link href="/knowledge">Explore the evidence <ArrowRight /></Link><Link href="/get-involved">Join the foundation</Link></div>
      </section>
    </div>
  );
}

function SystemRail() {
  const [active, setActive] = useState(0);
  const stages = [
    { label: "Source", title: "Ask where the fibre began.", text: "Sourcing evidence changes the environmental story before a sheet reaches a mill.", icon: Trees },
    { label: "Make", title: "Read the method, not the slogan.", text: "Energy, water, chemistry and product design decide how efficiently fibre becomes paper.", icon: Factory },
    { label: "Use", title: "Fit the sheet to the job.", text: "The responsible choice is not always less paper. It is the right paper, used fully.", icon: Leaf },
    { label: "Recover", title: "Keep clean fibre moving.", text: "Sorting and collection decide whether a used sheet becomes feedstock or waste.", icon: RotateCcw },
  ] as const;
  const ActiveIcon = stages[active].icon;

  return <section className="home-system-rail">
    <div className="home-system-heading"><p className="home-micro-label">One material · Four decisions</p><h2>The outcome changes<br />at every step.</h2></div>
    <div className="home-system-console">
      <nav aria-label="Paper system stages">{stages.map((stage, index) => <button key={stage.label} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{stage.label}<i /></button>)}</nav>
      <motion.article key={active} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }}>
        <div className="home-system-icon"><ActiveIcon /></div><p>{stages[active].label} / Decision {active + 1}</p><h3>{stages[active].title}</h3><span>{stages[active].text}</span>
      </motion.article>
      <div className="home-system-orbit" aria-hidden="true"><i /><i /><span>{active + 1}</span></div>
    </div>
  </section>;
}

function PaperLandscape({ reducedMotion }: { reducedMotion: boolean }) {
  return <div className="home-landscape" aria-hidden="true">
    <div className="home-cloud cloud-left"><i /><i /><i /></div>
    <div className="home-cloud cloud-right"><i /><i /><i /></div>
    <div className="home-mountain mountain-back" />
    <div className="home-mountain mountain-left" />
    <div className="home-mountain mountain-right" />
    <div className="home-hill hill-back" />
    <div className="home-hill hill-front" />
    <div className="home-trees">
      {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ "--tree-i": i } as React.CSSProperties}><b /><i /><i /><i /></span>)}
    </div>
    {Array.from({ length: 8 }).map((_, i) => <motion.i
      className={`home-flying-sheet sheet-${i + 1}`}
      key={i}
      animate={reducedMotion ? undefined : { y: [0, -14 - (i % 3) * 5, 0], rotate: [i * 7, i * 7 + 12, i * 7] }}
      transition={{ duration: 4.2 + i * 0.45, repeat: Infinity, ease: "easeInOut", delay: i * -0.55 }}
    />)}
    <div className="home-paper-river" />
  </div>;
}
