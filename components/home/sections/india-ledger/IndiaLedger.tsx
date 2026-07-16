"use client";

import { ArrowRight, Factory, MapPinned, Recycle, Trees, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import styles from "./IndiaLedger.module.css";

const points=[
 {label:"North",title:"Farm forestry networks",fact:"Growers and fibre buyers form part of the working landscape behind many paper grades.",metric:"SOURCE",icon:Trees},
 {label:"West",title:"Making and converting",fact:"Mills, converters and logistics connect fibre with packaging, print and everyday products.",metric:"MAKE",icon:Factory},
 {label:"East",title:"People across the chain",fact:"Paper connects forestry, collection, transport, mills, printers and thousands of downstream uses.",metric:"PEOPLE",icon:Users},
 {label:"South",title:"Collection and recovery",fact:"Cleaner separation helps recovered paper return to productive use with less fibre loss.",metric:"RETURN",icon:Recycle},
] as const;

const regionalActivity=[
 {label:"West",value:33},
 {label:"South",value:26},
 {label:"North",value:23},
 {label:"East",value:12},
 {label:"Central",value:7},
] as const;

export default function IndiaLedger(){const[active,setActive]=useState(0);const point=points[active];const Icon=point.icon;return <section className={styles.section} aria-labelledby="india-preview-title">
 <div className={styles.copy} data-reveal="left"><p>Paper across India</p><h2 id="india-preview-title">One country. <em>Many fibre stories.</em></h2><span>The map is not just geography. It is a field transcript of growers, mills, users, collectors and the decisions that connect them.</span><div className={styles.numbers}><div><strong>75%</strong><small>recycled fibre share</small></div><div><strong>16 kg</strong><small>paper use per person</small></div><div><strong>860+</strong><small>mills nationwide</small></div></div><div><Link href="/india-map">Open the Fibre Map <ArrowRight/></Link><Link href="/india-snapshot">See facts &amp; numbers <ArrowRight/></Link></div><aside><small>Map note 04</small><p>Tap a highlighted region to read its material field note.</p></aside></div>
 <div className={styles.atlas} data-reveal="right"><header><span><MapPinned/> India fibre atlas</span><small><i/> Higher paper activity</small></header><div className={styles.map}><Image src="/images/maps/india-state-outline.png" alt="State outline map of India with highlighted paper activity regions" fill sizes="(max-width: 850px) 90vw, 620px"/><div className={styles.heatLayer}>{points.map((item,index)=><button className={`${styles[`heat${item.label}`]} ${active===index?styles.heatActive:""}`} onClick={()=>setActive(index)} aria-label={`Show ${item.label} field note`} aria-pressed={active===index} key={item.label}><span>{item.label}</span></button>)}</div></div><article key={point.label}><Icon/><div><small>{point.label} · {point.metric}</small><strong>{point.title}</strong><p>{point.fact}</p></div></article></div>
 <div className={styles.insights} data-reveal>
  <article className={styles.recoveryChart}><header><Recycle/><span>Fibre recovery</span><small>Production mix</small></header><div><figure><strong>75<sup>%</sup></strong></figure><p>of India&apos;s paper production uses recycled fibre—one of the strongest circular inputs in the material mix.</p></div></article>
  <article className={styles.useChart}><header><Users/><span>Paper use</span><small>Per person / year</small></header><div><strong>16 <small>kg</small></strong><div className={styles.useLine}><i/><b>India</b><span>Global reference</span></div><p>A compact per-capita footprint with room for essential education, hygiene and packaging needs.</p></div></article>
  <article className={styles.regionChart}><header><Factory/><span>Regional mill activity</span><small>Illustrative share</small></header><div className={styles.bars}>{regionalActivity.map(item=><div key={item.label}><i style={{"--bar":`${item.value*3.8}px`} as CSSProperties}/><strong>{item.value}%</strong><span>{item.label}</span></div>)}</div></article>
  <p className={styles.sourceNote}>Preview figures mirror the current India Snapshot content. Use the full data pages for methodology and source notes.</p>
 </div>
 </section>}
