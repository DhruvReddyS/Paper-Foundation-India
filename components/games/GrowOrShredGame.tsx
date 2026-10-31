"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ExternalLink, Leaf, X } from "@/components/paper-ui/icons";
import { useEffect, useRef, useState } from "react";
import { GameFrame, GameIntro, ResultPanel, shuffleItems, useGameConfiguration, useGameTimer } from "./GameShared";
import { playGameSound } from "./gameAudio";
import { quizQuestions, type QuizQuestion } from "./gameData";

type Phase = "intro" | "play" | "result";

export default function GrowOrShredGame() {
  const configuration = useGameConfiguration("grow-or-shred");
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => shuffleItems(quizQuestions));
  // One record of what has been answered, rather than a cursor plus a running
  // score. React batches synchronous clicks, so any handler that reads state
  // and then increments it can run twice on a double tap and count twice. A
  // single functional update over this record cannot: replaying it is a no-op.
  const [round, setRound] = useState<{ answers: number[]; revealed: boolean }>({ answers: [], revealed: false });
  const { seconds, resetTimer } = useGameTimer(phase === "play");

  useEffect(() => {
    const configured = configuration?.content?.questions;
    if (phase === "intro" && Array.isArray(configured) && configured.length) setQuestions(shuffleItems(configured as QuizQuestion[]));
  }, [configuration, phase]);

  const index = Math.min(Math.max(0, round.answers.length - (round.revealed ? 1 : 0)), Math.max(0, questions.length - 1));
  const question = questions[index];
  const selected = round.revealed ? round.answers[round.answers.length - 1] ?? null : null;

  // Everything below is derived, so it cannot drift out of step with the answers.
  const graded = round.answers.map((choice, position) => choice === questions[position]?.correct);
  const correctAnswers = graded.filter(Boolean).length;
  const { score, bestStreak, streak } = graded.reduce(
    (totals, isCorrect) => {
      if (!isCorrect) return { ...totals, streak: 0 };
      const nextStreak = totals.streak + 1;
      return {
        score: totals.score + 100 + Math.min(nextStreak * 10, 40),
        streak: nextStreak,
        bestStreak: Math.max(totals.bestStreak, nextStreak),
      };
    },
    { score: 0, streak: 0, bestStreak: 0 }
  );

  function answer(option: number) {
    setRound((current) => {
      if (current.revealed) return current;
      playGameSound(option === questions[current.answers.length]?.correct ? "correct" : "wrong");
      return { answers: [...current.answers, option], revealed: true };
    });
  }

  function next() {
    setRound((current) => {
      if (!current.revealed) return current;
      if (current.answers.length >= questions.length) {
        playGameSound("complete");
        return { ...current, revealed: false };
      }
      return { ...current, revealed: false };
    });
  }

  useEffect(() => {
    if (phase === "play" && !round.revealed && round.answers.length >= questions.length && questions.length) {
      playGameSound("complete");
      setPhase("result");
    }
  }, [phase, round.answers.length, round.revealed, questions.length]);

  function reset() {
    setPhase("intro");
    setRound({ answers: [], revealed: false });
    const configured = configuration?.content?.questions;
    setQuestions(shuffleItems(Array.isArray(configured) && configured.length ? configured as QuizQuestion[] : quizQuestions));
    resetTimer();
  }

  const badge = correctAnswers >= Math.ceil(questions.length * 0.85)
    ? "Canopy Scholar"
    : correctAnswers >= Math.ceil(questions.length * 0.55)
      ? "Fibre Thinker"
      : "Curious Sapling";

  return (
    <GameFrame gameId="grow-or-shred" immersive={phase !== "intro"} title="Grow or Shred" kicker="Game 01 · Paper IQ" elapsedSeconds={phase === "intro" ? undefined : seconds} progress={phase === "play" && questions.length ? ((index + (selected === null ? 0 : 1)) / questions.length) * 100 : undefined}>
      {phase === "intro" && (
        <GameIntro
          gameId="grow-or-shred"
          eyebrow="The flagship Paper IQ game"
          title="Grow the evidence. Shred the assumption."
          description="A freshly shuffled set of evidence-backed questions shapes one living tree. Correct knowledge grows its canopy; weak assumptions return to fibre."
          rules={[
            "Choose one answer for each paper, recycling or forestry question.",
            "Read the evidence reveal, every answer explains why and links to a source.",
            "Build a streak to unlock denser leaves, flowers and a stronger final tree.",
          ]}
          onStart={() => setPhase("play")}
        />
      )}

      {phase === "play" && question && (
        <section className="quiz-stage">
          <div className="tree-panel">
            <TreeVisual correct={correctAnswers} wrong={Math.max(0, index + (selected !== null ? 1 : 0) - correctAnswers)} streak={streak} />
            <div className="tree-score-strip">
              <span><strong>{score}</strong> points</span>
              <span><Leaf size={15} /> {streak} streak</span>
            </div>
          </div>

          <motion.div key={index} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="question-panel">
              <div className="question-number">Question {index + 1} of {questions.length}</div>
              <h1>{question.question}</h1>
              <div className="answer-grid">
                {question.answers.map((answerText, option) => {
                  const isCorrect = selected !== null && option === question.correct;
                  const isWrong = selected === option && option !== question.correct;
                  return (
                    <motion.button
                      whileHover={selected === null ? { x: 5 } : undefined}
                      key={`${option}-${answerText}`}
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
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="evidence-reveal" role="status" aria-live="polite">
                    <div className={selected === question.correct ? "evidence-good" : "evidence-correction"}>
                      {selected === question.correct ? "The canopy grows" : "Assumption shredded, new evidence recovered"}
                    </div>
                    <p>{question.explanation}</p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <a href={question.source} target="_blank" rel="noreferrer">Source: {question.sourceLabel} <ExternalLink size={13} /></a>
                      <button onClick={next} className="game-primary-button">{round.answers.length >= questions.length ? "See my tree" : "Next question"} →</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>
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
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const elapsed = (now - startedAt) / 1000;
      const rawGrowth = reducedMotion ? 1 : Math.min(1, elapsed / 1.6);
      const growth = 1 - Math.pow(1 - rawGrowth, 3);
      const wind = reducedMotion ? 0 : (Math.sin(now / 2100) + Math.sin(now / 730) * .22) * .022;
      const random = seeded(8204 + correct * 31);
      const baseX = width * .5;
      const baseY = height * .9;
      const scale = Math.min(width / 430, height / 475);
      const depth = Math.max(1, Math.min(6, correct + 1));

      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "rgba(222,232,213,.88)");
      sky.addColorStop(.58, "rgba(239,237,214,.56)");
      sky.addColorStop(1, "rgba(205,185,151,.32)");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      const sunlight = context.createRadialGradient(width * .78, height * .16, 2, width * .78, height * .16, width * .28);
      sunlight.addColorStop(0, "rgba(255,228,164,.52)");
      sunlight.addColorStop(.35, "rgba(255,229,177,.18)");
      sunlight.addColorStop(1, "rgba(255,229,177,0)");
      context.fillStyle = sunlight;
      context.fillRect(0, 0, width, height * .62);

      context.fillStyle = "rgba(57,90,61,.07)";
      context.beginPath();
      context.moveTo(0, height * .68);
      context.bezierCurveTo(width * .18, height * .59, width * .32, height * .68, width * .48, height * .61);
      context.bezierCurveTo(width * .67, height * .53, width * .78, height * .66, width, height * .56);
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.fill();

      const ground = context.createRadialGradient(baseX, baseY, 8, baseX, baseY, width * .35);
      ground.addColorStop(0, "rgba(55,74,45,.34)");
      ground.addColorStop(1, "rgba(69,91,56,0)");
      context.fillStyle = ground;
      context.beginPath();
      context.ellipse(baseX, baseY + 3, width * .34, 18 * scale, 0, 0, Math.PI * 2);
      context.fill();

      context.lineCap = "round";
      context.lineJoin = "round";

      function leaf(x: number, y: number, angle: number, size: number, shade: number, alpha: number) {
        const flutter = reducedMotion ? 0 : Math.sin(now / 420 + shade * 1.73) * .1;
        context.save();
        context.translate(x, y);
        context.rotate(angle + flutter + wind * 2.4);
        context.scale(size * (1 + flutter * .08), size * .62);
        context.globalAlpha = alpha;
        context.shadowColor = "rgba(20,44,27,.2)";
        context.shadowBlur = 3 * scale;
        context.shadowOffsetY = 2 * scale;
        context.fillStyle = shade % 7 === 0 ? "#a8794e" : shade % 4 === 0 ? "#789064" : shade % 3 === 0 ? "#315f3e" : "#4b744c";
        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(-8, -7, -11, -20, 0, -29);
        context.bezierCurveTo(12, -20, 10, -7, 0, 0);
        context.fill();
        context.shadowColor = "transparent";
        context.strokeStyle = "rgba(244,239,217,.42)";
        context.lineWidth = .8;
        context.beginPath();
        context.moveTo(0, -2);
        context.lineTo(0, -24);
        context.moveTo(0, -13);
        context.lineTo(-5, -17);
        context.moveTo(0, -17);
        context.lineTo(5, -21);
        context.stroke();
        context.restore();
      }

      let terminalIndex = 0;
      function branch(x: number, y: number, length: number, angle: number, thickness: number, remaining: number, order: number) {
        const branchStart = Math.min(.8, order * .075);
        const localGrowth = Math.max(0, Math.min(1, (growth - branchStart) / .34));
        if (localGrowth <= 0) return;
        const sway = wind * (7 - remaining) * (1 + order * .12) + (reducedMotion ? 0 : Math.sin(now / 1300 + order * .83 + x * .01) * .003 * order);
        const finalAngle = angle + sway;
        const endX = x + Math.cos(finalAngle) * length * localGrowth;
        const endY = y + Math.sin(finalAngle) * length * localGrowth;
        const bend = (random() - .5) * length * .24;

        const branchWidth = Math.max(1.2, thickness * localGrowth);
        context.strokeStyle = "rgba(43,28,19,.24)";
        context.lineWidth = branchWidth + 2.2 * scale;
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
        context.strokeStyle = remaining > 2 ? "#65412c" : "#745139";
        context.lineWidth = branchWidth;
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
        if (remaining > 1) {
          context.strokeStyle = "rgba(222,185,132,.24)";
          context.lineWidth = Math.max(.55, branchWidth * .12);
          context.beginPath();
          context.moveTo(x + 1.2 * scale, y);
          context.quadraticCurveTo((x + endX) / 2 + bend * .18, (y + endY) / 2, endX, endY);
          context.stroke();
        }

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

      const soil = context.createLinearGradient(0, baseY - 5, 0, height);
      soil.addColorStop(0, "rgba(113,78,49,.16)");
      soil.addColorStop(1, "rgba(73,50,32,.36)");
      context.fillStyle = soil;
      context.fillRect(0, baseY, width, height - baseY);

      context.strokeStyle = "rgba(88,56,37,.72)";
      context.lineWidth = 5.5 * scale;
      [-1, -.46, .45, 1].forEach((direction, index) => {
        context.beginPath();
        context.moveTo(baseX, baseY - 2);
        context.bezierCurveTo(
          baseX + direction * 25 * scale,
          baseY + 3,
          baseX + direction * 52 * scale,
          baseY + 12 * scale,
          baseX + direction * (72 + index * 8) * scale,
          baseY + 25 * scale
        );
        context.stroke();
      });

      for (let item = 0; item < wrong * 3; item += 1) {
        const fall = reducedMotion ? .92 : ((elapsed * (.17 + item * .006) + item * .19) % 1);
        const x = baseX + Math.sin(item * 2.1 + elapsed) * width * .2;
        const y = height * (.2 + fall * .68);
        leaf(x, y, elapsed + item, .34 * scale, item, .58 * (1 - fall * .35));
      }

      if (correct >= 3) {
        for (let mote = 0; mote < 18; mote += 1) {
          const phase = mote * 1.93;
          const drift = reducedMotion ? 0 : Math.sin(elapsed * .42 + phase) * 18 * scale;
          const moteX = (mote * 71 % Math.max(1, width)) + drift;
          const moteY = height * (.12 + ((mote * 47) % 67) / 100);
          context.globalAlpha = .15 + (mote % 4) * .045;
          context.fillStyle = mote % 3 === 0 ? "#d5aa68" : "#f1dfad";
          context.beginPath();
          context.arc(moteX, moteY, (1.1 + mote % 3 * .45) * scale, 0, Math.PI * 2);
          context.fill();
        }
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
