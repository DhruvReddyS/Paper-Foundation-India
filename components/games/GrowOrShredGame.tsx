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
    <GameFrame gameId="grow-or-shred" immersive={phase === "play"} title="Grow or Shred" kicker="Game 01 · Paper IQ" progress={phase === "play" ? ((index + (selected === null ? 0 : 1)) / questions.length) * 100 : undefined}>
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
  const leafCount = correct === 0 ? 0 : Math.min(treeCanopy.length, correct * 7 + streak * 2);
  return (
    <div className={`knowledge-tree ${compact ? "knowledge-tree-compact" : ""}`}>
      <svg viewBox="0 0 420 460" role="img" aria-label={`Evidence tree with ${correct} correct answers and ${wrong} recovered mistakes`}>
        <defs>
          <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#5f3f2a" /><stop offset="1" stopColor="#9a6d48" /></linearGradient>
          <linearGradient id="leafLight" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#78916a" /><stop offset="1" stopColor="#2d5f3e" /></linearGradient>
          <filter id="treeShadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        </defs>
        <path d="M58 425 Q210 386 362 425 L362 460 L58 460 Z" fill="#ddd7c1" />
        <motion.g animate={reducedMotion ? undefined : { rotate: [-.65, .8, -.65] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "210px 420px" }}>
          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.15, ease: "easeOut" }} d="M208 424 C194 352 222 302 207 238 C195 187 210 136 222 91" fill="none" stroke="url(#trunk)" strokeWidth="26" strokeLinecap="round" filter="url(#treeShadow)" />
          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} d="M207 385 C220 368 224 350 222 329" fill="none" stroke="#a47b54" strokeWidth="3" strokeLinecap="round" opacity=".55" />
          {correct >= 1 && <Branch d="M209 315 C169 291 141 262 119 220" />}
          {correct >= 2 && <Branch d="M211 285 C251 260 279 228 298 181" delay={0.08} />}
          {correct >= 3 && <Branch d="M208 246 C173 220 151 183 149 140" delay={0.16} />}
          {correct >= 4 && <Branch d="M211 217 C248 194 266 158 270 116" delay={0.24} />}
          {correct >= 5 && <Branch d="M216 171 C194 143 190 111 198 76" delay={0.32} />}
          {correct >= 6 && <Branch d="M211 190 C228 163 235 132 229 96" delay={0.38} />}
          {growthClusters.slice(0, correct).map((cluster, clusterIndex) => (
            <motion.g
              key={`growth-${clusterIndex}`}
              initial={{ opacity: 0, scale: 0, rotate: clusterIndex % 2 ? 7 : -7 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 155, damping: 13, delay: .16 }}
              style={{ transformOrigin: `${cluster.x}px ${cluster.y}px` }}
            >
              <circle cx={cluster.x} cy={cluster.y} r="17" fill="rgba(120,145,106,.14)" />
              {[-22, -11, 0, 11, 22].map((rotation, leafIndex) => (
                <motion.path
                  key={rotation}
                  d={`M${cluster.x} ${cluster.y} C${cluster.x - 9} ${cluster.y - 8} ${cluster.x - 8} ${cluster.y - 22} ${cluster.x + 1} ${cluster.y - 30} C${cluster.x + 13} ${cluster.y - 20} ${cluster.x + 12} ${cluster.y - 7} ${cluster.x} ${cluster.y} Z`}
                  fill={leafIndex % 2 ? "#76906a" : "#315f40"}
                  transform={`rotate(${rotation} ${cluster.x} ${cluster.y})`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: .2 + leafIndex * .045, duration: .42 }}
                />
              ))}
            </motion.g>
          ))}
          {treeCanopy.slice(0, leafCount).map((leaf, i) => (
            <motion.g
              key={`${leaf.x}-${leaf.y}`}
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate}) scale(${leaf.scale})`}
              initial={{ opacity: 0, scale: 0 }}
              animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.045, 1], rotate: [0, i % 2 ? 2.5 : -2, 0] }}
              transition={{ opacity: { delay: .12 + i * .022 }, scale: { duration: 3.2 + (i % 4) * .5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 3.8 + (i % 5) * .4, repeat: Infinity, ease: "easeInOut" } }}
            >
              <path d="M0 0 C-11 -9 -11 -24 1 -34 C15 -24 15 -8 0 0 Z" fill={i % 8 === 0 ? "#c4956a" : i % 4 === 0 ? "#8b9d77" : "url(#leafLight)"} />
              <path d="M0 -2 L1 -29" stroke="rgba(246,243,232,.5)" strokeWidth="1" />
            </motion.g>
          ))}
          {streak >= 3 && [165, 214, 265].map((x, i) => <motion.g key={x} transform={`translate(${x} ${122 + i * 28})`} initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }} transition={{ delay: .4 + i * .1, duration: 2.8, repeat: Infinity }}><circle r="7" fill="#e8cfa8" /><circle r="2.5" fill="#b97f50" /></motion.g>)}
        </motion.g>
        {Array.from({ length: wrong * 6 }).map((_, i) => {
          const startX = 142 + (i * 37) % 145;
          return <motion.path key={`f-${i}`} d="M0 0 C4 4 5 12 1 20 C-3 14 -4 6 0 0 Z" fill={i % 3 === 0 ? "#c4956a" : "#8b9d77"} initial={{ opacity: 0, x: startX, y: 180 + (i % 4) * 18, rotate: i * 17 }} animate={reducedMotion ? { opacity: .55, y: 404 } : { opacity: [0, .8, .65, 0], x: [startX, startX + (i % 2 ? 24 : -22), startX + (i % 2 ? -12 : 18)], y: [185, 300, 418], rotate: [i * 17, i * 17 + 90, i * 17 + 190] }} transition={{ duration: 3.4 + (i % 4) * .35, delay: i * .15, repeat: Infinity, repeatDelay: .8, ease: "easeIn" }} />;
        })}
      </svg>
      <div className="tree-legend"><span>{correct} evidence leaves</span><span>{wrong} ideas recycled</span></div>
    </div>
  );
}

function Branch({ d, delay = 0 }: { d: string; delay?: number }) {
  return <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: .78, ease: "easeOut" }} d={d} fill="none" stroke="#79543a" strokeWidth="13" strokeLinecap="round" />;
}

const treeCanopy = Array.from({ length: 58 }, (_, i) => {
  const angle = (i * 137.5 * Math.PI) / 180;
  const radius = 36 + (i % 8) * 13;
  return {
    x: 210 + Math.cos(angle) * radius,
    y: 185 + Math.sin(angle) * radius * .72 - (i % 4) * 9,
    rotate: (i * 47) % 180 - 90,
    scale: .62 + (i % 5) * .08,
  };
});

const growthClusters = [
  { x: 119, y: 220 },
  { x: 298, y: 181 },
  { x: 149, y: 140 },
  { x: 270, y: 116 },
  { x: 198, y: 76 },
  { x: 229, y: 96 },
];
