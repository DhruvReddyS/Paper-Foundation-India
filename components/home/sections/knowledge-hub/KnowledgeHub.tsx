"use client";

import { ArrowRight, BookMarked, Clock, Factory, Library, Recycle, Trees, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./KnowledgeHub.module.css";

type Feature = { type:string; time:string; category:string; title:string; deck:string; href:string; icon:LucideIcon; tone:string };
const features:Feature[]=[
  {type:"Cover essay",time:"8 min",category:"Forestry",title:"How fibre sourcing shapes the paper story",deck:"Read past the material label and follow the decisions that create the outcome.",href:"/knowledge/truth-about-paper-forestry",icon:Trees,tone:"forest"},
  {type:"Visual method",time:"6 min",category:"Recovery",title:"What a recovery rate does not tell you",deck:"Collection, contamination, yield and final use all sit behind one headline number.",href:"/knowledge/recycling-rates-compared",icon:Recycle,tone:"copper"},
  {type:"Mill note",time:"7 min",category:"Production",title:"Inside the decisions that form a sheet",deck:"Water removal, fibre preparation and energy choices change performance at the mill.",href:"/knowledge/water-usage-modern-mills",icon:Factory,tone:"sage"},
];
const articles=[
  ["01","Method","What life-cycle studies answer—and what they do not","9 min","/knowledge/paper-vs-plastic-lifecycle"],
  ["02","People","The hands and livelihoods inside India’s fibre loop","10 min","/knowledge/rural-livelihoods-paper"],
  ["03","Innovation","Designing paper products for another useful life","5 min","/knowledge/innovation-in-indian-mills"],
];

export default function KnowledgeHub(){
  const[active,setActive]=useState(0);const feature=features[active];const Icon=feature.icon;
  return <section className={styles.section} aria-labelledby="knowledge-home-title">
    <header className={styles.heading} data-reveal><div><p>Knowledge Hub</p><h2 id="knowledge-home-title">Read beyond the headline. <em>Know the whole sheet.</em></h2></div><p>Featured investigations, concise explainers, an open glossary and practical source material—all organised for curious readers.</p></header>
    <div className={styles.library} data-reveal="left">
      <div className={`${styles.feature} ${styles[feature.tone]}`} key={feature.title}>
        <header><span>{feature.type} · {feature.category}</span><small><Clock/>{feature.time}</small></header>
        <div className={styles.featureArt}><Icon/><i/><i/></div>
        <div className={styles.featureCopy}><p>Featured reading</p><h3>{feature.title}</h3><span>{feature.deck}</span><Link href={feature.href}>Read the feature <ArrowRight/></Link></div>
      </div>
      <aside className={styles.featureIndex}>{features.map((item,index)=><button className={index===active?styles.active:""} onClick={()=>setActive(index)} key={item.title}><span>0{index+1}</span><div><small>{item.category}</small><strong>{item.title}</strong></div><i/></button>)}</aside>
    </div>
    <div className={styles.lowerDesk} data-reveal="right">
      <div className={styles.articleLedger}><header><span>Latest articles</span><Link href="/knowledge">View all articles <ArrowRight/></Link></header>{articles.map(([no,type,title,time,href])=><Link href={href} key={no}><span>{no}</span><small>{type}</small><strong>{title}</strong><em>{time}</em><ArrowRight/></Link>)}</div>
      <div className={styles.tools}>
        <Link href="/glossary"><BookMarked/><small>Paper dictionary</small><strong>Glossary</strong><p>Clear definitions without unnecessary jargon.</p><span>Browse terms <ArrowRight/></span></Link>
        <Link href="/resources"><Library/><small>Open shelf</small><strong>Resources</strong><p>Reports, guides and source documents in one place.</p><span>Open resources <ArrowRight/></span></Link>
      </div>
    </div>
  </section>;
}
