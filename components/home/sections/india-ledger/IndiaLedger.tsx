"use client";

import { ArrowRight, Factory, MapPinned, Recycle, Trees } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./IndiaLedger.module.css";

const points=[
 {label:"North",title:"Farm forestry networks",fact:"Growers and fibre buyers form part of the working landscape behind many paper grades.",metric:"SOURCE",icon:Trees},
 {label:"West",title:"Manufacturing corridors",fact:"Mills, converters and logistics connect fibre with packaging, print and everyday products.",metric:"MAKE",icon:Factory},
 {label:"South",title:"Collection and recovery",fact:"Cleaner separation helps recovered paper return to productive use with less fibre loss.",metric:"RETURN",icon:Recycle},
] as const;

export default function IndiaLedger(){const[active,setActive]=useState(0);const point=points[active];const Icon=point.icon;return <section className={styles.section} aria-labelledby="india-preview-title">
 <div className={styles.copy}><p>India by paper</p><h2 id="india-preview-title">One country.<br/><em>Many fibre stories.</em></h2><span>A compact preview of the people, places and material flows behind paper in India. Select a pin for a demo field note.</span><div className={styles.numbers}><div><strong>3</strong><small>demo regions</small></div><div><strong>4</strong><small>material lenses</small></div><div><strong>1</strong><small>connected loop</small></div></div><div><Link href="/india-map">Open the Fibre Map <ArrowRight/></Link><Link href="/india-snapshot">See facts &amp; numbers <ArrowRight/></Link></div></div>
 <div className={styles.mapCard}>
  <header><span><MapPinned/> India field preview</span><small>Tap a pin</small></header>
  <div className={styles.map}><span aria-hidden="true">INDIA</span><i className={styles.outline} aria-hidden="true"/>{points.map((item,index)=><button className={`${styles.pin} ${styles[`pin${index+1}`]} ${active===index?styles.active:""}`} onClick={()=>setActive(index)} aria-label={`Show ${item.label}`} aria-pressed={active===index} key={item.label}>{index+1}</button>)}</div>
  <article key={point.label}><Icon/><small>{point.label} · {point.metric}</small><strong>{point.title}</strong><p>{point.fact}</p></article>
 </div>
 </section>}
