"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpenCheck, Check, ChevronLeft, ChevronRight, FileSearch, HeartHandshake, Mail, MapPin, RefreshCw, Scale, SearchCheck, Sparkles, Users } from "lucide-react";
import { useState, type PointerEvent } from "react";

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

const officeBearers = [
  ["Rama Krishna Rao Boddu", "President"],
  ["Mahesh Dipchand Gandhi", "Vice President"],
  ["Sripathi Dayaker Reddy", "General Secretary"],
  ["Chamala Ravinder Reddy", "Joint Secretary"],
  ["T. Kishan Singh", "Treasurer"],
] as const;

const executiveMembers = ["Nirmal Kuhad Jain", "Moolchand Parekh", "B. R. Rao"] as const;

const advisors = [
  ["Narender Paruchuri", "Pragathi Art Printers"],
  ["Anka Rao", "Environmentalist; advisor to the Government of Andhra Pradesh on environment"],
  ["Sanjay Singh", "Managing Director, ITC"],
  ["Venkateshwar Rao", "Raithu Naisthan Magazine"],
] as const;

export default function AboutExperience() {
  const reducedMotion = useReducedMotion();
  const [principle, setPrinciple] = useState(0);
  const [step, setStep] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const current = principles[principle];
  const CurrentIcon = current.icon;

  function change(direction: -1 | 1) {
    setPrinciple((principle + direction + principles.length) % principles.length);
  }

  function moveIdentity(event: PointerEvent<HTMLElement>) {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({ x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5 });
  }

  return <div className="about-studio">
    <section className="about-studio-hero" onPointerMove={moveIdentity}>
      <div className="about-hero-grid">
        <div>
          <p className="premium-kicker"><span /> Registered society · Hyderabad · Open public knowledge</p>
          <h1>Love paper.<br /><em>Understand it fully.</em></h1>
          <p>Paper Foundation India builds responsible public understanding of paper, challenges environmental myths and greenwashing, and promotes informed use of Indian-made paper and paper products.</p>
          <div><a href="#team">Meet the foundation <ArrowRight /></a><Link href="/contact">Talk to us</Link></div>
        </div>
        <motion.div className="about-identity-object" animate={{ rotateY: pointer.x * 8, rotateX: pointer.y * -6, x: pointer.x * 12, y: pointer.y * 8 }} transition={{ type: "spring", stiffness: 70, damping: 18 }}>
          <div className="about-logo-sheet"><Image src="/images/brand/paper-foundation-logo.png" alt="Official Paper Foundation logo and tagline" fill sizes="(max-width: 980px) 70vw, 430px" className="object-contain" priority /><i /><span>REGD. NO. 50 OF 2025</span></div>
          <b className="about-identity-shadow" />
        </motion.div>
      </div>
      <div className="about-hero-foot"><span><b>2025</b> registered in Telangana</span><span><b>08</b> office and executive members</span><span><b>04</b> supplied advisors</span></div>
    </section>

    <section className="about-mission-statement">
      <p className="premium-kicker">The documented objective</p>
      <h2>Encourage responsible paper use, <em>bust myths</em>, challenge greenwashing and make new paper applications visible.</h2>
      <div><p>The foundation also supports Indian-made paper and paper products in the spirit of Atmanirbhar Bharat. The public-facing platform translates that objective into evidence, interactive learning and practical material literacy.</p><aside><HeartHandshake /><strong>Love paper. Use paper without hesitation, and use it with responsibility.</strong></aside></div>
    </section>

    <section id="team" className="about-team-ledger">
      <header><div><p className="premium-kicker">The people behind the foundation</p><h2>A public institution<br />with named responsibility.</h2></div><p>Roles below are taken from the supplied registration, membership and first-meeting documents.</p></header>
      <div className="about-team-layout">
        <div className="about-office-list">{officeBearers.map(([name, role], index) => <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} key={name}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{role}</small><strong>{name}</strong></div><i /></motion.article>)}</div>
        <aside className="about-executive-card"><Users /><p>Executive members</p>{executiveMembers.map((name) => <strong key={name}>{name}</strong>)}<span>Paper Foundation · Hyderabad</span></aside>
      </div>
      <div className="about-advisor-rail"><span>Advisors</span>{advisors.map(([name, detail]) => <article key={name}><strong>{name}</strong><p>{detail}</p></article>)}</div>
    </section>

    <section className="about-principle-carousel">
      <header><div><p className="premium-kicker">Editorial promises</p><h2>What every public<br />page must earn.</h2></div><div><button onClick={() => change(-1)} aria-label="Previous principle"><ChevronLeft /></button><span>{principle + 1} / 4</span><button onClick={() => change(1)} aria-label="Next principle"><ChevronRight /></button></div></header>
      <div className="about-principle-stage"><AnimatePresence mode="wait"><motion.article key={principle} initial={{ opacity: 0, x: 45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -45 }}><span>{current.no}</span><CurrentIcon /><div><small>Promise {current.no}</small><h3>{current.title}</h3><p>{current.text}</p></div></motion.article></AnimatePresence><nav>{principles.map((item, index) => <button onClick={() => setPrinciple(index)} className={index === principle ? "is-active" : ""} key={item.title}><span>{item.no}</span>{item.title}</button>)}</nav></div>
    </section>

    <section id="method" className="about-method-timeline"><header><p className="premium-kicker">Our working method</p><h2>From public question<br />to useful knowledge.</h2></header><div className="about-timeline-track">{timeline.map((item, index) => <button onClick={() => setStep(index)} className={step === index ? "is-active" : ""} key={item.year}><span>{item.year}</span><i /></button>)}</div><AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><span>Step {timeline[step].year}</span><h3>{timeline[step].title}</h3><p>{timeline[step].text}</p></motion.div></AnimatePresence></section>

    <section className="about-transparency"><div><p className="premium-kicker">Trust is a visible process</p><h2>Registered.<br />Reachable.<br />Correctable.</h2><p>Paper Foundation is registered in Hyderabad, Telangana. Readers should be able to inspect claims, understand our method and contact the organization directly.</p><div className="about-contact-lines"><span><MapPin /> Domalguda, Hyderabad, Telangana</span><a href="mailto:paperfoundationindia@gmail.com"><Mail /> paperfoundationindia@gmail.com</a></div></div><div className="transparency-stack"><motion.article whileHover={{ rotate: -2, y: -8 }}><BookOpenCheck /><span>Sources</span><strong>Linked where the claim appears.</strong><Check /></motion.article><motion.article whileHover={{ rotate: 1, y: -8 }}><FileSearch /><span>Methods</span><strong>Boundaries and assumptions named.</strong><Check /></motion.article><motion.article whileHover={{ rotate: -1, y: -8 }}><RefreshCw /><span>Corrections</span><strong>Updated without erasing history.</strong><Check /></motion.article></div></section>

    <section className="about-studio-cta"><Sparkles /><p>Paper Foundation India</p><h2>Read. Question. Play.<br />Use paper thoughtfully.</h2><div><Link href="/knowledge">Enter the knowledge studio <ArrowRight /></Link><Link href="/games">Test your paper sense</Link></div></section>
  </div>;
}
