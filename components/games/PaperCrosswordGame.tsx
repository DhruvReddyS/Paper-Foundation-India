"use client";

import { ArrowLeft, Check, Clock3, RotateCcw, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./PaperCrosswordGame.module.css";

type Direction="across"|"down";
type Word={answer:string;clue:string;row:number;col:number;direction:Direction;number:number};

const words:Word[]=[
 {number:1,answer:"SHEET",clue:"A continuous web becomes this after pressing and drying",row:1,col:12,direction:"down"},
 {number:2,answer:"MILL",clue:"The place where pulp is formed into paper",row:2,col:5,direction:"down"},
 {number:3,answer:"PAPER",clue:"The material at the centre of this foundation",row:3,col:3,direction:"down"},
 {number:4,answer:"FOREST",clue:"A responsibly managed source landscape for fresh fibre",row:3,col:8,direction:"down"},
 {number:4,answer:"FIBRE",clue:"The tiny structural thread that forms a sheet",row:3,col:8,direction:"across"},
 {number:5,answer:"TREE",clue:"One possible renewable source of cellulose",row:5,col:2,direction:"down"},
 {number:6,answer:"PULP",clue:"A water-based suspension of separated fibres",row:5,col:3,direction:"across"},
 {number:7,answer:"RECYCLE",clue:"To collect and process used material for another life",row:6,col:2,direction:"across"},
 {number:8,answer:"CARTON",clue:"A paperboard package often used for protection",row:6,col:6,direction:"down"},
 {number:9,answer:"WATER",clue:"The medium that carries fibre through papermaking",row:9,col:4,direction:"across"},
];

const ROWS=12,COLS=13,LIMIT=300;
const key=(row:number,col:number)=>`${row}-${col}`;

export default function PaperCrosswordGame(){
 const grid=useMemo(()=>{const cells=new Map<string,{letter:string;number?:number}>();for(const word of words){for(let i=0;i<word.answer.length;i++){const row=word.row+(word.direction==="down"?i:0);const col=word.col+(word.direction==="across"?i:0);const cellKey=key(row,col);const existing=cells.get(cellKey);cells.set(cellKey,{letter:word.answer[i],number:i===0?word.number:existing?.number});}}return cells;},[]);
 const[values,setValues]=useState<Record<string,string>>({});const[seconds,setSeconds]=useState(0);const[running,setRunning]=useState(false);const[solved,setSolved]=useState(false);const[wrong,setWrong]=useState<Set<string>>(new Set());const[best,setBest]=useState<number|null>(null);
 useEffect(()=>{const stored=window.localStorage.getItem("paper-crossword-best");if(stored)setBest(Number(stored));},[]);
 useEffect(()=>{if(!running||solved)return;const timer=window.setInterval(()=>setSeconds(value=>{if(value>=LIMIT-1){setRunning(false);return LIMIT;}return value+1;}),1000);return()=>window.clearInterval(timer);},[running,solved]);
 function format(value:number){return `${String(Math.floor(value/60)).padStart(2,"0")}:${String(value%60).padStart(2,"0")}`;}
 function enter(cellKey:string,value:string){if(solved||seconds>=LIMIT)return;const letter=value.toUpperCase().replace(/[^A-Z]/g,"").slice(-1);if(!running)setRunning(true);setValues(current=>({...current,[cellKey]:letter}));setWrong(current=>{const next=new Set(current);next.delete(cellKey);return next;});}
 function checkGrid(){const misses=new Set<string>();for(const[cellKey,cell]of grid){if(values[cellKey]!==cell.letter)misses.add(cellKey);}setWrong(misses);if(misses.size===0){setSolved(true);setRunning(false);if(best===null||seconds<best){setBest(seconds);window.localStorage.setItem("paper-crossword-best",String(seconds));}}}
 function reset(){setValues({});setSeconds(0);setRunning(false);setSolved(false);setWrong(new Set());}
 const filled=Array.from(grid.keys()).filter(cellKey=>values[cellKey]).length;
 return <div className={styles.page}>
  <header className={styles.hero}><div><Link href="/games"><ArrowLeft/> Back to games</Link><p>Game 05 · Speed grid</p><h1>Fibre<br/><em>Crossword.</em></h1><span>Ten paper words. Five minutes. The faster you connect the clues, the stronger your final score.</span></div><div className={styles.timer}><Clock3/><small>Elapsed time</small><strong>{format(seconds)}</strong><span>{best===null?"No personal best yet":`Best ${format(best)}`}</span></div></header>
  <main className={styles.game}>
   <section className={styles.boardWrap} aria-label="Paper crossword grid">
    <div className={styles.board} style={{gridTemplateColumns:`repeat(${COLS},1fr)`}}>{Array.from({length:ROWS*COLS}).map((_,index)=>{const row=Math.floor(index/COLS),col=index%COLS,cellKey=key(row,col),cell=grid.get(cellKey);if(!cell)return <i className={styles.blank} key={cellKey}/>;return <label className={`${styles.cell} ${wrong.has(cellKey)?styles.wrong:""}`} key={cellKey}>{cell.number&&<span>{cell.number}</span>}<input aria-label={`Crossword cell row ${row+1}, column ${col+1}`} value={values[cellKey]||""} onChange={event=>enter(cellKey,event.target.value)} maxLength={1} inputMode="text" autoCapitalize="characters"/></label>;})}</div>
    <div className={styles.boardFooter}><span>{filled} / {grid.size} letters</span><div><button onClick={reset}><RotateCcw/> Restart</button><button onClick={checkGrid}><Check/> Check grid</button></div></div>
   </section>
   <aside className={styles.clues}><header><span>Clue ledger</span><small>10 words</small></header><div><section><h2>Across</h2>{words.filter(word=>word.direction==="across").map(word=><p key={word.number}><b>{word.number}</b><span>{word.clue}</span></p>)}</section><section><h2>Down</h2>{words.filter(word=>word.direction==="down").map(word=><p key={word.number}><b>{word.number}</b><span>{word.clue}</span></p>)}</section></div></aside>
  </main>
  {seconds>=LIMIT&&!solved&&<div className={styles.result}><Clock3/><h2>Time&apos;s up.</h2><p>The fibre grid is still here. Reset and race your own time.</p><button onClick={reset}>Try again <RotateCcw/></button></div>}
  {solved&&<div className={styles.result}><Sparkles/><p>Grid complete</p><h2>{format(seconds)}</h2><strong><Trophy/> {best===seconds?"New personal best":"Crossword solved"}</strong><button onClick={reset}>Race again <RotateCcw/></button></div>}
 </div>;
}
