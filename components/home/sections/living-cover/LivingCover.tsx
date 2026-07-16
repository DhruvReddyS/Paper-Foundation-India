"use client";

import { ArrowDown, ArrowRight, BookOpen, Factory, Recycle, Trees, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import styles from "./LivingCover.module.css";

type Life={number:string;label:string;title:string;note:string;icon:LucideIcon};
const lives:Life[]=[
 {number:"01",label:"Grown",title:"A fibre begins",note:"in a working landscape shaped by people and choices",icon:Trees},
 {number:"02",label:"Made",title:"A sheet takes form",note:"through fibre, water, engineering and careful recovery",icon:Factory},
 {number:"03",label:"Used",title:"An idea travels",note:"as paper teaches, protects, records and connects",icon:BookOpen},
 {number:"04",label:"Returned",title:"Another life opens",note:"when clean recovered fibre comes back into the loop",icon:Recycle},
];

export default function LivingCover(){
 const[active,setActive]=useState(0);const sectionRef=useRef<HTMLElement>(null);const life=lives[active];const Icon=life.icon;
 function move(event:PointerEvent<HTMLElement>){const r=event.currentTarget.getBoundingClientRect();sectionRef.current?.style.setProperty("--mx",`${((event.clientX-r.left)/r.width-.5)*22}px`);sectionRef.current?.style.setProperty("--my",`${((event.clientY-r.top)/r.height-.5)*16}px`)}
 return <section ref={sectionRef} className={styles.hero} onPointerMove={move} aria-labelledby="hero-title">
  <div className={styles.grain} aria-hidden="true"/>
  <div className={styles.copy}>
   <p className={styles.kicker}><span/> A living material archive</p>
   <h1 id="hero-title">Paper has more than <em>one life.</em></h1>
   <p className={styles.deck}>A sheet is not a finish line. It can begin in a working landscape, carry an idea, protect what matters and return as fibre for something new.</p>
   <div className={styles.actions}><a href="#understand-fairly">Unfold the story <ArrowDown/></a><Link href="/journey">Enter the paper journey <ArrowRight/></Link></div>
   <div className={styles.transcript}><small>Field transcript · 01</small><p>“Follow the fibre, not the assumption.”</p><i/></div>
  </div>
  <div className={styles.theatre} aria-label={`Current life: ${life.label}`}>
   <div className={styles.tree} aria-hidden="true"><i/><i/><i/><i/><i/></div>
   <div className={styles.newspaper} aria-hidden="true"><small>The Material Daily</small><strong>ONE SHEET.<br/>MANY CHAPTERS.</strong><span/><span/><span/></div>
   <div className={styles.envelope} aria-hidden="true"><i/><small>RETURN TO FIBRE</small></div>
   <article className={styles.lifeSheet} key={life.label}>
    <header><span>Life {life.number}</span><small>{life.label}</small></header><Icon/>
    <div><strong>{life.title}</strong><p>{life.note}</p></div><b aria-hidden="true"/>
   </article>
   <div className={styles.thread} aria-hidden="true"><i/><i/><i/></div>
  </div>
  <nav className={styles.rail} aria-label="Explore the lives of one sheet">{lives.map((item,index)=><button className={active===index?styles.active:""} onClick={()=>setActive(index)} aria-pressed={active===index} key={item.label}><span>{item.number}</span><strong>{item.label}</strong><i/></button>)}</nav>
 </section>
}
