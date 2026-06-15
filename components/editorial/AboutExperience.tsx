"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, Check, ChevronLeft, ChevronRight, FileSearch, HeartHandshake, RefreshCw, Scale, SearchCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const principles = [
  { no: "01", title: "Evidence over assertion", text: "Claims should lead to public research, data or a clearly named primary source.", icon: SearchCheck },
  { no: "02", title: "Trade-offs over slogans", text: "Material systems are complicated. We show where context changes a simple answer.", icon: Scale },
  { no: "03", title: "Method over conclusion", text: "A number is only as useful as the method and boundaries used to produce it.", icon: FileSearch },
  { no: "04", title: "Correction over defensiveness", text: "Public knowledge earns trust by making changes visible and easy to inspect.", icon: RefreshCw },
] as const;

const timeline = [
  { year: "01", title: "Find the public question", text: "Begin with what people are actually confused or worried about." },
  { year: "02", title: "Map the evidence", text: "Prioritise primary sources and name the limits of what they prove." },
  { year: "03", title: "Design understanding", text: "Turn complexity into reading, interaction and play without flattening it." },
  { year: "04", title: "Keep it open", text: "Publish sources, invite corrections and update the record when evidence changes." },
] as const;

export default function AboutExperience() {
  const [principle, setPrinciple] = useState(0);
  const [step, setStep] = useState(0);
  const current = principles[principle];
  const CurrentIcon = current.icon;
  function change(direction: -1 | 1) { setPrinciple((principle + direction + principles.length) % principles.length); }

  return <div className="about-studio">
    <section className="about-studio-hero">
      <div className="about-hero-grid"><div><p className="premium-kicker"><span /> Independent public knowledge</p><h1>We make paper<br /><em>easier to think about.</em></h1><p>Paper Foundation India is an evidence-led public platform for replacing material anxiety with context, curiosity and practical literacy.</p><div><a href="#method">See how we work <ArrowRight /></a><Link href="/contact">Talk to the foundation</Link></div></div>
      <div className="about-hero-sculpture" aria-hidden="true"><motion.div animate={{ rotateY: [0, 9, 0], rotateX: [2, -3, 2] }} transition={{ duration: 8, repeat: Infinity }}><span>PFI</span><strong>EVIDENCE<br />CONTEXT<br />ACTION</strong><small>OPEN EDITION</small></motion.div><i /><i /><b /></div></div>
      <div className="about-hero-foot"><span><b>01</b> mission</span><span><b>04</b> editorial promises</span><span><b>∞</b> questions welcome</span></div>
    </section>

    <section className="about-mission-statement"><p className="premium-kicker">The mission</p><h2>Build a public culture that asks <em>better material questions</em> before accepting better-sounding answers.</h2><div><p>We are not here to argue that paper is automatically good. We are here to make sourcing, production, use and recovery visible enough for people to judge responsibly.</p><aside><HeartHandshake /><strong>For students, families, professionals, researchers and anyone holding a sheet of paper.</strong></aside></div></section>

    <section className="about-principle-carousel">
      <header><div><p className="premium-kicker">Editorial promises</p><h2>What every page<br />must earn.</h2></div><div><button onClick={() => change(-1)} aria-label="Previous principle"><ChevronLeft /></button><span>{principle + 1} / 4</span><button onClick={() => change(1)} aria-label="Next principle"><ChevronRight /></button></div></header>
      <div className="about-principle-stage"><AnimatePresence mode="wait"><motion.article key={principle} initial={{ opacity: 0, x: 45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -45 }}><span>{current.no}</span><CurrentIcon /><div><small>Promise {current.no}</small><h3>{current.title}</h3><p>{current.text}</p></div></motion.article></AnimatePresence><nav>{principles.map((item, index) => <button onClick={() => setPrinciple(index)} className={index === principle ? "is-active" : ""} key={item.title}><span>{item.no}</span>{item.title}</button>)}</nav></div>
    </section>

    <section id="method" className="about-method-timeline"><header><p className="premium-kicker">Our working method</p><h2>From public question<br />to useful knowledge.</h2></header><div className="about-timeline-track">{timeline.map((item, index) => <button onClick={() => setStep(index)} className={step === index ? "is-active" : ""} key={item.year}><span>{item.year}</span><i /></button>)}</div><AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><span>Step {timeline[step].year}</span><h3>{timeline[step].title}</h3><p>{timeline[step].text}</p></motion.div></AnimatePresence></section>

    <section className="about-transparency"><div><p className="premium-kicker">Trust is a visible process</p><h2>Open by default.</h2><p>Readers should be able to see where a claim came from, how we framed it, and what changed after publication.</p><Link href="/corrections">View the correction record <ArrowRight /></Link></div><div className="transparency-stack"><motion.article whileHover={{ rotate: -2, y: -8 }}><BookOpenCheck /><span>Sources</span><strong>Linked where the claim appears.</strong><Check /></motion.article><motion.article whileHover={{ rotate: 1, y: -8 }}><FileSearch /><span>Methods</span><strong>Boundaries and assumptions named.</strong><Check /></motion.article><motion.article whileHover={{ rotate: -1, y: -8 }}><RefreshCw /><span>Corrections</span><strong>Updated without erasing history.</strong><Check /></motion.article></div></section>

    <section className="about-studio-cta"><Sparkles /><p>There is more to explore.</p><h2>Read. Question. Play.<br />Follow the fibre.</h2><div><Link href="/knowledge">Enter the knowledge studio <ArrowRight /></Link><Link href="/games">Open the games lab</Link></div></section>
  </div>;
}
