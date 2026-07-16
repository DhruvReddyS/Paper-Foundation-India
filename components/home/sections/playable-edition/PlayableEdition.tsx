"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { playableGames } from "./games";
import styles from "./PlayableEdition.module.css";

export default function PlayableEdition(){
 const rail=useRef<HTMLDivElement>(null);const move=(direction:number)=>rail.current?.scrollBy({left:direction*360,behavior:"smooth"});
 return <section id="playable-edition" className={styles.section} aria-labelledby="playable-edition-title">
  <div className={styles.heading} data-reveal><div><p className={styles.kicker}>The playable edition</p><h2 id="playable-edition-title">Learn with your <em>hands on the idea.</em></h2></div><div className={styles.introduction}><p>Five short, replayable games built for curious people of every age. Swipe the edition, choose a cover and learn by doing.</p><Link href="/games">View the games hub <ArrowRight/></Link></div></div>
  <div className={styles.carouselHead} data-reveal><span>Issue 01 · Five playable covers</span><div><button onClick={()=>move(-1)} aria-label="Previous games"><ArrowLeft/></button><button onClick={()=>move(1)} aria-label="Next games"><ArrowRight/></button></div></div>
  <div ref={rail} className={styles.gameGrid} data-reveal="right">{playableGames.map((game,index)=>{const Icon=game.icon;return <Link href={game.href} className={`${styles.ticket} ${styles[`ticket${index+1}`]}`} key={game.title}><header><span>Game {game.number}</span><small>{game.format}</small></header><div className={styles.visual}><Icon/><i/><i/></div><div className={styles.body}><h3>{game.title}</h3><p>{game.note}</p></div><footer><span>{game.interaction}</span><b>Play <ArrowRight/></b></footer></Link>})}</div>
 </section>
}
