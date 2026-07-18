"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Download,
  ExternalLink,
  Play,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getGameDefinition, type GameId } from "./gameCatalog";

const SITE_URL = "https://paperfoundation.in";

type MetricValue = string | number | boolean;

export function GameFrame({
  gameId,
  title,
  kicker,
  progress,
  immersive = false,
  children,
}: {
  gameId: GameId;
  title: string;
  kicker: string;
  progress?: number;
  immersive?: boolean;
  children: React.ReactNode;
}) {
  const definition = getGameDefinition(gameId);

  useEffect(() => {
    if (!immersive) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [immersive]);

  return (
    <div
      className={`game-page game-rework game-theme-${definition.theme} min-h-screen ${
        immersive ? "game-page-immersive" : "pb-20 pt-5"
      }`}
      data-game={gameId}
    >
      <div className="game-shell">
        <header className="game-session-header">
          <Link href="/games" className="game-back-link">
            <ArrowLeft size={16} /> All games
          </Link>
          <div className="game-session-title">
            <p className="game-kicker">{kicker}</p>
            <p>{title}</p>
          </div>
          <div className="game-session-live">
            <i />
            <span>
              Paper Foundation India
              <b>Playable edition</b>
            </span>
          </div>
        </header>
        {typeof progress === "number" && (
          <div
            className="game-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <motion.span
              animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              transition={{ type: "spring", stiffness: 110, damping: 22 }}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function GameIntro({
  gameId,
  eyebrow,
  title,
  description,
  rules,
  onStart,
}: {
  gameId: GameId;
  eyebrow: string;
  title: string;
  description: string;
  rules: string[];
  onStart: () => void;
}) {
  const definition = getGameDefinition(gameId);
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className={`game-intro game-intro-${definition.theme}`}
    >
      <div className="game-intro-copy">
        <p className="game-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <button className="game-primary-button" onClick={onStart}>
          Begin the game <Play size={16} fill="currentColor" />
        </button>
      </div>
      <div className="game-intro-object" aria-hidden="true">
        <GameMark gameId={gameId} animate={!reducedMotion} />
      </div>
      <aside className="game-rules-card">
        <header>
          <span>{definition.number}</span>
          <div>
            <small>Field instructions</small>
            <strong>{definition.skill}</strong>
          </div>
        </header>
        <ol>
          {rules.map((rule, index) => (
            <li key={rule}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {rule}
            </li>
          ))}
        </ol>
        <footer>
          <span>No login</span>
          <span>Keyboard ready</span>
          <span>Shareable result</span>
        </footer>
      </aside>
    </motion.section>
  );
}

export function ResultPanel({
  gameId,
  game,
  score,
  outOf,
  badge,
  message,
  durationSeconds,
  metrics = {},
  children,
  onReplay,
}: {
  gameId: GameId;
  game: string;
  score: number;
  outOf: number;
  badge: string;
  message: string;
  durationSeconds: number;
  metrics?: Record<string, MetricValue>;
  children?: React.ReactNode;
  onReplay: () => void;
}) {
  const definition = getGameDefinition(gameId);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const submitted = useRef(false);
  const percent = Math.round((score / outOf) * 100);
  const shareUrl = `${SITE_URL}${definition.href}`;
  const shareText = `I scored ${score}/${outOf} in ${game} and earned “${badge}” from Paper Foundation India. Can you beat my Paper IQ?`;

  useEffect(() => {
    const storageKey = `pfi-game-best:${gameId}`;
    const previous = Number(window.localStorage.getItem(storageKey));
    const nextBest = Number.isFinite(previous) && previous > score ? previous : score;
    window.localStorage.setItem(storageKey, String(nextBest));
    setBest(nextBest);

    if (submitted.current) return;
    submitted.current = true;
    const sessionId = window.crypto.randomUUID();
    const record = { sessionId, gameId, score, outOf, durationSeconds, metrics };
    const historyKey = "pfi-game-history";
    try {
      const history = JSON.parse(window.localStorage.getItem(historyKey) || "[]") as unknown[];
      window.localStorage.setItem(
        historyKey,
        JSON.stringify([{ ...record, completedAt: new Date().toISOString() }, ...history].slice(0, 30))
      );
    } catch {
      window.localStorage.setItem(
        historyKey,
        JSON.stringify([{ ...record, completedAt: new Date().toISOString() }])
      );
    }
    void fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      keepalive: true,
    }).catch(() => undefined);
  }, [durationSeconds, gameId, metrics, outOf, score]);

  const copyResult = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [shareText, shareUrl]);

  async function nativeShare() {
    if (sharing) return;
    setSharing(true);
    try {
      const canvas = await buildScoreCanvas({
        gameId,
        game,
        score,
        outOf,
        badge,
        message,
        durationSeconds,
      });
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], `${gameId}-paper-iq.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `${game} result`, text: shareText, url: shareUrl, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: `${game} result`, text: shareText, url: shareUrl });
      } else {
        await copyResult();
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) await copyResult();
    } finally {
      setSharing(false);
    }
  }

  async function downloadCard() {
    const canvas = await buildScoreCanvas({
      gameId,
      game,
      score,
      outOf,
      badge,
      message,
      durationSeconds,
    });
    const link = document.createElement("a");
    link.download = `${gameId}-paper-iq.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const social = {
    linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsApp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    x: `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`game-result-panel game-result-${definition.theme}`}
    >
      <div className="game-result-card-preview">
        <header>
          <span>PFI / PLAY {definition.number}</span>
          <small>PAPER FOUNDATION INDIA</small>
        </header>
        <div className="game-result-mark" aria-hidden="true">
          <GameMark gameId={gameId} animate={false} />
        </div>
        <p className="game-kicker">Your Paper IQ result</p>
        <h1>
          {score}
          <span> / {outOf}</span>
        </h1>
        <h2>{game}</h2>
        <div className="game-result-stamp">{badge}</div>
        <p className="game-result-message">{message}</p>
        <footer>
          <span>{percent}% · {formatTime(durationSeconds)}</span>
          <b>paperfoundation.in</b>
        </footer>
      </div>

      <div className="game-result-summary">
        <span>
          <small>Final score</small>
          <strong>{percent}%</strong>
        </span>
        <span>
          <small>Time played</small>
          <strong>{formatTime(durationSeconds)}</strong>
        </span>
        <span>
          <small>Personal best</small>
          <strong>{best ?? score}</strong>
        </span>
      </div>

      {children}

      <div className="game-share-row">
        <button onClick={nativeShare} disabled={sharing}>
          <Share2 size={16} /> {sharing ? "Preparing…" : "Share scorecard"}
        </button>
        <button onClick={downloadCard}>
          <Download size={16} /> Download PNG
        </button>
        <button onClick={copyResult}>
          <Copy size={16} /> {copied ? "Copied" : "Copy result"}
        </button>
        <a href={social.linkedIn} target="_blank" rel="noreferrer">
          LinkedIn <ExternalLink size={13} />
        </a>
        <a href={social.x} target="_blank" rel="noreferrer">
          X <ExternalLink size={13} />
        </a>
        <a href={social.whatsApp} target="_blank" rel="noreferrer">
          WhatsApp <ExternalLink size={13} />
        </a>
      </div>

      <div className="game-result-actions">
        <button onClick={onReplay} className="game-primary-button">
          <RotateCcw size={16} /> Play a new round
        </button>
        <Link href="/games" className="game-secondary-button">
          Explore all games
        </Link>
      </div>
    </motion.section>
  );
}

export function useGameTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  const resetTimer = useCallback(() => setSeconds(0), []);
  return { seconds, resetTimer };
}

export function shuffleItems<T>(items: readonly T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function GameMark({ gameId, animate }: { gameId: GameId; animate: boolean }) {
  return (
    <motion.div
      className={`game-mark game-mark-${gameId}`}
      animate={animate ? { y: [0, -8, 0], rotate: [-1, 1, -1] } : undefined}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {gameId === "grow-or-shred" && (
        <svg viewBox="0 0 160 160"><path d="M80 145V64M80 88C50 78 36 60 34 32c28 2 46 18 46 44M80 106c30-8 47-27 49-55-28 1-45 18-49 43" /><path d="M55 145h50" /></svg>
      )}
      {gameId === "truth-press" && <><i /><strong>VERIFIED</strong><span>CONTEXT / 02</span></>}
      {gameId === "mill-master" && (
        <svg viewBox="0 0 170 150"><path d="M16 122V57l37 25V56l37 26V45l52 36v41z" /><circle cx="47" cy="122" r="16" /><circle cx="112" cy="122" r="16" /><path d="M22 31h55" /></svg>
      )}
      {gameId === "hidden-paper" && (
        <svg viewBox="0 0 160 160"><circle cx="67" cy="67" r="39" /><path d="m96 96 36 36M50 67h34M67 50v34" /></svg>
      )}
      {gameId === "paper-word-search" && (
        <div className="game-mark-grid">{["F", "I", "B", "R", "E", "P", "A", "P", "E", "R", "M", "I", "L", "L", "S", "T"].map((letter, index) => <span key={index}>{letter}</span>)}</div>
      )}
    </motion.div>
  );
}

type CanvasOptions = {
  gameId: GameId;
  game: string;
  score: number;
  outOf: number;
  badge: string;
  message: string;
  durationSeconds: number;
};

const scoreThemes: Record<GameId, { background: string; panel: string; accent: string; ink: string }> = {
  "grow-or-shred": { background: "#d8deca", panel: "#234d32", accent: "#c9a06f", ink: "#f6f1e6" },
  "truth-press": { background: "#ead9c7", panel: "#874b35", accent: "#f0c58e", ink: "#fff8ed" },
  "mill-master": { background: "#d7cfb4", panel: "#183e3c", accent: "#dfb85d", ink: "#f7f3df" },
  "hidden-paper": { background: "#cad3c1", panel: "#263b31", accent: "#b9d1bd", ink: "#f5f1e8" },
  "paper-word-search": { background: "#ddd6b8", panel: "#253a31", accent: "#dbb26c", ink: "#fff9e8" },
};

async function buildScoreCanvas(options: CanvasOptions) {
  const theme = scoreThemes[options.gameId];
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = theme.panel;
  ctx.fillRect(48, 48, 984, 984);
  ctx.strokeStyle = `${theme.accent}88`;
  ctx.lineWidth = 2;
  ctx.strokeRect(76, 76, 928, 928);
  drawPaperTexture(ctx, theme.ink);
  drawGameCanvasMark(ctx, options.gameId, theme.accent);

  ctx.fillStyle = theme.accent;
  ctx.font = "600 25px Arial";
  ctx.letterSpacing = "3px";
  ctx.fillText("PAPER FOUNDATION INDIA  /  THE PLAYABLE EDITION", 118, 148);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = theme.ink;
  ctx.font = "600 72px Georgia";
  ctx.fillText(options.game, 118, 268, 840);
  ctx.fillStyle = theme.accent;
  ctx.font = "700 218px Georgia";
  ctx.fillText(String(options.score), 112, 555);
  ctx.fillStyle = theme.ink;
  ctx.font = "500 50px Arial";
  ctx.fillText(`/ ${options.outOf}`, 490, 545);
  ctx.font = "700 50px Georgia";
  ctx.fillText(options.badge, 118, 672, 820);
  ctx.font = "400 30px Arial";
  wrapCanvasText(ctx, options.message, 118, 732, 800, 40);

  ctx.strokeStyle = `${theme.accent}77`;
  ctx.beginPath();
  ctx.moveTo(118, 905);
  ctx.lineTo(962, 905);
  ctx.stroke();
  ctx.fillStyle = theme.accent;
  ctx.font = "600 24px Arial";
  ctx.fillText(`${Math.round((options.score / options.outOf) * 100)}%  ·  ${formatTime(options.durationSeconds)}`, 118, 953);
  ctx.fillStyle = theme.ink;
  ctx.textAlign = "right";
  ctx.fillText("paperfoundation.in", 962, 953);
  ctx.textAlign = "left";

  await drawLogo(ctx);
  return canvas;
}

function drawGameCanvasMark(ctx: CanvasRenderingContext2D, gameId: GameId, accent: string) {
  ctx.save();
  ctx.translate(820, 320);
  ctx.strokeStyle = `${accent}66`;
  ctx.fillStyle = `${accent}33`;
  ctx.lineWidth = 9;
  if (gameId === "grow-or-shred") {
    ctx.beginPath(); ctx.moveTo(80, 230); ctx.lineTo(80, 45); ctx.moveTo(80, 110); ctx.quadraticCurveTo(10, 80, 18, 15); ctx.moveTo(80, 145); ctx.quadraticCurveTo(150, 105, 143, 35); ctx.stroke();
  } else if (gameId === "truth-press") {
    ctx.rotate(-0.12); ctx.strokeRect(0, 30, 190, 120); ctx.font = "700 31px Arial"; ctx.fillStyle = accent; ctx.fillText("VERIFIED", 17, 102);
  } else if (gameId === "mill-master") {
    ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(0, 70); ctx.lineTo(55, 110); ctx.lineTo(55, 65); ctx.lineTo(115, 110); ctx.lineTo(115, 45); ctx.lineTo(190, 105); ctx.lineTo(190, 180); ctx.closePath(); ctx.stroke();
  } else if (gameId === "hidden-paper") {
    ctx.beginPath(); ctx.arc(70, 80, 62, 0, Math.PI * 2); ctx.moveTo(112, 125); ctx.lineTo(190, 205); ctx.stroke();
  } else {
    ctx.font = "700 52px monospace"; ctx.fillStyle = `${accent}77`; ctx.fillText("FIBRE", 0, 70); ctx.fillText("PAPER", 20, 125); ctx.fillText("MILLS", 0, 180);
  }
  ctx.restore();
}

function drawPaperTexture(ctx: CanvasRenderingContext2D, ink: string) {
  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.strokeStyle = ink;
  for (let y = 78; y < 1010; y += 18) {
    ctx.beginPath();
    ctx.moveTo(78, y);
    ctx.bezierCurveTo(300, y - 3, 700, y + 5, 1002, y);
    ctx.stroke();
  }
  ctx.restore();
}

async function drawLogo(ctx: CanvasRenderingContext2D) {
  const image = new Image();
  image.src = "/images/brand/paper-foundation-nav-logo.png";
  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
  if (image.naturalWidth) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.drawImage(image, 882, 104, 72, 72);
    ctx.restore();
  }
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create scorecard image."))), "image/png");
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}

export function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
