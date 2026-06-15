"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";

export function GameFrame({
  title,
  kicker,
  progress,
  children,
}: {
  title: string;
  kicker: string;
  progress?: number;
  children: React.ReactNode;
}) {
  return (
    <main className="game-page min-h-screen pb-24 pt-8">
      <div className="game-shell">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/discover" className="game-back-link">
            <ArrowLeft size={16} /> Game hub
          </Link>
          <div className="text-right">
            <p className="game-kicker">{kicker}</p>
            <p className="font-serif text-xl font-bold text-charcoal">{title}</p>
          </div>
        </div>
        {typeof progress === "number" && (
          <div className="game-progress" aria-label={`${Math.round(progress)}% complete`}>
            <motion.span animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 90 }} />
          </div>
        )}
        {children}
      </div>
    </main>
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
        <p className="game-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <button className="game-primary-button" onClick={onStart}>Start playing <span>→</span></button>
      </div>
      <div className="game-rules-card">
        <p className="game-kicker">How to play</p>
        <ol>
          {rules.map((rule, index) => <li key={rule}><span>{index + 1}</span>{rule}</li>)}
        </ol>
        <p className="game-access-note">No login. No gaming experience needed. Works with touch, mouse and keyboard.</p>
      </div>
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
  const shareText = `I scored ${score}/${outOf} in ${game} and earned “${badge}”. Can you beat my Paper IQ?`;

  const shareUrl = typeof window === "undefined" ? "" : window.location.href;

  async function nativeShare() {
    if (navigator.share) await navigator.share({ title: game, text: shareText, url: shareUrl });
    else await copyResult();
  }

  async function copyResult() {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadCard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f2ede7";
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "#244d32";
    ctx.fillRect(70, 70, 940, 940);
    ctx.fillStyle = "#faf8f5";
    ctx.font = "700 72px Georgia";
    ctx.fillText(game, 130, 210, 820);
    ctx.fillStyle = "#c4956a";
    ctx.font = "500 30px Arial";
    ctx.fillText("PAPER FOUNDATION INDIA · GAME RESULT", 130, 285);
    ctx.fillStyle = "#faf8f5";
    ctx.font = "700 220px Georgia";
    ctx.fillText(String(score), 130, 585);
    ctx.font = "500 52px Arial";
    ctx.fillText(`/ ${outOf}`, 475, 575);
    ctx.fillStyle = "#e8ddd0";
    ctx.font = "700 52px Georgia";
    ctx.fillText(badge, 130, 720, 820);
    ctx.font = "400 32px Arial";
    wrapCanvasText(ctx, message, 130, 790, 800, 46);
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
      <div className="game-result-stamp">{badge}</div>
      <p className="game-kicker">Your result</p>
      <h1>{score}<span> / {outOf}</span></h1>
      <h2>{game}</h2>
      <p className="game-result-message">{message}</p>
      {children}
      <div className="game-share-row">
        <button onClick={nativeShare}><Share2 size={16} /> Share</button>
        <a href={linkedIn} target="_blank" rel="noreferrer">in LinkedIn <ExternalLink size={14} /></a>
        <a href={xShare} target="_blank" rel="noreferrer">X <ExternalLink size={14} /></a>
        <a href={facebook} target="_blank" rel="noreferrer">Facebook <ExternalLink size={14} /></a>
        <a href={whatsApp} target="_blank" rel="noreferrer">WhatsApp <ExternalLink size={14} /></a>
        <button onClick={copyResult}><Copy size={16} /> {copied ? "Copied" : "Copy"}</button>
        <button onClick={downloadCard}><Download size={16} /> Instagram card</button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={onReplay} className="game-primary-button">Play again</button>
        <Link href="/discover" className="game-secondary-button">Explore more games</Link>
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
