"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import styles from "./JourneyPreview.module.css";

export default function JourneyPreview(){
 const stage=useRef<HTMLDivElement>(null);
 function move(event:PointerEvent<HTMLDivElement>){const rect=event.currentTarget.getBoundingClientRect();stage.current?.style.setProperty("--book-x",`${((event.clientX-rect.left)/rect.width-.5)*18}deg`);stage.current?.style.setProperty("--book-y",`${((event.clientY-rect.top)/rect.height-.5)*-10}deg`)}
 return <section className={styles.section} aria-labelledby="journey-home-title">
  <div className={styles.copy} data-reveal="left"><p>Paper Journey</p><h2 id="journey-home-title">How is paper really made? <em>Take the full tour.</em></h2><span>Open a thick field book and follow fibre from source to sheet, use and return. Each chapter explains one decision—and why the whole truth needs the whole journey.</span><Link href="/journey">Open the interactive book <BookOpen/><ArrowRight/></Link></div>
  <div ref={stage} className={styles.bookStage} data-reveal="right" onPointerMove={move} onPointerLeave={()=>{stage.current?.style.setProperty("--book-x","0deg");stage.current?.style.setProperty("--book-y","0deg")}}>
    <Link href="/journey" className={styles.book} aria-label="Open the Paper Journey">
      <div className={styles.cover}><Image src="/images/journey/spreads/cover.jpg" alt="Paper Journey book cover in a forest" fill sizes="(max-width: 768px) 78vw, 470px"/><div className={styles.coverShade}/><div className={styles.coverCopy}><small>Paper Foundation India</small><strong>The Paper Journey</strong><span>Source · Make · Use · Return</span></div><i/><b/></div>
      <div className={styles.pages}><i/><i/><i/><i/><i/></div><div className={styles.spine}/><div className={styles.bookShadow}/><span className={styles.bookmark}/>
    </Link>
    <div className={styles.bookNote}><BookOpen/><small>A field book with weight</small><strong>Move across the cover.</strong><p>The binding responds before the story opens.</p></div>
  </div>
 </section>;
}
