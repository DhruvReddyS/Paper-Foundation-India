"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Clock3,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "@/components/paper-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import ShareRow from "@/components/site/ShareRow";
import { getGameDefinition, type GameId } from "./gameCatalog";
import { isGameSoundEnabled, setGameSoundEnabled } from "./gameAudio";

const SITE_URL = "https://paperfoundation.in";

type MetricValue = string | number | boolean;

export function GameFrame({
  gameId,
  title,
  kicker,
  progress,
  elapsedSeconds,
  immersive = false,
  children,
}: {
  gameId: GameId;
  title: string;
  kicker: string;
  progress?: number;
  elapsedSeconds?: number;
  immersive?: boolean;
  children: React.ReactNode;
}) {
  const definition = getGameDefinition(gameId);
  const remote = useGameConfiguration(gameId);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(isGameSoundEnabled());
  }, []);

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
          <Link href="/discover" className="game-back-link">
            <ArrowLeft size={16} /> All games
          </Link>
          <div className="game-session-title">
            <p className="game-kicker">{kicker}</p>
            <p>{title}</p>
          </div>
          <div className="game-session-live">
            {typeof elapsedSeconds === "number" ? <><Clock3 /><span>Time<strong>{formatTime(elapsedSeconds)}</strong></span></> : <span>{definition.skill}</span>}
            <button
              type="button"
              className="game-sound-toggle"
              aria-label={soundEnabled ? "Mute game sounds" : "Enable game sounds"}
              aria-pressed={soundEnabled}
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                setGameSoundEnabled(next);
              }}
            >
              {soundEnabled ? <Volume2 /> : <VolumeX />}
            </button>
          </div>
        </header>
        {remote?.enabled === false ? (
          <section className="game-unavailable">
            <p className="game-kicker">Temporarily unavailable</p>
            <h1>This field test is being prepared.</h1>
            <p>Choose another game while the editorial team updates this experience.</p>
            <Link href="/discover">Return to all games</Link>
          </section>
        ) : typeof progress === "number" && (
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
        {remote?.enabled !== false && children}
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
  const remote = useGameConfiguration(gameId);
  const reducedMotion = useReducedMotion();
  const briefing = {
    "grow-or-shred": {
      desk: "FIELD NOTEBOOK",
      title: "Grow a living answer",
      cue: "Roots need evidence",
      labels: ["QUESTION", "CHOICE", "GROWTH"],
    },
    "truth-press": {
      desk: "VERIFICATION PRESS",
      title: "Put the claim under pressure",
      cue: "Ink follows evidence",
      labels: ["CLAIM", "CONTEXT", "VERDICT"],
    },
    "mill-master": {
      desk: "MILL CONTROL ROOM",
      title: "Keep the sheet moving",
      cue: "Sequence is the machine",
      labels: ["FIBRE", "FLOW", "SHEET"],
    },
    "hidden-paper": {
      desk: "MATERIAL EVIDENCE FILE",
      title: "Follow the smallest clue",
      cue: "Look past the surface",
      labels: ["OBJECT", "CLUE", "REVEAL"],
    },
    "paper-word-search": {
      desk: "TYPE HUNTER'S DESK",
      title: "Read in every direction",
      cue: "The grid changes each time",
      labels: ["SCAN", "MARK", "CLEAR"],
    },
  }[gameId];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`game-launch game-launch-${definition.theme}`}
    >
      <div className="game-launch-main">
        <header className="game-launch-copy">
          <div className="game-launch-number">{definition.number}</div>
          <p className="game-kicker">{eyebrow}</p>
          <h1>{remote?.title || title}</h1>
          <p>{remote?.description || description}</p>
          <div className="game-launch-actions">
            <button className="game-primary-button" onClick={onStart}>
              Start mission <Play size={16} fill="currentColor" />
            </button>
            <span>{remote?.duration || definition.duration}<b>{remote?.skill || definition.skill}</b></span>
          </div>
        </header>

        <div className="game-launch-world" aria-hidden="true">
          <div className="game-launch-world-label"><span>LIVE PREVIEW</span><b>{briefing.cue}</b></div>
          <GameMark gameId={gameId} animate={!reducedMotion} />
          <GameScene gameId={gameId} labels={briefing.labels} />
          <div className="game-launch-orbit"><i /><i /><i /></div>
        </div>

        <aside className="game-launch-rules">
          <header><small>{briefing.desk}</small><strong>{briefing.title}</strong></header>
          <ol>
            {(remote?.instructions?.length ? remote.instructions : rules).map((rule, index) => (
              <li key={rule}><span>{String(index + 1).padStart(2, "0")}</span><p>{rule}</p></li>
            ))}
          </ol>
          <footer><span>{remote?.difficulty || definition.difficulty}</span><b>{definition.verb}</b></footer>
        </aside>
      </div>
    </motion.section>
  );
}

export type PublicGameConfiguration = {
  gameId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  instructions?: string[];
  duration?: string;
  difficulty?: string;
  skill?: string;
  enabled?: boolean;
  content?: Record<string, unknown>;
};

// GameFrame, GameIntro and each game all need the editorial configuration. One
// in-flight request is shared between them so a single page view does not make
// the same call three or four times over.
let gameConfigurationRequest: Promise<PublicGameConfiguration[]> | null = null;

export function loadGameConfigurations() {
  gameConfigurationRequest ??= fetch("/api/game-config")
    .then((response) => (response.ok ? response.json() : { items: [] }))
    .then((data) => (Array.isArray(data.items) ? (data.items as PublicGameConfiguration[]) : []))
    .catch(() => {
      gameConfigurationRequest = null;
      return [] as PublicGameConfiguration[];
    });
  return gameConfigurationRequest;
}

export function useGameConfiguration(gameId: GameId) {
  const [configuration, setConfiguration] = useState<PublicGameConfiguration | null>(null);
  useEffect(() => {
    let active = true;
    void loadGameConfigurations().then((items) => {
      if (!active) return;
      const item = items.find(
        (candidate: PublicGameConfiguration & { id?: string }) => (candidate.gameId || candidate.id) === gameId
      );
      if (item) setConfiguration(item);
    });
    return () => {
      active = false;
    };
  }, [gameId]);
  return configuration;
}

function GameScene({ gameId, labels }: { gameId: GameId; labels: string[] }) {
  return (
    <div className={`game-scene game-scene-detail-${gameId}`}>
      <div className="game-scene-track">
        {labels.map((label, index) => <span key={label}><b>{String(index + 1).padStart(2, "0")}</b>{label}</span>)}
      </div>
      {gameId === "grow-or-shred" && <><i className="scene-seed" /><i className="scene-soil" /><i className="scene-sun" /></>}
      {gameId === "truth-press" && <><i className="scene-roller" /><i className="scene-sheet" /><i className="scene-stamp" /></>}
      {gameId === "mill-master" && <><i className="scene-pipe" /><i className="scene-gauge" /><i className="scene-belt" /></>}
      {gameId === "hidden-paper" && <><i className="scene-photo" /><i className="scene-thread" /><i className="scene-pin scene-pin-one" /><i className="scene-pin scene-pin-two" /></>}
      {gameId === "paper-word-search" && <><i className="scene-cursor" /><i className="scene-selection" /><i className="scene-typebar" /></>}
    </div>
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
  scoreArtwork,
  resultLabel = "Your Paper IQ result",
  replayLabel = "Play a new round",
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
  scoreArtwork?: React.ReactNode;
  resultLabel?: string;
  replayLabel?: string;
  onReplay: () => void;
}) {
  const definition = getGameDefinition(gameId);
  const [best, setBest] = useState<number | null>(null);
  const submitted = useRef(false);
  const percent = outOf > 0 ? Math.round((score / outOf) * 100) : 0;
  const shareUrl = `${SITE_URL}${definition.href}`;
  // The games build this object inline, so a new identity arrives on every
  // render. Serialising it keeps the recording effect to a single run.
  const metricsKey = JSON.stringify(metrics);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    const storageKey = `pfi-game-best:${gameId}`;
    let nextBest = score;
    try {
      const previous = Number(window.localStorage.getItem(storageKey));
      nextBest = Number.isFinite(previous) && previous > score ? previous : score;
      window.localStorage.setItem(storageKey, String(nextBest));
    } catch {
      // Private browsing can refuse storage. The result still displays.
    }
    setBest(nextBest);

    const record = {
      sessionId: window.crypto?.randomUUID?.() ?? `${gameId}-${Date.now()}`,
      gameId,
      score,
      outOf,
      durationSeconds,
      metrics: JSON.parse(metricsKey) as Record<string, MetricValue>,
    };
    const historyKey = "pfi-game-history";
    try {
      const stored = JSON.parse(window.localStorage.getItem(historyKey) || "[]");
      const history = Array.isArray(stored) ? stored : [];
      window.localStorage.setItem(
        historyKey,
        JSON.stringify([{ ...record, completedAt: new Date().toISOString() }, ...history].slice(0, 30))
      );
    } catch {
      try {
        window.localStorage.setItem(
          historyKey,
          JSON.stringify([{ ...record, completedAt: new Date().toISOString() }])
        );
      } catch {
        // Nothing further to do without storage.
      }
    }
    void fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      keepalive: true,
    }).catch(() => undefined);
  }, [durationSeconds, gameId, metricsKey, outOf, score]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`game-result-panel game-result-${definition.theme}`}
    >
      <div className="game-result-card-preview">
        <header>
          <span>GAME RESULT · {definition.number}</span>
          <small>PAPERFOUNDATION.IN</small>
        </header>
        <div className="game-result-mark" aria-hidden="true">
          {scoreArtwork ?? <GameMark gameId={gameId} animate={false} />}
        </div>
        <p className="game-kicker">{resultLabel}</p>
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

      <div className="game-result-control-panel">
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

        <div className="game-result-extra">{children}</div>

        <ShareRow
          subject={{
            title: `${game} result`,
            summary: message,
            url: shareUrl,
            tags: definition.shareTags,
            scoreLine: `I scored ${score}/${outOf} in ${game} and earned “${badge}” from Paper Foundation India. Can you beat my Paper IQ?`,
          }}
          buildImage={() =>
            buildScoreCanvas({ gameId, game, score, outOf, badge, message, durationSeconds, metrics })
          }
          imageName={`${gameId}-paper-iq.png`}
          className="game-result-share"
        />

        <div className="game-result-actions">
          <button onClick={onReplay} className="game-primary-button">
            <RotateCcw size={16} /> {replayLabel}
          </button>
          <Link href="/games" className="game-secondary-button">
            Explore all games
          </Link>
        </div>
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
  const ambientMotion = gameId === "grow-or-shred"
    ? { rotate: [-.7, .8, -.7], scaleY: [1, 1.012, 1] }
    : gameId === "truth-press"
      ? { rotate: [-8, -5.5, -8], scale: [1, 1.018, 1] }
      : gameId === "mill-master"
        ? { y: [0, -3, 0], scale: [1, 1.012, 1] }
        : gameId === "hidden-paper"
          ? { x: [-4, 5, -4], y: [2, -4, 2], rotate: [-2, 2, -2] }
          : { y: [0, -3, 0], rotate: [-1, .5, -1] };
  return (
    <motion.div
      className={`game-mark game-mark-${gameId}`}
      animate={animate ? ambientMotion : undefined}
      transition={{ duration: gameId === "grow-or-shred" ? 5.8 : 3.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: gameId === "grow-or-shred" ? "50% 100%" : "50% 50%" }}
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
  metrics: Record<string, MetricValue>;
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
  drawGameCanvasMark(ctx, options.gameId, theme.accent, options.metrics);

  ctx.fillStyle = theme.accent;
  ctx.font = "600 25px Arial";
  const supportsLetterSpacing = "letterSpacing" in ctx;
  if (supportsLetterSpacing) ctx.letterSpacing = "3px";
  ctx.fillText("PAPER FOUNDATION INDIA  /  GAME RESULT", 118, 148);
  if (supportsLetterSpacing) ctx.letterSpacing = "0px";
  ctx.fillStyle = theme.ink;
  ctx.font = "600 72px Georgia";
  ctx.fillText(options.game, 118, 268, 840);
  // The score is drawn at a fixed size, so a four-figure total would collide
  // with a hard-coded divider. The divider is placed after the measured width,
  // and the score shrinks if it would otherwise run under the artwork.
  const scoreText = String(options.score);
  let scoreSize = 218;
  ctx.font = `700 ${scoreSize}px Georgia`;
  while (ctx.measureText(scoreText).width > 430 && scoreSize > 120) {
    scoreSize -= 10;
    ctx.font = `700 ${scoreSize}px Georgia`;
  }
  const scoreWidth = ctx.measureText(scoreText).width;
  ctx.fillStyle = theme.accent;
  ctx.fillText(scoreText, 112, 555);
  ctx.fillStyle = theme.ink;
  ctx.font = "500 50px Arial";
  ctx.fillText(`/ ${options.outOf}`, 112 + scoreWidth + 26, 545);
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
  const canvasPercent = options.outOf > 0 ? Math.round((options.score / options.outOf) * 100) : 0;
  ctx.fillText(`${canvasPercent}%  ·  ${formatTime(options.durationSeconds)}`, 118, 953);
  ctx.fillStyle = theme.ink;
  ctx.textAlign = "right";
  ctx.fillText("paperfoundation.in", 962, 953);
  ctx.textAlign = "left";

  await drawLogo(ctx);
  return canvas;
}

function drawGameCanvasMark(ctx: CanvasRenderingContext2D, gameId: GameId, accent: string, metrics: Record<string, MetricValue>) {
  ctx.save();
  ctx.translate(820, 320);
  ctx.strokeStyle = `${accent}66`;
  ctx.fillStyle = `${accent}33`;
  ctx.lineWidth = 9;
  if (gameId === "grow-or-shred") {
    const growth = Math.max(1, Number(metrics.correctAnswers) || 1);
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(82, 230); ctx.bezierCurveTo(74, 177, 91, 112, 82, 38); ctx.stroke();
    const limbs = [[80,178,25,124],[84,162,141,106],[81,130,41,72],[85,113,128,54],[82,88,64,32],[84,72,106,18]];
    limbs.slice(0, growth).forEach(([x1, y1, x2, y2], index) => {
      ctx.lineWidth = Math.max(3, 8 - index * .7);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1+x2)/2 + (index % 2 ? 8 : -8),(y1+y2)/2, x2, y2); ctx.stroke();
      ctx.fillStyle = accent;
      for (let leafIndex = 0; leafIndex < 5; leafIndex += 1) {
        ctx.beginPath();
        ctx.ellipse(x2 + (leafIndex - 2) * 7, y2 + Math.abs(leafIndex - 2) * 3, 5, 11, (leafIndex - 2) * .35, 0, Math.PI * 2);
        ctx.fill();
      }
    });
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
