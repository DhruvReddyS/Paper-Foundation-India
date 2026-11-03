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

// A shared result should always point at the live site, never at whatever
// host the page happens to be served from. This reads the same configured
// origin the SEO layer uses, so the domain is defined in one place.
/**
 * The address a shared card sends people to.
 *
 * NEXT_PUBLIC_SITE_URL is inlined when the bundle is built, so a build made
 * on a machine that has .env.local would otherwise ship share links pointing
 * at localhost. A share link is opened on somebody else's device by
 * definition, so a local origin is never the right answer: fall back to the
 * public domain rather than hand out a dead link.
 */
export const PUBLIC_SITE = "https://paperfoundation.in";
const configuredSite = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const SITE_URL = !configuredSite || /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(configuredSite)
  ? PUBLIC_SITE
  : configuredSite;

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
          buildAnimation={() =>
            buildScoreAnimation({ gameId, game, score, outOf, badge, message, durationSeconds, metrics })
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

/**
 * The sheet is the same cream on every card so a shared result is instantly a
 * Paper Foundation artefact; only the accent changes per game.
 */
const CARD = 1080;
const SHEET = "#fbf7ef";
const DESK = "#e7e0d2";
const INK = "#1a2d21";
const MUTED = "#6a746c";
const SERIF = 'Fraunces, Georgia, serif';
const SANS = '"DM Sans", Arial, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';

const scoreThemes: Record<GameId, { accent: string; deep: string }> = {
  "grow-or-shred": { accent: "#8c6627", deep: "#234d32" },
  "truth-press": { accent: "#a04f2b", deep: "#7c4430" },
  "mill-master": { accent: "#8d6a1c", deep: "#183e3c" },
  "hidden-paper": { accent: "#4a7659", deep: "#263b31" },
  "paper-word-search": { accent: "#8a5f24", deep: "#253a31" },
};

/**
 * Canvas falls back to a system face without warning when a font has not been
 * loaded at that exact size and weight, which is how this card came to be
 * drawn in Georgia and Arial instead of the Foundation's own typefaces.
 */
async function ensureCardFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  const faces = [
    "700 208px Fraunces", "600 68px Fraunces", "600 34px Fraunces",
    '600 46px "DM Sans"', '500 30px "DM Sans"', '600 32px "DM Sans"',
    '500 21px "DM Mono"', '600 21px "DM Mono"', '600 25px "DM Mono"',
  ];
  await Promise.all(faces.map((face) => document.fonts.load(face).catch(() => undefined)));
}

/** Laid and chain lines: the marks a mould leaves in a sheet of paper. */
function drawSheet(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = DESK;
  ctx.fillRect(0, 0, CARD, CARD);

  ctx.save();
  ctx.shadowColor = "rgba(42,32,17,0.3)";
  ctx.shadowBlur = 46;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = SHEET;
  ctx.fillRect(56, 52, CARD - 112, CARD - 112);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(56, 52, CARD - 112, CARD - 112);
  ctx.clip();
  ctx.strokeStyle = "rgba(26,52,37,0.042)";
  ctx.lineWidth = 1;
  for (let y = 52; y < CARD - 60; y += 7) {
    ctx.beginPath(); ctx.moveTo(56, y + 0.5); ctx.lineTo(CARD - 56, y + 0.5); ctx.stroke();
  }
  ctx.strokeStyle = "rgba(26,52,37,0.055)";
  for (let x = 56; x < CARD - 56; x += 54) {
    ctx.beginPath(); ctx.moveTo(x + 0.5, 52); ctx.lineTo(x + 0.5, CARD - 60); ctx.stroke();
  }
  ctx.restore();

  // Deckle: the soft, uneven edge of a handmade sheet.
  ctx.fillStyle = SHEET;
  for (let x = 56; x <= CARD - 56; x += 13) {
    ctx.beginPath();
    ctx.ellipse(x, CARD - 60, 7.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}


/** The letterpress rule that heads a sheet of mill stationery. */
function drawLetterpressRule(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, accent: string) {
  ctx.fillStyle = INK;
  ctx.fillRect(x, y, width, 3);
  ctx.fillStyle = accent;
  ctx.fillRect(x, y + 7, width, 1);
}

/**
 * Renders the scorecard at a point in its reveal.
 *
 * `progress` runs 0 to 1: the score counts up, the badge stamps in and the
 * rule draws across. At 1 the frame is identical to the still card, so the
 * animation and the PNG cannot drift apart.
 */
/**
 * The card is drawn as a mill test certificate for the sheet the player just
 * made: a cream sheet with laid lines and a deckle edge, the Foundation's
 * lockup and address at the head, the result set like a specimen reading, and
 * a struck stamp for the badge.
 *
 * Every element is drawn at a point on `progress` so the animated share and
 * the still PNG are the same artwork at different moments.
 */
async function drawScoreFrame(
  ctx: CanvasRenderingContext2D,
  options: CanvasOptions,
  progress: number,
  logo: HTMLImageElement | null
) {
  const theme = scoreThemes[options.gameId];
  const eased = 1 - Math.pow(1 - Math.max(0, Math.min(1, progress)), 3);
  const spacing = "letterSpacing" in ctx;
  const setSpacing = (value: string) => {
    if (spacing) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = value;
  };

  drawSheet(ctx);
  drawGameCanvasMark(ctx, options.gameId, theme.accent, theme.deep, options.metrics, eased, options.outOf > 0 ? Math.max(0, Math.min(1, options.score / options.outOf)) : 0);

  // Head: the lockup, then the address the card is advertising.
  if (logo?.naturalWidth) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, eased * 2.2);
    ctx.drawImage(logo, 104, 104, 58, 68);
    ctx.restore();
  }
  ctx.fillStyle = INK;
  ctx.font = `600 25px ${MONO}`;
  setSpacing("2px");
  ctx.fillText("PAPER FOUNDATION INDIA", 182, 133);
  setSpacing("0px");
  ctx.fillStyle = MUTED;
  ctx.font = `500 23px ${SANS}`;
  ctx.fillText("Love Paper use Paper without Hesitation", 182, 170);

  ctx.textAlign = "right";
  ctx.fillStyle = MUTED;
  ctx.font = `500 21px ${MONO}`;
  setSpacing("2px");
  ctx.fillText("CERTIFICATE OF RESULT", 976, 128);
  ctx.fillText(`NO. ${String(Math.max(0, options.score)).padStart(4, "0")}`, 976, 162);
  setSpacing("0px");
  ctx.textAlign = "left";

  drawLetterpressRule(ctx, 104, 206, (976 - 104) * eased, theme.accent);

  // The specimen: which game, then the reading it produced.
  ctx.fillStyle = MUTED;
  ctx.font = `500 21px ${MONO}`;
  setSpacing("2px");
  ctx.fillText("SPECIMEN", 104, 268);
  setSpacing("0px");

  ctx.fillStyle = INK;
  ctx.font = `600 68px ${SERIF}`;
  ctx.fillText(options.game, 104, 336, 520);

  const shown = Math.round(options.score * eased);
  let scoreSize = 208;
  ctx.font = `700 ${scoreSize}px ${SERIF}`;
  while (ctx.measureText(String(options.score)).width > 420 && scoreSize > 110) {
    scoreSize -= 10;
    ctx.font = `700 ${scoreSize}px ${SERIF}`;
  }
  ctx.fillStyle = theme.deep;
  ctx.fillText(String(shown), 104, 530);
  const scoreWidth = ctx.measureText(String(shown)).width;
  ctx.fillStyle = MUTED;
  ctx.font = `500 46px ${SANS}`;
  ctx.fillText(`/ ${options.outOf}`, 104 + scoreWidth + 24, 530);

  // The badge is struck on near the end, like a real stamp meeting paper.
  if (eased > 0.5) {
    const struck = Math.min(1, (eased - 0.5) / 0.32);
    ctx.save();
    ctx.translate(104, 596);
    ctx.rotate(-0.035 + (1 - struck) * 0.07);
    ctx.scale(1 + (1 - struck) * 0.16, 1 + (1 - struck) * 0.16);
    ctx.globalAlpha = struck * 0.92;
    ctx.font = `600 25px ${MONO}`;
    setSpacing("2px");
    const label = options.badge.toUpperCase();
    const width = Math.min(500, ctx.measureText(label).width + 48);
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, 62);
    ctx.fillStyle = theme.accent;
    ctx.fillText(label, 24, 40, width - 48);
    setSpacing("0px");
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  if (eased > 0.68) {
    ctx.globalAlpha = Math.min(1, (eased - 0.68) / 0.32);
    ctx.fillStyle = INK;
    ctx.font = `500 30px ${SANS}`;
    wrapCanvasText(ctx, options.message, 104, 726, 500, 40);
    ctx.globalAlpha = 1;
  }

  // Foot: the reading, and the address again so a cropped share still carries it.
  ctx.fillStyle = `${theme.accent}66`;
  ctx.fillRect(104, 912, (976 - 104) * eased, 1);

  if (eased > 0.84) {
    ctx.globalAlpha = Math.min(1, (eased - 0.84) / 0.16);
    const percent = options.outOf > 0 ? Math.round((options.score / options.outOf) * 100) : 0;
    ctx.fillStyle = MUTED;
    ctx.font = `500 21px ${MONO}`;
    setSpacing("1px");
    ctx.fillText(`${percent}%  ·  ${formatTime(options.durationSeconds)}  ·  PLAY IT YOURSELF`, 104, 962);
    setSpacing("0px");
    ctx.textAlign = "right";
    ctx.fillStyle = theme.deep;
    ctx.font = `600 30px ${SANS}`;
    ctx.fillText("paperfoundation.in", 976, 964);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }
}

async function loadLogo() {
  const image = new Image();
  image.src = "/images/brand/paper-foundation-nav-logo.png";
  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
  return image.naturalWidth ? image : null;
}

/**
 * Records the reveal as a video file for sharing.
 *
 * Uses MediaRecorder, which every current browser has, picking MP4 where the
 * browser can produce it because that is what messaging apps accept most
 * readily. Returns null when recording is unavailable, and the caller falls
 * back to the still PNG.
 */
export async function buildScoreAnimation(options: CanvasOptions, seconds = 3.2) {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx || typeof canvas.captureStream !== "function") return null;

  const candidates = [
    "video/mp4;codecs=avc1",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  const mimeType = candidates.find((type) => MediaRecorder.isTypeSupported?.(type));
  if (!mimeType) return null;

  await ensureCardFonts();
  const logo = await loadLogo();
  const stream = canvas.captureStream(30);
  const chunks: BlobPart[] = [];

  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
  } catch {
    return null;
  }
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  const finished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start();
  const startedAt = performance.now();
  await new Promise<void>((resolve) => {
    function frame(now: number) {
      const elapsed = (now - startedAt) / 1000;
      // Hold on the finished card for the last part, so a looping preview
      // rests on the score rather than snapping back.
      const progress = Math.min(1, elapsed / (seconds * 0.72));
      void drawScoreFrame(ctx!, options, progress, logo);
      if (elapsed < seconds) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());

  const blob = await finished;
  if (!blob.size) return null;
  return { blob, extension: mimeType.startsWith("video/mp4") ? "mp4" : "webm" };
}

/** The still card is the final frame of the same artwork. */
async function buildScoreCanvas(options: CanvasOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  await ensureCardFonts();
  await drawScoreFrame(ctx, options, 1, await loadLogo());
  return canvas;
}

/**
 * The artwork is the reason anyone looks twice at a shared card, so it is
 * drawn large and it reflects the round that was actually played: the tree
 * carries the leaves you earned, the mill line lights the stages you ordered,
 * the grid strikes through the words you found.
 *
 * It occupies the right column, clear of the result text on the left.
 */
function drawGameCanvasMark(ctx: CanvasRenderingContext2D, gameId: GameId, accent: string, deep: string, metrics: Record<string, MetricValue>, eased: number, scoreShare: number) {
  const reveal = Math.max(0, Math.min(1, (eased - 0.18) / 0.62));
  if (reveal <= 0) return;
  ctx.save();
  ctx.globalAlpha = reveal;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (gameId === "grow-or-shred") {
    const correct = Math.max(0, Number(metrics.correctAnswers) || 0);
    const total = 8;
    const share = Math.min(1, correct / total);
    const baseX = 806;
    const baseY = 872;
    let seed = 1337;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

    const leaf = (x: number, y: number, angle: number, size: number, tone: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(size, size * 0.64);
      ctx.fillStyle = tone % 3 === 0 ? deep : tone % 2 === 0 ? accent : "#4b744c";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-9, -8, -12, -22, 0, -32);
      ctx.bezierCurveTo(13, -22, 11, -8, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const limb = (x: number, y: number, length: number, angle: number, width: number, depth: number) => {
      if (depth <= 0 || length < 9) return;
      const ex = x + Math.cos(angle) * length;
      const ey = y + Math.sin(angle) * length;
      ctx.strokeStyle = "#6b4a30";
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(angle) * length * 0.5 + (rnd() - 0.5) * 14, y + Math.sin(angle) * length * 0.5, ex, ey);
      ctx.stroke();

      // Leaves run the length of the limb, not only at its tip.
      if (depth <= 3 && correct > 0) {
        const count = Math.round(1 + share * 4);
        for (let i = 0; i < count; i += 1) {
          const t = 0.3 + (i / Math.max(1, count)) * 0.7;
          const px = x + (ex - x) * t;
          const py = y + (ey - y) * t;
          const spin = angle + (rnd() - 0.5) * 1.7;
          leaf(px + Math.cos(spin) * 5, py + Math.sin(spin) * 4, spin, 0.75 + rnd() * 0.5, i + depth);
        }
      }
      const branches = depth > 3 ? 2 : rnd() > 0.45 ? 3 : 2;
      for (let b = 0; b < branches; b += 1) {
        const spread = branches === 2 ? (b === 0 ? -0.46 : 0.46) : (b - 1) * 0.42;
        limb(ex, ey, length * (0.7 + rnd() * 0.06), angle + spread + (rnd() - 0.5) * 0.18, Math.max(1.6, width * 0.68), depth - 1);
      }
    };

    // Depth follows the share of correct answers, so a perfect round fills out.
    // A weak round still draws a real tree, a perfect one fills the column.
    limb(baseX, baseY, 164, -Math.PI / 2, 21, Math.max(2, Math.round(2 + share * 4)));
    ctx.strokeStyle = `${deep}44`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(baseX - 86, baseY + 2);
    ctx.quadraticCurveTo(baseX, baseY + 12, baseX + 86, baseY + 2);
    ctx.stroke();
  } else if (gameId === "truth-press") {
    // A verdict struck onto a stack of claim slips.
    const checked = Math.max(0, Number(metrics.correctClaims) || 0);
    const reviewed = Math.max(1, Number(metrics.claimsReviewed) || 1);
    // How many slips were judged right, shown as marked edges rather than a
    // caption, since the message below the score already states the count.
    const marked = Math.round((checked / reviewed) * 5);
    for (let i = 4; i >= 0; i -= 1) {
      ctx.save();
      ctx.translate(708 + i * 9, 356 + i * 46);
      ctx.rotate((i % 2 ? 1 : -1) * 0.025);
      ctx.fillStyle = i === 0 ? "#fffdf8" : "#f1ebdd";
      ctx.strokeStyle = `${deep}33`;
      ctx.lineWidth = 2;
      ctx.fillRect(0, 0, 232, 128);
      ctx.strokeRect(0, 0, 232, 128);
      ctx.fillStyle = `${deep}2a`;
      for (let line = 0; line < 3; line += 1) ctx.fillRect(22, 36 + line * 24, 188 - line * 52, 5);
      if (4 - i < marked) {
        ctx.fillStyle = accent;
        ctx.fillRect(0, 0, 7, 128);
      }
      ctx.restore();
    }
    ctx.save();
    ctx.translate(762, 448);
    ctx.rotate(-0.17);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 6;
    ctx.strokeRect(-104, -46, 208, 92);
    ctx.fillStyle = accent;
    ctx.font = `600 38px ${MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("VERDICT", 0, 14);
    ctx.textAlign = "left";
    ctx.restore();
  } else if (gameId === "mill-master") {
    // The production line, drawn as the eight stages in order.
    const placed = Math.max(1, Math.round(scoreShare * 8));
    ctx.strokeStyle = `${deep}33`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(676, 300);
    ctx.lineTo(676, 836);
    ctx.stroke();
    for (let i = 0; i < 8; i += 1) {
      const y = 316 + i * 74;
      const on = i < placed;
      ctx.fillStyle = on ? accent : `${deep}22`;
      ctx.beginPath();
      ctx.arc(676, y, on ? 15 : 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = on ? accent : `${deep}33`;
      ctx.lineWidth = on ? 5 : 3;
      ctx.beginPath();
      ctx.moveTo(704, y);
      ctx.lineTo(704 + (on ? 180 : 96), y);
      ctx.stroke();
      ctx.fillStyle = MUTED;
      ctx.font = `500 19px ${MONO}`;
      ctx.fillText(String(i + 1).padStart(2, "0"), 900 + (on ? 0 : -84), y + 7);
    }
  } else if (gameId === "hidden-paper") {
    // Objects found, under the lens.
    const found = Math.max(0, Number(metrics.identified) || 0);
    for (let i = 0; i < 4; i += 1) {
      const x = 668 + (i % 2) * 168;
      const y = 326 + Math.floor(i / 2) * 168;
      ctx.strokeStyle = i < Math.min(4, found) ? accent : `${deep}26`;
      ctx.lineWidth = i < Math.min(4, found) ? 5 : 3;
      ctx.strokeRect(x, y, 134, 134);
      if (i < Math.min(4, found)) {
        ctx.fillStyle = `${accent}1f`;
        ctx.fillRect(x, y, 134, 134);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(x + 36, y + 70);
        ctx.lineTo(x + 60, y + 94);
        ctx.lineTo(x + 100, y + 42);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = deep;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(836, 700, 62, 0, Math.PI * 2);
    ctx.moveTo(880, 744);
    ctx.lineTo(948, 812);
    ctx.stroke();
  } else {
    // A real grid hides words across, down and diagonally, so striking only
    // across read as wrong. These three words are genuinely placed in those
    // three directions and each line is struck along its own run.
    const hidden = Math.max(1, Number(metrics.wordsHidden) || 1);
    const share = Math.min(1, (Number(metrics.wordsFound) || 0) / hidden);
    const rows = ["KPULPS", "ADMEFR", "RTBIGN", "ENCOLK", "AFSDTL", "MHEBRY"];
    const solved = [
      { from: [1, 0], to: [4, 0] },   // PULP, across
      { from: [0, 2], to: [0, 5] },   // REAM, down
      { from: [2, 1], to: [5, 4] },   // MILL, diagonal
    ];
    const struck = Math.round(share * solved.length);
    const cx = (col: number) => 700 + col * 52;
    const cy = (row: number) => 336 + row * 56;

    ctx.font = `600 27px ${MONO}`;
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        const inSolved = solved.slice(0, struck).some(({ from, to }) => {
          const steps = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
          const dc = Math.sign(to[0] - from[0]);
          const dr = Math.sign(to[1] - from[1]);
          for (let i = 0; i <= steps; i += 1) {
            if (from[0] + dc * i === col && from[1] + dr * i === row) return true;
          }
          return false;
        });
        ctx.fillStyle = inSolved ? deep : `${deep}38`;
        ctx.fillText(rows[row][col], cx(col), cy(row));
      }
    }

    ctx.strokeStyle = `${accent}d0`;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    for (const { from, to } of solved.slice(0, struck)) {
      // Extend along the run's own direction. Offsetting both ends in x left
      // the vertical strike sitting beside its letters instead of over them.
      const ax = cx(from[0]) + 9, ay = cy(from[1]) - 9;
      const bx = cx(to[0]) + 9, by = cy(to[1]) - 9;
      const span = Math.hypot(bx - ax, by - ay) || 1;
      const ux = (bx - ax) / span, uy = (by - ay) / span;
      ctx.beginPath();
      ctx.moveTo(ax - ux * 18, ay - uy * 18);
      ctx.lineTo(bx + ux * 18, by + uy * 18);
      ctx.stroke();
    }
  }
  ctx.restore();
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
