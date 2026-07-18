"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock3, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatTime,
  GameFrame,
  GameIntro,
  ResultPanel,
  shuffleItems,
} from "./GameShared";

type Placement = {
  word: string;
  row: number;
  col: number;
  dr: number;
  dc: number;
};

type Puzzle = {
  letters: string[];
  placements: Placement[];
};

const SIZE = 12;
const LIMIT = 300;
const WORD_COUNT = 10;
const WORD_BANK = [
  "PAPER",
  "FIBRE",
  "FOREST",
  "MILL",
  "PULP",
  "CARTON",
  "SHEET",
  "TREE",
  "WATER",
  "RECYCLE",
  "CELLULOSE",
  "RECOVERY",
  "PACKAGING",
  "NEWSPRINT",
  "KRAFT",
  "BOARD",
  "TISSUE",
  "PRINT",
  "FOLD",
  "PRESS",
  "DRYER",
  "REEL",
  "PAPERBOARD",
  "PAPERMAKER",
  "BAMBOO",
  "BAGASSE",
  "COATING",
  "SCREEN",
  "PULPER",
  "FOLDING",
];
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
] as const;
const FILLER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const cellKey = (row: number, col: number) => `${row}-${col}`;
const placementCells = (placement: Placement) =>
  Array.from({ length: placement.word.length }, (_, index) =>
    cellKey(placement.row + placement.dr * index, placement.col + placement.dc * index)
  );

export default function PaperWordSearchGame() {
  const [phase, setPhase] = useState<"intro" | "play" | "result" | "timeout">("intro");
  const [puzzle, setPuzzle] = useState<Puzzle>(generatePuzzle);
  const [start, setStart] = useState<{ row: number; col: number } | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("Select the first letter, then the last.");

  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value >= LIMIT - 1) {
          window.setTimeout(() => setPhase("timeout"), 0);
          return LIMIT;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const selectedCells = useMemo(
    () =>
      new Set(
        found.flatMap((word) =>
          placementCells(puzzle.placements.find((placement) => placement.word === word)!)
        )
      ),
    [found, puzzle.placements]
  );

  function startGame() {
    setPhase("play");
    setSeconds(0);
  }

  function selectCell(row: number, col: number) {
    if (phase !== "play") return;
    if (!start) {
      setStart({ row, col });
      setMessage("Now select the final letter on the same line.");
      return;
    }

    const rowDistance = row - start.row;
    const colDistance = col - start.col;
    const isStraight =
      rowDistance === 0 ||
      colDistance === 0 ||
      Math.abs(rowDistance) === Math.abs(colDistance);
    if (!isStraight) {
      setStart(null);
      setMessage("Words only run straight or diagonally. Start a new line.");
      return;
    }

    const dr = Math.sign(rowDistance);
    const dc = Math.sign(colDistance);
    const distance = Math.max(Math.abs(rowDistance), Math.abs(colDistance));
    const letters = Array.from({ length: distance + 1 }, (_, index) => {
      const cellRow = start.row + dr * index;
      const cellCol = start.col + dc * index;
      return puzzle.letters[cellRow * SIZE + cellCol];
    }).join("");
    const reversed = letters.split("").reverse().join("");
    const match = puzzle.placements.find(
      (placement) =>
        (placement.word === letters || placement.word === reversed) &&
        !found.includes(placement.word)
    );

    setStart(null);
    if (!match) {
      setMessage("That line is not on this transcript. Look again.");
      return;
    }

    const nextFound = [...found, match.word];
    setFound(nextFound);
    setMessage(
      nextFound.length === WORD_COUNT
        ? "Transcript complete."
        : `${match.word} found — ${WORD_COUNT - nextFound.length} remaining.`
    );
    if (nextFound.length === WORD_COUNT) setPhase("result");
  }

  function newRound(nextPhase: "intro" | "play" = "intro") {
    setPuzzle(generatePuzzle());
    setStart(null);
    setFound([]);
    setSeconds(0);
    setMessage("Select the first letter, then the last.");
    setPhase(nextPhase);
  }

  const score = Math.max(200, 1000 - seconds * 2);
  const badge =
    seconds <= 90 ? "Fibre-Eyed Reader" : seconds <= 180 ? "Transcript Hunter" : "Patient Papermaker";

  return (
    <GameFrame
      gameId="paper-word-search"
      immersive={phase !== "intro"}
      title="Fibre Word Search"
      kicker="Game 05 · A fresh grid every round"
      progress={phase === "play" ? (found.length / WORD_COUNT) * 100 : undefined}
    >
      {phase === "intro" && (
        <GameIntro
          gameId="paper-word-search"
          eyebrow="A five-minute typographic hunt"
          title="Read between every line."
          description="The press generates a new grid and ten new paper words for every round. Search in eight directions and finish the transcript before the clock does."
          rules={[
            "Select the first letter, then the final letter of a hidden word.",
            "Words can run across, down, diagonally and backwards.",
            "Find all ten before five minutes; faster transcripts earn more points.",
          ]}
          onStart={startGame}
        />
      )}

      {phase === "play" && (
        <section className="word-stage">
          <header className="word-stage-header">
            <div>
              <p className="game-kicker">Live compositor&apos;s proof</p>
              <h1>Find the words<br />inside the sheet.</h1>
            </div>
            <div className="word-clock">
              <Clock3 />
              <small>Elapsed</small>
              <strong>{formatTime(seconds)}</strong>
            </div>
          </header>

          <div className="word-workbench">
            <div className="word-board-wrap">
              <div className="word-registration"><span /><span /><span /><span /></div>
              <div className="word-board" aria-label="Paper word-search grid">
                {puzzle.letters.map((letter, index) => {
                  const row = Math.floor(index / SIZE);
                  const col = index % SIZE;
                  const key = cellKey(row, col);
                  const isStart = start?.row === row && start.col === col;
                  return (
                    <button
                      key={key}
                      onClick={() => selectCell(row, col)}
                      className={`${selectedCells.has(key) ? "is-found" : ""} ${
                        isStart ? "is-start" : ""
                      }`}
                      aria-label={`Letter ${letter}, row ${row + 1}, column ${col + 1}`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
              <footer>
                <p>{message}</p>
                <button onClick={() => newRound("play")}>
                  <RotateCcw size={15} /> New grid
                </button>
              </footer>
            </div>

            <aside className="word-transcript">
              <header>
                <span>Word transcript</span>
                <strong>{found.length} / {WORD_COUNT}</strong>
              </header>
              {puzzle.placements.map((placement, index) => (
                <div className={found.includes(placement.word) ? "is-found" : ""} key={placement.word}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{placement.word}</strong>
                  <Check />
                </div>
              ))}
            </aside>
          </div>
        </section>
      )}

      <AnimatePresence>
        {phase === "timeout" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="word-timeout"
          >
            <Clock3 />
            <p className="game-kicker">The press stopped at 05:00</p>
            <h1>{found.length} of {WORD_COUNT} words found.</h1>
            <p>A fresh transcript is waiting. Keep the vocabulary; lose the old layout.</p>
            <button className="game-primary-button" onClick={() => newRound("play")}>
              Generate another grid
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {phase === "result" && (
        <ResultPanel
          gameId="paper-word-search"
          game="Fibre Word Search"
          score={score}
          outOf={1000}
          badge={badge}
          message={`You found all ten paper words in ${formatTime(seconds)} on a one-of-one generated grid.`}
          durationSeconds={seconds}
          metrics={{ wordsFound: found.length }}
          onReplay={() => newRound("intro")}
        >
          <div className="word-result-proof">
            <Sparkles />
            <span>Transcript complete</span>
            <strong>{formatTime(seconds)}</strong>
          </div>
        </ResultPanel>
      )}
    </GameFrame>
  );
}

export function generatePuzzle(): Puzzle {
  for (let puzzleAttempt = 0; puzzleAttempt < 30; puzzleAttempt += 1) {
    const words = shuffleItems(WORD_BANK)
      .slice(0, WORD_COUNT)
      .sort((a, b) => b.length - a.length);
    const grid = Array<string | null>(SIZE * SIZE).fill(null);
    const placements: Placement[] = [];

    for (const word of words) {
      let placed = false;
      for (let attempt = 0; attempt < 280 && !placed; attempt += 1) {
        const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const row = Math.floor(Math.random() * SIZE);
        const col = Math.floor(Math.random() * SIZE);
        const endRow = row + dr * (word.length - 1);
        const endCol = col + dc * (word.length - 1);
        if (endRow < 0 || endRow >= SIZE || endCol < 0 || endCol >= SIZE) continue;

        const compatible = word.split("").every((letter, index) => {
          const cell = grid[(row + dr * index) * SIZE + col + dc * index];
          return cell === null || cell === letter;
        });
        if (!compatible) continue;

        word.split("").forEach((letter, index) => {
          grid[(row + dr * index) * SIZE + col + dc * index] = letter;
        });
        placements.push({ word, row, col, dr, dc });
        placed = true;
      }
      if (!placed) break;
    }

    if (placements.length === WORD_COUNT) {
      return {
        placements: shuffleItems(placements),
        letters: grid.map((letter) => letter ?? FILLER[Math.floor(Math.random() * FILLER.length)]),
      };
    }
  }

  throw new Error("Could not generate a complete word-search puzzle.");
}
