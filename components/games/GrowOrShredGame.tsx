"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ExternalLink, Leaf, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    <GameFrame gameId="grow-or-shred" immersive={phase !== "intro"} title="Grow or Shred" kicker="Game 01 · Paper IQ" elapsedSeconds={phase === "intro" ? undefined : seconds} progress={phase === "play" ? ((index + (selected === null ? 0 : 1)) / questions.length) * 100 : undefined}>
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
        <ResultPanel gameId="grow-or-shred" game="Grow or Shred" score={score} outOf={questions.reduce((total, _, questionIndex) => total + 100 + Math.min((questionIndex + 1) * 10, 40), 0)} badge={badge} message={`You answered ${correctAnswers} of ${questions.length} correctly and built a best streak of ${bestStreak}.`} durationSeconds={seconds} metrics={{ correctAnswers, bestStreak }} scoreArtwork={<TreeVisual correct={correctAnswers} wrong={questions.length - correctAnswers} streak={bestStreak} compact />} onReplay={reset}>
          <div className="mx-auto my-8 max-w-sm"><TreeVisual correct={correctAnswers} wrong={questions.length - correctAnswers} streak={bestStreak} compact /></div>
        </ResultPanel>
      )}
    </GameFrame>
  );
}

function TreeVisual({ correct, wrong, streak, compact = false }: { correct: number; wrong: number; streak: number; compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const surface = canvas;
    const brush = context;
    let animationFrame = 0;
    let startedAt = performance.now();

    function seeded(seed: number) {
      let value = seed;
      return () => {
        value |= 0;
        value = value + 0x6d2b79f5 | 0;
        let result = Math.imul(value ^ value >>> 15, 1 | value);
        result = result + Math.imul(result ^ result >>> 7, 61 | result) ^ result;
        return ((result ^ result >>> 14) >>> 0) / 4294967296;
      };
    }

    function draw(now: number) {
      const canvas = surface;
      const context = brush;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const elapsed = (now - startedAt) / 1000;
      const growth = reducedMotion ? 1 : Math.min(1, elapsed / 1.25);
      const wind = reducedMotion ? 0 : Math.sin(now / 1900) * .025;
      const random = seeded(8204 + correct * 31);
      const baseX = width * .5;
      const baseY = height * .9;
      const scale = Math.min(width / 430, height / 475);
      const depth = Math.max(1, Math.min(6, correct + 1));

      const ground = context.createRadialGradient(baseX, baseY, 8, baseX, baseY, width * .35);
      ground.addColorStop(0, "rgba(69,91,56,.28)");
      ground.addColorStop(1, "rgba(69,91,56,0)");
      context.fillStyle = ground;
      context.beginPath();
      context.ellipse(baseX, baseY + 3, width * .34, 18 * scale, 0, 0, Math.PI * 2);
      context.fill();

      context.lineCap = "round";
      context.lineJoin = "round";

      function leaf(x: number, y: number, angle: number, size: number, shade: number, alpha: number) {
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.scale(size, size * .62);
        context.globalAlpha = alpha;
        context.fillStyle = shade % 7 === 0 ? "#a8794e" : shade % 4 === 0 ? "#789064" : shade % 3 === 0 ? "#315f3e" : "#4b744c";
        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(-8, -8, -10, -20, 0, -28);
        context.bezierCurveTo(11, -19, 10, -7, 0, 0);
        context.fill();
        context.strokeStyle = "rgba(244,239,217,.42)";
        context.lineWidth = .8;
        context.beginPath();
        context.moveTo(0, -2);
        context.lineTo(0, -24);
        context.stroke();
        context.restore();
      }

      let terminalIndex = 0;
      function branch(x: number, y: number, length: number, angle: number, thickness: number, remaining: number, order: number) {
        const branchStart = Math.min(.8, order * .075);
        const localGrowth = Math.max(0, Math.min(1, (growth - branchStart) / .34));
        if (localGrowth <= 0) return;
        const sway = wind * (7 - remaining);
        const finalAngle = angle + sway;
        const endX = x + Math.cos(finalAngle) * length * localGrowth;
        const endY = y + Math.sin(finalAngle) * length * localGrowth;
        const bend = (random() - .5) * length * .24;

        context.strokeStyle = remaining > 2 ? "#6d4931" : "#765238";
        context.lineWidth = Math.max(1.2, thickness * localGrowth);
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(
          x + Math.cos(finalAngle) * length * .42 + bend,
          y + Math.sin(finalAngle) * length * .36,
          endX - Math.cos(finalAngle) * length * .24 - bend * .35,
          endY - Math.sin(finalAngle) * length * .2,
          endX,
          endY
        );
        context.stroke();

        if (remaining > 0 && localGrowth > .78) {
          const split = remaining > 3 ? 2 : (random() > .67 ? 3 : 2);
          for (let child = 0; child < split; child += 1) {
            const spread = split === 2 ? (child === 0 ? -.43 : .43) : (child - 1) * .39;
            branch(
              endX,
              endY,
              length * (.68 + random() * .08),
              finalAngle + spread + (random() - .5) * .16,
              thickness * .7,
              remaining - 1,
              order + 1
            );
          }
        } else if (remaining === 0 && correct > 0 && localGrowth > .82) {
          terminalIndex += 1;
          const foliage = 3 + correct + (streak >= 3 ? 2 : 0);
          for (let item = 0; item < foliage; item += 1) {
            const theta = random() * Math.PI * 2;
            const radius = (8 + random() * 24) * scale;
            leaf(
              endX + Math.cos(theta) * radius,
              endY + Math.sin(theta) * radius * .58,
              theta + finalAngle,
              (.52 + random() * .42) * scale,
              terminalIndex + item,
              Math.min(1, (localGrowth - .82) * 5.5)
            );
          }
          if (streak >= 3 && terminalIndex % 3 === 0) {
            context.globalAlpha = Math.min(1, (localGrowth - .82) * 5.5);
            context.fillStyle = "#e4c89f";
            context.beginPath();
            context.arc(endX, endY, 3.2 * scale, 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = 1;
          }
        }
      }

      branch(baseX, baseY, height * .285, -Math.PI / 2, 23 * scale, depth, 0);

      context.strokeStyle = "rgba(96,63,41,.68)";
      context.lineWidth = 5 * scale;
      [-1, -.46, .45, 1].forEach((direction, index) => {
        context.beginPath();
        context.moveTo(baseX, baseY - 2);
        context.quadraticCurveTo(baseX + direction * 42 * scale, baseY + 4, baseX + direction * (72 + index * 8) * scale, baseY + 20 * scale);
        context.stroke();
      });

      for (let item = 0; item < wrong * 3; item += 1) {
        const fall = reducedMotion ? .92 : ((elapsed * (.17 + item * .006) + item * .19) % 1);
        const x = baseX + Math.sin(item * 2.1 + elapsed) * width * .2;
        const y = height * (.2 + fall * .68);
        leaf(x, y, elapsed + item, .34 * scale, item, .58 * (1 - fall * .35));
      }

      context.globalAlpha = 1;
      if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    }

    animationFrame = requestAnimationFrame(draw);
    const observer = new ResizeObserver(() => {
      startedAt = performance.now() - 1300;
      if (reducedMotion) animationFrame = requestAnimationFrame(draw);
    });
    observer.observe(surface);
    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [correct, reducedMotion, streak, wrong]);

  return (
    <div className={`knowledge-tree ${compact ? "knowledge-tree-compact" : ""}`}>
      <canvas ref={canvasRef} role="img" aria-label={`Living evidence tree with ${correct} correct answers and ${wrong} recovered mistakes`} />
      <div className="tree-legend"><span>{correct} living branches</span><span>{wrong} ideas returned to fibre</span></div>
    </div>
  );
}
