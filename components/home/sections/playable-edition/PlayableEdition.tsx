"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { playableGames } from "./games";
import styles from "./PlayableEdition.module.css";

export default function PlayableEdition(){
 const rail=useRef<HTMLDivElement>(null);
 const drag=useRef({pointerId:-1,startX:0,startScroll:0,moved:false});
 const [dragging,setDragging]=useState(false);
 const move=(direction:number)=>rail.current?.scrollBy({left:direction*360,behavior:"smooth"});
 const beginDrag=(event:PointerEvent<HTMLDivElement>)=>{
  if(event.pointerType==="mouse"&&event.button!==0)return;
  const target=rail.current;if(!target)return;
  drag.current={pointerId:event.pointerId,startX:event.clientX,startScroll:target.scrollLeft,moved:false};
  target.setPointerCapture(event.pointerId);
  setDragging(true);
 };
 const updateDrag=(event:PointerEvent<HTMLDivElement>)=>{
  if(!dragging||event.pointerId!==drag.current.pointerId||!rail.current)return;
  const distance=event.clientX-drag.current.startX;
  if(Math.abs(distance)>5)drag.current.moved=true;
  rail.current.scrollLeft=drag.current.startScroll-distance;
 };
 const endDrag=(event:PointerEvent<HTMLDivElement>)=>{
  if(event.pointerId!==drag.current.pointerId)return;
  if(rail.current?.hasPointerCapture(event.pointerId))rail.current.releasePointerCapture(event.pointerId);
  setDragging(false);
 };
 return <section id="playable-edition" className={styles.section} aria-labelledby="playable-edition-title">
  <div className={styles.heading} data-reveal><div><p className={styles.kicker}>The playable edition</p><h2 id="playable-edition-title">Test your <em>paper instincts.</em></h2></div><div className={styles.introduction}><p>Five short, replayable games built for curious people of every age. Swipe the edition, choose a cover and learn by doing.</p><Link href="/games">View the games hub <ArrowRight/></Link></div></div>
  <div className={styles.carouselHead} data-reveal><span>Five games · Choose a challenge</span><div><button onClick={()=>move(-1)} aria-label="Previous games"><ArrowLeft/></button><button onClick={()=>move(1)} aria-label="Next games"><ArrowRight/></button></div></div>
  <div
   ref={rail}
   className={`${styles.gameGrid} ${dragging?styles.dragging:""}`}
   data-reveal="right"
   data-paper-cursor
   data-cursor-label={dragging?"DRAGGING":"DRAG"}
   onPointerDown={beginDrag}
   onPointerMove={updateDrag}
   onPointerUp={endDrag}
   onPointerCancel={endDrag}
   onClickCapture={(event)=>{if(drag.current.moved){event.preventDefault();event.stopPropagation();drag.current.moved=false;}}}
  >{playableGames.map((game,index)=>{const Icon=game.icon;return <Link draggable={false} data-cursor-label="DRAG / PLAY" href={game.href} className={`${styles.ticket} ${styles[`ticket${index+1}`]}`} key={game.title}><header><span>Game {game.number}</span><small>{game.format}</small></header><div className={styles.visual}><Icon/><i/><i/></div><div className={styles.body}><h3>{game.title}</h3><p>{game.note}</p></div><footer><span>{game.interaction}</span><b>Play <ArrowRight/></b></footer></Link>})}</div>
 </section>
}
