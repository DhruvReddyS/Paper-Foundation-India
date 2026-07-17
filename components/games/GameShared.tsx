"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, ExternalLink, Layers3, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function GameFrame({
  title,
  kicker,
  progress,
  immersive = false,
  children,
}: {
  title: string;
  kicker: string;
  progress?: number;
  immersive?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!immersive) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [immersive]);

  return (
    <div className={`game-page min-h-screen ${immersive ? "game-page-immersive" : "pb-24 pt-8"}`}>
      <div className="game-shell">
        <div className="game-session-header">
          <Link href="/games" className="game-back-link">
            <ArrowLeft size={16} /> Game hub
          </Link>
          <div className="game-session-title">
            <p className="game-kicker">{kicker}</p>
            <p className="font-serif text-xl font-bold text-charcoal">{title}</p>
          </div>
          <div className="game-session-live"><i /><span>Playable edition<br /><b>Session ready</b></span></div>
        </div>
        {typeof progress === "number" && (
          <div className="game-progress" aria-label={`${Math.round(progress)}% complete`}>
            <motion.span animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 90 }} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function GameIntro({
  eyebrow,
  title,
  description,
  rules,
  accent = "forest",
  onStart,
}: {
  eyebrow: string;
  title: string;
  description: string;
  rules: string[];
  accent?: "forest" | "copper" | "ink" | "sage";
  onStart: () => void;
}) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={`game-intro game-accent-${accent}`}>
      <div className="game-intro-copy">
        <div className="game-intro-seal"><Sparkles /><span>PFI<br />PLAY</span></div>
        <p className="game-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <button className="game-primary-button" onClick={onStart}>Start playing <span>→</span></button>
      </div>
      <div className="game-rules-card">
        <header><div><Layers3 /><p className="game-kicker">How to play</p></div><span>01—03</span></header>
        <ol>
          {rules.map((rule, index) => <li key={rule}><span>{index + 1}</span>{rule}</li>)}
        </ol>
        <p className="game-access-note">No login · Touch, mouse and keyboard · Branded result card included</p>
      </div>
      <div className="game-intro-folio"><span>PLAY</span><span>LEARN</span><span>PROVE</span></div>
    </motion.section>
  );
}

export function ResultPanel({
  game,
  score,
  outOf,
  badge,
  message,
  children,
  onReplay,
}: {
  game: string;
  score: number;
  outOf: number;
  badge: string;
  message: string;
  children?: React.ReactNode;
  onReplay: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareText = `Paper can surprise you. I scored ${score}/${outOf} in ${game} and earned “${badge}” at Paper Foundation India. Can you beat my Paper IQ?`;

  const shareUrl = typeof window === "undefined" ? "" : window.location.href;

  async function nativeShare() {
    if (sharing) return;
    setSharing(true);
    try {
      const canvas = buildScoreCanvas();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      const file = blob ? new File([blob], `${game.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-score.png`, { type: "image/png" }) : null;
      if (navigator.share && file && navigator.canShare?.({ files: [file] })) await navigator.share({ title: `${game} result`, text: shareText, url: shareUrl, files: [file] });
      else if (navigator.share) await navigator.share({ title: game, text: shareText, url: shareUrl });
      else await copyResult();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) await copyResult();
    } finally {
      setSharing(false);
    }
  }

  async function copyResult() {
    if (navigator.clipboard) await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function buildScoreCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.fillStyle = "#f2ede7";
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "#244d32"; ctx.fillRect(54, 54, 972, 972);
    ctx.strokeStyle = "rgba(250,248,245,.18)"; ctx.lineWidth = 2; ctx.strokeRect(78, 78, 924, 924);
    for (let y = 100; y < 1000; y += 26) { ctx.strokeStyle = "rgba(255,255,255,.018)"; ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(1000, y + 5); ctx.stroke(); }
    ctx.fillStyle = "#c4956a"; ctx.beginPath(); ctx.moveTo(130, 126); ctx.quadraticCurveTo(185, 82, 210, 142); ctx.quadraticCurveTo(165, 194, 130, 126); ctx.fill();
    ctx.fillStyle = "#faf8f5";
    ctx.font = "700 68px Georgia"; ctx.fillText(game, 130, 245, 820);
    ctx.fillStyle = "#c4956a";
    ctx.font = "500 30px Arial";
    ctx.fillText("PAPER FOUNDATION INDIA · THE PLAYABLE EDITION", 130, 312);
    ctx.fillStyle = "#faf8f5";
    ctx.font = "700 220px Georgia";
    ctx.fillText(String(score), 130, 615);
    ctx.font = "500 52px Arial";
    ctx.fillText(`/ ${outOf}`, 475, 605);
    ctx.fillStyle = "#e8ddd0";
    ctx.font = "700 52px Georgia";
    ctx.fillText(badge, 130, 745, 820);
    ctx.font = "400 32px Arial";
    wrapCanvasText(ctx, message, 130, 815, 800, 43);
    ctx.strokeStyle = "rgba(250,248,245,.25)"; ctx.beginPath(); ctx.moveTo(130, 930); ctx.lineTo(950, 930); ctx.stroke();
    ctx.fillStyle = "#c4956a"; ctx.font = "500 24px Arial"; ctx.fillText("PLAY · LEARN · SHARE THE CONTEXT", 130, 972);
    ctx.fillStyle = "#faf8f5"; ctx.textAlign = "right"; ctx.fillText(new URL(shareUrl || window.location.href).host, 950, 972); ctx.textAlign = "left";
    return canvas;
  }

  function downloadCard() {
    const canvas = buildScoreCanvas();
    const link = document.createElement("a");
    link.download = `${game.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-result.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const whatsApp = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const xShare = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <motion.section initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="game-result-panel">
      <div className="game-result-card-preview">
        <div className="game-result-edition"><span>THE PLAYABLE EDITION</span><small>PAPER FOUNDATION INDIA</small></div>
        <div className="game-result-stamp">{badge}</div>
        <p className="game-kicker">Your Paper IQ result</p>
        <h1>{score}<span> / {outOf}</span></h1>
        <h2>{game}</h2>
        <p className="game-result-message">{message}</p>
        <footer><span>PLAY · LEARN · SHARE THE CONTEXT</span><b>paperfoundation.in</b></footer>
      </div>
      {children}
      <div className="game-share-row">
        <button onClick={nativeShare} disabled={sharing}><Share2 size={16} /> {sharing ? "Preparing…" : "Share scorecard"}</button>
        <a href={linkedIn} target="_blank" rel="noreferrer">in LinkedIn <ExternalLink size={14} /></a>
        <a href={xShare} target="_blank" rel="noreferrer">X <ExternalLink size={14} /></a>
        <a href={facebook} target="_blank" rel="noreferrer">Facebook <ExternalLink size={14} /></a>
        <a href={whatsApp} target="_blank" rel="noreferrer">WhatsApp <ExternalLink size={14} /></a>
        <button onClick={copyResult}><Copy size={16} /> {copied ? "Copied" : "Copy"}</button>
        <button onClick={downloadCard}><Download size={16} /> Download PNG</button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={onReplay} className="game-primary-button">Play again</button>
        <Link href="/games" className="game-secondary-button">Explore more games</Link>
      </div>
    </motion.section>
  );
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else line = test;
  }
  ctx.fillText(line, x, y);
}
