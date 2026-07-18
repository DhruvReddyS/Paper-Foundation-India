"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ExternalLink, Leaf, X } from "lucide-react";
import { useState } from "react";
import { GameFrame, GameIntro, ResultPanel, shuffleItems, useGameTimer } from "./GameShared";
import { quizQuestions, type QuizQuestion } from "./gameData";

type Phase = "intro" | "play" | "result";

export default function GrowOrShredGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => shuffleItems(quizQuestions));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { seconds, resetTimer } = useGameTimer(phase === "play");
  const question = questions[index];

  function answer(option: number) {
    if (selected !== null) return;
    setSelected(option);
    if (option === question.correct) {
      const nextStreak = streak + 1;
      setScore((value) => value + 100 + Math.min(nextStreak * 10, 40));
      setCorrectAnswers((value) => value + 1);
      setStreak(nextStreak);
      setBestStreak((value) => Math.max(value, nextStreak));
    } else setStreak(0);
  }

  function next() {
    if (index === questions.length - 1) setPhase("result");
    else {
      setIndex((value) => value + 1);
      setSelected(null);
    }
  }

  function reset() {
    setPhase("intro");
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setCorrectAnswers(0);
    setQuestions(shuffleItems(quizQuestions));
    resetTimer();
  }

  const badge = correctAnswers >= 6 ? "Canopy Scholar" : correctAnswers >= 4 ? "Fibre Thinker" : "Curious Sapling";

  return (
    <GameFrame gameId="grow-or-shred" immersive={phase !== "intro"} title="Grow or Shred" kicker="Game 01 · Paper IQ" progress={phase === "play" ? ((index + (selected === null ? 0 : 1)) / questions.length) * 100 : undefined}>
      {phase === "intro" && (
        <GameIntro
          gameId="grow-or-shred"
          eyebrow="The flagship Paper IQ game"
          title="Grow the evidence. Shred the assumption."
          description="A freshly shuffled set of evidence-backed questions shapes one living tree. Correct knowledge grows its canopy; weak assumptions return to fibre."
          rules={[
            "Choose one answer for each paper, recycling or forestry question.",
            "Read the evidence reveal—every answer explains why and links to a source.",
            "Build a streak to unlock denser leaves, flowers and a stronger final tree.",
          ]}
          onStart={() => setPhase("play")}
        />
      )}

      {phase === "play" && (
        <section className="quiz-stage">
          <div className="tree-panel">
            <TreeVisual correct={correctAnswers} wrong={index + (selected !== null ? 1 : 0) - correctAnswers} streak={streak} />
            <div className="tree-score-strip">
              <span><strong>{score}</strong> points</span>
              <span><Leaf size={15} /> {streak} streak</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="question-panel">
              <div className="question-number">Question {index + 1} of {questions.length}</div>
              <h1>{question.question}</h1>
              <div className="answer-grid">
                {question.answers.map((answerText, option) => {
                  const isCorrect = selected !== null && option === question.correct;
                  const isWrong = selected === option && option !== question.correct;
                  return (
                    <motion.button
                      whileHover={selected === null ? { x: 5 } : undefined}
                      key={answerText}
                      onClick={() => answer(option)}
                      className={`${isCorrect ? "answer-correct" : ""} ${isWrong ? "answer-wrong" : ""}`}
                    >
                      <span>{String.fromCharCode(65 + option)}</span>{answerText}
                      {isCorrect && <Check size={18} />}{isWrong && <X size={18} />}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selected !== null && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="evidence-reveal">
                    <div className={selected === question.correct ? "evidence-good" : "evidence-correction"}>
                      {selected === question.correct ? "The canopy grows" : "Assumption shredded—new evidence recovered"}
                    </div>
                    <p>{question.explanation}</p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <a href={question.source} target="_blank" rel="noreferrer">Source: {question.sourceLabel} <ExternalLink size={13} /></a>
                      <button onClick={next} className="game-primary-button">{index === questions.length - 1 ? "See my tree" : "Next question"} →</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {phase === "result" && (
        <ResultPanel gameId="grow-or-shred" game="Grow or Shred" score={score} outOf={questions.reduce((total, _, questionIndex) => total + 100 + Math.min((questionIndex + 1) * 10, 40), 0)} badge={badge} message={`You answered ${correctAnswers} of ${questions.length} correctly and built a best streak of ${bestStreak}.`} durationSeconds={seconds} metrics={{ correctAnswers, bestStreak }} onReplay={reset}>
          <div className="mx-auto my-8 max-w-sm"><TreeVisual correct={correctAnswers} wrong={questions.length - correctAnswers} streak={bestStreak} compact /></div>
        </ResultPanel>
      )}
    </GameFrame>
  );
}

function TreeVisual({ correct, wrong, streak, compact = false }: { correct: number; wrong: number; streak: number; compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  const visibleBranches = botanicalBranches.filter((branch) => correct >= branch.level);
  const visibleLeaves = botanicalLeaves.filter((leaf) => correct >= leaf.level);
  return (
    <div className={`knowledge-tree ${compact ? "knowledge-tree-compact" : ""}`}>
      <svg viewBox="0 0 460 500" role="img" aria-label={`Evidence tree with ${correct} correct answers and ${wrong} recovered mistakes`}>
        <defs>
          <linearGradient id="livingTrunk" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#503624" /><stop offset=".5" stopColor="#855b3b" /><stop offset="1" stopColor="#b1845b" /></linearGradient>
          <linearGradient id="livingLeaf" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#214d32" /><stop offset=".55" stopColor="#4f7650" /><stop offset="1" stopColor="#9bad78" /></linearGradient>
          <radialGradient id="groundWash"><stop stopColor="#9caf7c" stopOpacity=".34" /><stop offset="1" stopColor="#9caf7c" stopOpacity="0" /></radialGradient>
          <filter id="livingShadow"><feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#173727" floodOpacity=".18" /></filter>
        </defs>
        <ellipse cx="230" cy="451" rx="175" ry="35" fill="url(#groundWash)" />
        <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: .8 }} d="M226 442 C181 451 145 466 119 485 M229 443 C276 451 313 467 340 484 M225 445 C208 463 196 477 191 491 M235 444 C251 462 264 479 267 492" fill="none" stroke="#745039" strokeWidth="8" strokeLinecap="round" opacity=".7" />
        <motion.g animate={reducedMotion ? undefined : { rotate: [-.35, .45, -.35] }} transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "230px 445px" }}>
          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.05, ease: "easeOut" }} d="M231 448 C218 396 239 356 225 312 C211 267 228 227 219 190 C210 152 224 119 233 83" fill="none" stroke="url(#livingTrunk)" strokeWidth="29" strokeLinecap="round" filter="url(#livingShadow)" />
          <path d="M232 435 C221 394 243 355 229 313 C218 268 233 229 224 191 C216 154 229 119 236 87" fill="none" stroke="#d2b28a" strokeWidth="3" strokeLinecap="round" opacity=".5" />
          {visibleBranches.map((branch, branchIndex) => (
            <Branch key={branch.d} d={branch.d} width={branch.width} delay={branchIndex * .07} />
          ))}
          {visibleLeaves.map((leaf, i) => (
            <g key={`${leaf.x}-${leaf.y}-${i}`} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate}) scale(${leaf.scale})`}>
              <motion.path
                d="M0 0 C-13 -7 -18 -24 -2 -36 C15 -28 18 -9 0 0 Z"
                fill={i % 7 === 0 ? "#b78355" : i % 4 === 0 ? "#789267" : "url(#livingLeaf)"}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ delay: .12 + (i % 9) * .025, duration: .42 }}
              />
              <motion.path
                d="M0 -2 C0 -12 0 -23 -2 -33"
                stroke="rgba(247,242,224,.55)"
                strokeWidth="1.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: .25 + (i % 9) * .025 }}
              />
            </g>
          ))}
          {streak >= 3 && blossomPoints.slice(0, Math.min(streak, blossomPoints.length)).map(([x, y], i) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <motion.g initial={{ opacity: 0 }} animate={reducedMotion ? { opacity: 1 } : { opacity: [1, .82, 1] }} transition={{ delay: .35 + i * .08, duration: 3.2, repeat: Infinity }}>
                <circle cy="-6" r="6" fill="#e8d0a9" /><circle cx="6" r="6" fill="#f1dfbd" /><circle cx="-6" r="6" fill="#d9b98b" /><circle r="2.8" fill="#a66e47" />
              </motion.g>
            </g>
          ))}
        </motion.g>
        {Array.from({ length: wrong * 3 }).map((_, i) => {
          const startX = 164 + (i * 43) % 140;
          return <motion.path key={`f-${i}`} d="M0 0 C7 3 9 12 2 20 C-5 15 -6 6 0 0 Z" fill={i % 3 === 0 ? "#b78355" : "#789267"} initial={{ opacity: 0, x: startX, y: 215 + (i % 4) * 16, rotate: i * 21 }} animate={reducedMotion ? { opacity: .48, y: 432 } : { opacity: [0, .75, .6, 0], x: [startX, startX + (i % 2 ? 20 : -18), startX + (i % 2 ? -8 : 14)], y: [215, 328, 448], rotate: [i * 21, i * 21 + 105, i * 21 + 210] }} transition={{ duration: 3 + (i % 3) * .32, delay: i * .2, repeat: Infinity, repeatDelay: 1.4, ease: "easeIn" }} />;
        })}
      </svg>
      <div className="tree-legend"><span>{correct} living branches</span><span>{wrong} ideas returned to fibre</span></div>
    </div>
  );
}

function Branch({ d, width, delay = 0 }: { d: string; width: number; delay?: number }) {
  return <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: .82, ease: "easeOut" }} d={d} fill="none" stroke="#6f4b34" strokeWidth={width} strokeLinecap="round" />;
}

const botanicalBranches = [
  { level: 1, width: 15, d: "M227 334 C193 315 164 286 137 246 C118 219 99 204 78 195" },
  { level: 1, width: 8, d: "M148 258 C119 253 94 239 72 220" },
  { level: 2, width: 15, d: "M225 301 C265 284 292 253 318 211 C332 189 351 173 377 160" },
  { level: 2, width: 8, d: "M306 229 C337 225 360 211 382 190" },
  { level: 3, width: 13, d: "M222 257 C187 235 169 206 158 169 C151 145 137 126 116 111" },
  { level: 3, width: 7, d: "M166 188 C137 184 115 172 96 153" },
  { level: 4, width: 13, d: "M222 232 C259 213 278 184 286 150 C292 125 307 105 329 89" },
  { level: 4, width: 7, d: "M278 171 C310 165 334 151 353 129" },
  { level: 5, width: 11, d: "M222 190 C199 169 192 145 195 116 C197 94 188 74 172 57" },
  { level: 5, width: 7, d: "M198 124 C175 114 159 99 149 80" },
  { level: 6, width: 10, d: "M225 165 C248 143 255 118 251 91 C248 68 257 48 276 30" },
  { level: 6, width: 6, d: "M253 100 C278 91 296 75 309 53" },
];

const branchTips = [
  { level: 1, x: 78, y: 195 }, { level: 1, x: 70, y: 220 }, { level: 1, x: 112, y: 230 },
  { level: 2, x: 377, y: 160 }, { level: 2, x: 382, y: 190 }, { level: 2, x: 338, y: 203 },
  { level: 3, x: 116, y: 111 }, { level: 3, x: 96, y: 153 }, { level: 3, x: 143, y: 145 },
  { level: 4, x: 329, y: 89 }, { level: 4, x: 353, y: 129 }, { level: 4, x: 304, y: 130 },
  { level: 5, x: 172, y: 57 }, { level: 5, x: 149, y: 80 }, { level: 5, x: 194, y: 94 },
  { level: 6, x: 276, y: 30 }, { level: 6, x: 309, y: 53 }, { level: 6, x: 242, y: 66 },
];

const botanicalLeaves = branchTips.flatMap((tip, tipIndex) =>
  [-42, -18, 8, 34].map((offset, leafIndex) => ({
    level: tip.level,
    x: tip.x + (leafIndex - 1.5) * 7,
    y: tip.y + Math.abs(leafIndex - 1.5) * 5,
    rotate: offset + (tipIndex % 2 ? 16 : -8),
    scale: .72 + ((tipIndex + leafIndex) % 3) * .1,
  }))
);

const blossomPoints: [number, number][] = [[78, 195], [377, 160], [116, 111], [329, 89], [172, 57], [276, 30]];
