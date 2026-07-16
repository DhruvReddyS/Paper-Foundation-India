"use client";

import { ArrowRight, Factory, MapPinned, Recycle, Trees, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./IndiaLedger.module.css";

const points=[
 {label:"North",title:"Farm forestry networks",fact:"Growers and fibre buyers form part of the working landscape behind many paper grades.",metric:"SOURCE",icon:Trees},
 {label:"West",title:"Making and converting",fact:"Mills, converters and logistics connect fibre with packaging, print and everyday products.",metric:"MAKE",icon:Factory},
 {label:"East",title:"People across the chain",fact:"Paper connects forestry, collection, transport, mills, printers and thousands of downstream uses.",metric:"PEOPLE",icon:Users},
 {label:"South",title:"Collection and recovery",fact:"Cleaner separation helps recovered paper return to productive use with less fibre loss.",metric:"RETURN",icon:Recycle},
] as const;

export default function IndiaLedger(){const[active,setActive]=useState(0);const point=points[active];const Icon=point.icon;return <section className={styles.section} aria-labelledby="india-preview-title">
 <div className={styles.copy} data-reveal="left"><p>Paper across India</p><h2 id="india-preview-title">One country. <em>Many fibre stories.</em></h2><span>The map is not just geography. It is a field transcript of growers, mills, users, collectors and the decisions that connect them.</span><div className={styles.numbers}><div><strong>4</strong><small>demo field notes</small></div><div><strong>1</strong><small>connected fibre loop</small></div><div><strong>∞</strong><small>stories to uncover</small></div></div><div><Link href="/india-map">Open the Fibre Map <ArrowRight/></Link><Link href="/india-snapshot">See facts &amp; numbers <ArrowRight/></Link></div><aside><small>Map note 04</small><p>Tap any pin to read a short material field note.</p></aside></div>
 <div className={styles.atlas} data-reveal="right"><header><span><MapPinned/> India fibre atlas</span><small>Interactive preview</small></header><div className={styles.map}><Image src="/images/maps/india-state-outline.png" alt="State outline map of India" fill sizes="(max-width: 850px) 90vw, 620px"/>{points.map((item,index)=><button className={`${styles.pin} ${styles[`pin${index+1}`]} ${active===index?styles.active:""}`} onClick={()=>setActive(index)} aria-label={`Show ${item.label}`} aria-pressed={active===index} key={item.label}><span>{index+1}</span></button>)}</div><article key={point.label}><Icon/><div><small>{point.label} · {point.metric}</small><strong>{point.title}</strong><p>{point.fact}</p></div></article></div>
 </section>}
