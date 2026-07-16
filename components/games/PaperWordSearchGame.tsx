"use client";

import { ArrowLeft, Check, Clock3, RotateCcw, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./PaperWordSearchGame.module.css";

type Placement={word:string;row:number;col:number;dr:number;dc:number};
const SIZE=12,LIMIT=300;
const placements:Placement[]=[
 {word:"PAPER",row:0,col:0,dr:0,dc:1},{word:"FIBRE",row:1,col:1,dr:1,dc:1},{word:"FOREST",row:0,col:11,dr:1,dc:0},{word:"MILL",row:3,col:5,dr:0,dc:1},{word:"PULP",row:4,col:0,dr:1,dc:0},{word:"CARTON",row:4,col:1,dr:1,dc:1},{word:"SHEET",row:8,col:6,dr:0,dc:1},{word:"TREE",row:5,col:9,dr:1,dc:0},{word:"WATER",row:10,col:7,dr:0,dc:1},{word:"RECYCLE",row:11,col:0,dr:0,dc:1},
];
const key=(r:number,c:number)=>`${r}-${c}`;
const wordCells=(p:Placement)=>Array.from({length:p.word.length},(_,i)=>key(p.row+p.dr*i,p.col+p.dc*i));

export default function PaperWordSearchGame(){
 const grid=useMemo(()=>{const filler="PAPERFIBRECYCLEFORESTMILLWATERTREESHEETCARTON";const letters=Array.from({length:SIZE*SIZE},(_,i)=>filler[(i*7+i%5)%filler.length]);placements.forEach(p=>p.word.split("").forEach((letter,i)=>{letters[(p.row+p.dr*i)*SIZE+p.col+p.dc*i]=letter}));return letters},[]);
 const[start,setStart]=useState<{row:number;col:number}|null>(null);const[found,setFound]=useState<string[]>([]);const[seconds,setSeconds]=useState(0);const[running,setRunning]=useState(false);const[message,setMessage]=useState("Tap the first letter, then the last.");const[best,setBest]=useState<number|null>(null);
 useEffect(()=>{const value=localStorage.getItem("paper-word-search-best");if(value)setBest(Number(value))},[]);
 useEffect(()=>{if(!running||found.length===placements.length)return;const timer=window.setInterval(()=>setSeconds(v=>{if(v>=LIMIT-1){setRunning(false);return LIMIT}return v+1}),1000);return()=>clearInterval(timer)},[running,found.length]);
 useEffect(()=>{if(found.length!==placements.length)return;setRunning(false);if(best===null||seconds<best){setBest(seconds);localStorage.setItem("paper-word-search-best",String(seconds))}},[found.length,seconds,best]);
 const selectedCells=new Set(found.flatMap(word=>wordCells(placements.find(p=>p.word===word)!)));
 function tap(row:number,col:number){if(seconds>=LIMIT||found.length===placements.length)return;if(!running)setRunning(true);if(!start){setStart({row,col});setMessage("Now tap the last letter.");return}const dr=Math.sign(row-start.row),dc=Math.sign(col-start.col),distance=Math.max(Math.abs(row-start.row),Math.abs(col-start.col));if(!((dr===0||dc===0||Math.abs(row-start.row)===Math.abs(col-start.col)))){setStart(null);setMessage("Words run straight or diagonally. Try again.");return}const cells=Array.from({length:distance+1},(_,i)=>key(start.row+dr*i,start.col+dc*i));const letters=cells.map(cell=>{const[r,c]=cell.split("-").map(Number);return grid[r*SIZE+c]}).join("");const reverse=letters.split("").reverse().join("");const match=placements.find(p=>(p.word===letters||p.word===reverse)&&!found.includes(p.word));if(match){setFound(v=>[...v,match.word]);setMessage(`${match.word} found — ${placements.length-found.length-1} to go.`)}else setMessage("Not one of the hidden words. Try another line.");setStart(null)}
 function reset(){setStart(null);setFound([]);setSeconds(0);setRunning(false);setMessage("Tap the first letter, then the last.")}
 const format=(v:number)=>`${String(Math.floor(v/60)).padStart(2,"0")}:${String(v%60).padStart(2,"0")}`;
 return <div className={styles.page}>
  <header className={styles.hero}><div><Link href="/games"><ArrowLeft/> Back to games</Link><p>Game 05 · Word hunt</p><h1>Fibre <em>Word Search.</em></h1><span>Ten paper words are hiding across, down and diagonally. Find every one before five minutes.</span></div><div className={styles.timer}><Clock3/><small>Elapsed time</small><strong>{format(seconds)}</strong><span>{best===null?"No personal best yet":`Best ${format(best)}`}</span></div></header>
  <main className={styles.game}><section className={styles.boardWrap}><div className={styles.board} aria-label="Paper word search grid">{grid.map((letter,index)=>{const row=Math.floor(index/SIZE),col=index%SIZE,cell=key(row,col);return <button onClick={()=>tap(row,col)} className={`${selectedCells.has(cell)?styles.found:""} ${start&&start.row===row&&start.col===col?styles.start:""}`} aria-label={`Letter ${letter}, row ${row+1}, column ${col+1}`} key={cell}>{letter}</button>})}</div><footer><p>{message}</p><button onClick={reset}><RotateCcw/> Restart</button></footer></section><aside className={styles.words}><header><span>Word transcript</span><small>{found.length} / 10</small></header>{placements.map(p=><div className={found.includes(p.word)?styles.done:""} key={p.word}><Check/><span>{p.word}</span></div>)}</aside></main>
  {seconds>=LIMIT&&found.length<10&&<div className={styles.result}><Clock3/><h2>Time&apos;s up.</h2><p>The words will stay in the same places. Reset and race your own search.</p><button onClick={reset}>Try again <RotateCcw/></button></div>}
  {found.length===10&&<div className={styles.result}><Sparkles/><p>All ten found</p><h2>{format(seconds)}</h2><strong><Trophy/> {best===seconds?"New personal best":"Word search complete"}</strong><button onClick={reset}>Race again <RotateCcw/></button></div>}
 </div>
}
