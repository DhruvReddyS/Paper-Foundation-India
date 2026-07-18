"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, Check, CheckCircle2, Droplets, Factory, Filter, GripVertical, PackageCheck, Play, Recycle, RotateCcw, Scissors, Sparkles, Waves, Wind, X } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType, type PointerEvent } from "react";
import { GameFrame, GameIntro, ResultPanel, shuffleItems } from "./GameShared";
import { millSteps } from "./gameData";

type Step = (typeof millSteps)[number];
type StepInfo = { hint: string; icon: ComponentType<{ size?: number; strokeWidth?: number }> };

const makeStartingOrder = () => {
  let order = shuffleItems(millSteps) as Step[];
  while (order.every((step, index) => step === millSteps[index])) order = shuffleItems(millSteps) as Step[];
  return order;
};

const stepInfo: Record<Step, StepInfo> = {
  "Sort fibre": { hint: "Separate usable recovered-paper grades", icon: Recycle },
  "Make pulp": { hint: "Water loosens the old sheet into fibres", icon: Droplets },
  "Clean pulp": { hint: "Screens remove unwanted material", icon: Filter },
  "Refine fibres": { hint: "Prepare fibre surfaces to bond", icon: Sparkles },
  "Form sheet": { hint: "Spread the suspension across the wire", icon: Waves },
  "Press water": { hint: "Rollers squeeze water from the wet web", icon: Factory },
  "Dry sheet": { hint: "Heat removes the remaining moisture", icon: Wind },
  "Finish reel": { hint: "Smooth, trim and wind the final paper", icon: PackageCheck },
};

export default function MillMasterGame() {
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [steps, setSteps] = useState<Step[]>(makeStartingOrder);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [checked, setChecked] = useState(false);
  const [finalScore, setFinalScore] = useState(800);

  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const correctCount = useMemo(() => steps.filter((step, index) => millSteps[index] === step).length, [steps]);

  function reorder(next: Step[]) {
    setSteps(next);
    setChecked(false);
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    reorder(next);
  }

  function checkLine() {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setChecked(true);
    if (correctCount !== millSteps.length) return;
    setFinalScore(Math.max(300, 800 - (nextAttempts - 1) * 70 - Math.floor(seconds / 15) * 10));
    window.setTimeout(() => setPhase("result"), 700);
  }

  function startGame() {
    setPhase("play");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }

  function reset() {
    setPhase("intro");
    setSteps(makeStartingOrder());
    setAttempts(0);
    setSeconds(0);
    setChecked(false);
    setFinalScore(800);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }

  const badge = finalScore >= 720 ? "Mill Line Master" : finalScore >= 560 ? "Process Engineer" : "Fibre Apprentice";

  return (
    <GameFrame gameId="mill-master" immersive={phase !== "intro"} title="Paper Mill Shuffle" kicker="Game 03 · Build the Process" elapsedSeconds={phase === "intro" ? undefined : seconds} progress={phase === "play" ? correctCount / millSteps.length * 100 : undefined}>
      {phase === "intro" && (
        <GameIntro
          gameId="mill-master"
          eyebrow="A drag-and-drop process game"
          title="Can you build a working paper mill?"
          description="Eight process cards are out of order. Drag them into the sequence that turns recovered paper into a finished reel. Simple to play; surprisingly easy to get wrong."
          rules={["Drag the cards into the order you think is correct.", "Use the arrow controls when you prefer tapping or a keyboard.", "Check the line. Correct stages lock visually; rearrange the rest and try again."]}
          onStart={startGame}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "play" && (
          <motion.section key="mill-order" initial={{ opacity: 0, scale: .96, rotateX: 4 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }} className="mill-order-game">
            <div className="mill-game-layout">
              <aside className="mill-control-panel">
                <p className="game-kicker">The line is stopped</p>
                <h1>Reconnect<br />the mill.</h1>
                <p>Move eight stages into one continuous line—from recovered fibre to a finished reel.</p>
                <div className="mill-order-status">
                  <span><strong>{String(correctCount).padStart(2, "0")}</strong><small>correct</small></span>
                  <span><strong>{String(attempts).padStart(2, "0")}</strong><small>checks</small></span>
                </div>

                <AnimatePresence mode="wait">
                  {checked && correctCount < millSteps.length && (
                    <motion.div key={correctCount} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mill-order-feedback">
                      <span><X size={18} /> Line blocked</span>
                      <p><strong>{correctCount} stages</strong> are placed correctly. Keep the green stages and move the others.</p>
                    </motion.div>
                  )}
                  {checked && correctCount === millSteps.length && (
                    <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} className="mill-order-feedback is-success"><span><CheckCircle2 /> Mill running</span><p>The complete fibre-to-reel line is connected.</p></motion.div>
                  )}
                </AnimatePresence>

                <div className="mill-order-actions">
                  <button className="mill-shuffle-button" onClick={() => reorder(makeStartingOrder())}><RotateCcw size={16} /> Reshuffle</button>
                  <button className="game-primary-button" onClick={checkLine}><Play size={17} /> Check line</button>
                  <button className="mill-exit-button" onClick={reset}><ArrowLeft size={15} /> Exit</button>
                </div>
              </aside>

              <div className="mill-sequence-sheet">
                <header><span>Recovered fibre</span><strong>Drag the process into order</strong><span>Finished reel</span></header>
                <Reorder.Group axis="y" values={steps} onReorder={reorder} className="mill-order-list" aria-label="Paper mill process order">
                  {steps.map((step, index) => {
                    const isCorrect = millSteps[index] === step;
                    return <MillOrderCard key={step} step={step} index={index} checked={checked} isCorrect={isCorrect} onMove={moveStep} />;
                  })}
                </Reorder.Group>
                <footer><GripVertical /> Drag a row, or use its arrow buttons. Correct positions turn green after checking.</footer>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {phase === "result" && (
        <ResultPanel gameId="mill-master" game="Paper Mill Shuffle" score={finalScore} outOf={800} badge={badge} message={`You rebuilt the complete papermaking line in ${attempts} ${attempts === 1 ? "check" : "checks"} and ${seconds} seconds.`} durationSeconds={seconds} metrics={{ attempts }} onReplay={reset}>
          <div className="mill-result-line">
            {millSteps.map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong>{index < millSteps.length - 1 && <i />}</div>)}
          </div>
        </ResultPanel>
      )}
    </GameFrame>
  );
}

function MillOrderCard({ step, index, checked, isCorrect, onMove }: { step: Step; index: number; checked: boolean; isCorrect: boolean; onMove: (index: number, direction: -1 | 1) => void }) {
  const dragControls = useDragControls();
  const Icon = stepInfo[step].icon;
  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    dragControls.start(event);
  }
  return (
    <Reorder.Item value={step} dragListener={false} dragControls={dragControls} className={`mill-order-card ${checked ? isCorrect ? "is-correct" : "is-wrong" : ""}`} whileDrag={{ scale: 1.035, rotate: index % 2 ? 2 : -2, boxShadow: "0 28px 55px rgba(20,38,27,.24)" }}>
      <button className="mill-order-grip" onPointerDown={startDrag} aria-label={`Drag ${step}. Current position ${index + 1}`}><GripVertical /><span>{String(index + 1).padStart(2, "0")}</span></button>
      <div className="mill-order-icon"><Icon size={25} strokeWidth={1.7} /></div>
      <div className="mill-order-copy"><strong>{step}</strong><span>{stepInfo[step].hint}</span></div>
      <div className="mill-order-verdict" aria-label={checked ? isCorrect ? "Correct position" : "Wrong position" : "Not checked"}>{checked ? isCorrect ? <Check /> : <X /> : <Scissors />}</div>
      <div className="mill-order-move">
        <button onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`Move ${step} up`}><ArrowUp /></button>
        <button onClick={() => onMove(index, 1)} disabled={index === millSteps.length - 1} aria-label={`Move ${step} down`}><ArrowDown /></button>
      </div>
    </Reorder.Item>
  );
}
