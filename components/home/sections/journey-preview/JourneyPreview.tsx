"use client";

import { ArrowRight, BookOpen, Factory, Leaf, PackageOpen, Recycle, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./JourneyPreview.module.css";

const chapters=[
  {label:"Source",title:"Where fibre begins",copy:"Responsible sources and recovered paper enter the story.",icon:Trees},
  {label:"Pulp",title:"Fibres are prepared",copy:"Water and motion separate, clean and ready the fibre.",icon:Leaf},
  {label:"Sheet",title:"A moving web forms",copy:"Drainage, pressing and drying turn flow into paper.",icon:Factory},
  {label:"Purpose",title:"Design gives it a job",copy:"The sheet becomes a product made for a particular need.",icon:PackageOpen},
  {label:"Return",title:"Useful fibre comes back",copy:"Collection and sorting decide whether another life begins.",icon:Recycle},
] as const;

export default function JourneyPreview(){
 const[active,setActive]=useState(0);const chapter=chapters[active];const Icon=chapter.icon;
 return <section className={styles.section} aria-labelledby="journey-home-title">
  <div className={styles.copy}><p>Paper Journey</p><h2 id="journey-home-title">How is paper really made?<br/><em>Take the tour before you take a side.</em></h2><span>Open a thick field book and follow fibre from source to sheet, use and return. Each chapter explains one decision—and why the whole truth needs the whole journey.</span><Link href="/journey">Open the interactive book <BookOpen/><ArrowRight/></Link></div>
  <div className={styles.bookStage}>
    <Link href="/journey" className={styles.book} aria-label="Open the Paper Journey">
      <div className={styles.cover}><Image src="/images/journey/spreads/cover.jpg" alt="Paper Journey book cover in a forest" fill sizes="(max-width: 768px) 78vw, 470px"/><div className={styles.coverShade}/><div className={styles.coverCopy}><small>Paper Foundation India</small><strong>The Paper<br/>Journey</strong><span>Source · Make · Use · Return</span></div><i/><b/></div>
      <div className={styles.pages}/><div className={styles.spine}/><div className={styles.bookShadow}/>
    </Link>
    <div className={styles.bookNote} key={chapter.label}><Icon/><small>{chapter.label}</small><strong>{chapter.title}</strong><p>{chapter.copy}</p></div>
  </div>
  <nav aria-label="Preview Paper Journey chapters">{chapters.map((item,index)=><button className={active===index?styles.active:""} onClick={()=>setActive(index)} key={item.label}><span>0{index+1}</span><strong>{item.label}</strong><i/></button>)}</nav>
 </section>;
}
