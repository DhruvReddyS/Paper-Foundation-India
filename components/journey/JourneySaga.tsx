"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, ExternalLink, Factory, Leaf, PauseCircle, PenLine, PlayCircle, RotateCcw, Sparkles, Trees, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";
import { journeySpreads, journeyTotal, type JourneySpread } from "./journeyData";

const JourneyAtmosphere = dynamic(() => import("./JourneyAtmosphere"), { ssr: false });

type Turn = { from: number; to: number; direction: 1 | -1 } | null;

export default function JourneySaga() {
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState<Turn>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [helpOpen, setHelpOpen] = useState(true);
  const stageRef = useRef<HTMLElement>(null);
  const wheelRef = useRef(0);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const goTo = useCallback((next: number) => {
    if (turn || next === current || next < 0 || next >= journeyTotal) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, behavior: "auto" });
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    setHelpOpen(false);
    setTurn({ from: current, to: next, direction: next > current ? 1 : -1 });
  }, [current, turn]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const previous = useCallback(() => goTo(current - 1), [current, goTo]);
  const openBook = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    next();
  }, [next]);

  useEffect(() => {
    if (!autoplay || turn || current >= journeyTotal - 1) return;
    const timer = window.setTimeout(next, 5200);
    return () => window.clearTimeout(timer);
  }, [autoplay, current, next, turn]);

  useEffect(() => {
    if (current === journeyTotal - 1) setAutoplay(false);
  }, [current]);

  useEffect(() => {
    if (!turn) return;
    const isCoverTurn = turn.from === 0 || turn.to === 0;
    const timer = window.setTimeout(() => {
      setCurrent(turn.to);
      setTurn(null);
    }, prefersReducedMotion ? 40 : isCoverTurn ? 1380 : 1080);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, turn]);

  function finishTurn() {
    if (!turn) return;
    setCurrent(turn.to);
    setTurn(null);
  }

  function onWheel(event: WheelEvent<HTMLElement>) {
    if (turn || Math.abs(event.deltaY) < 3) return;
    wheelRef.current += event.deltaY;
    if (Math.abs(wheelRef.current) < 90) return;
    event.preventDefault();
    const direction = wheelRef.current > 0 ? 1 : -1;
    wheelRef.current = 0;
    if (direction === 1) next();
    else previous();
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button, input, a, [role='button']")) return;
    if (["ArrowRight", "ArrowDown", "PageDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      next();
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      previous();
    } else if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(journeyTotal - 1);
    else if (event.key === "Escape" && current > 0) goTo(0);
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, input, a, [role='button']")) return;
    touchStart.current = { x: event.clientX, y: event.clientY, time: performance.now() };
    setIsDragging(true);
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (!touchStart.current) return;
    const dx = event.clientX - touchStart.current.x;
    const dy = event.clientY - touchStart.current.y;
    const elapsed = Math.max(1, performance.now() - touchStart.current.time);
    const velocity = Math.abs(dx) / elapsed;
    touchStart.current = null;
    setIsDragging(false);
    stageRef.current?.style.setProperty("--journey-drag", "0");
    if (turn || (Math.abs(dx) < 48 && velocity < .42) || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) next();
    else previous();
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!stageRef.current || prefersReducedMotion) return;
    const bounds = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    stageRef.current.style.setProperty("--journey-pointer-x", x.toFixed(3));
    stageRef.current.style.setProperty("--journey-pointer-y", y.toFixed(3));
    if (touchStart.current) {
      const dx = Math.max(-160, Math.min(160, event.clientX - touchStart.current.x));
      stageRef.current.style.setProperty("--journey-drag", (dx / 160).toFixed(3));
    }
  }

  function resetPointer() {
    stageRef.current?.style.setProperty("--journey-pointer-x", "0");
    stageRef.current?.style.setProperty("--journey-pointer-y", "0");
    stageRef.current?.style.setProperty("--journey-drag", "0");
    touchStart.current = null;
    setIsDragging(false);
  }

  const visiblePage = turn ? turn.to : current;
  const currentSpread = current > 0 ? journeySpreads[current - 1] : null;

  return (
    <div className="journey-page">
      <section
        ref={stageRef}
        className="journey-stage"
        tabIndex={0}
        aria-label="Interactive paper journey storybook"
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
      >
        <div className="journey-forest" />
        <JourneyAtmosphere reducedMotion={Boolean(prefersReducedMotion)} />
        <div className="journey-vignette" />

        <header className="journey-overlay-header">
          <Link href="/" className="journey-brand-mark" aria-label="Exit journey and return home"><span /><div><small>Paper Foundation India · Exit</small><strong>How Paper Is Made</strong></div></Link>
          <div className="journey-counter"><small>Chapter</small><strong>{String(visiblePage).padStart(2, "0")}<span> / {String(journeyTotal - 1).padStart(2, "0")}</span></strong></div>
        </header>

        <div className="journey-book-stage">
          <div className={`journey-book-rig ${isDragging ? "is-dragging" : ""}`}>
            <BookView
              current={current}
              turn={turn}
              onOpen={openBook}
              onNext={next}
              onPrevious={previous}
              onTurnComplete={finishTurn}
              reducedMotion={Boolean(prefersReducedMotion)}
            />
          </div>
        </div>

        <div className="journey-controls">
          <button onClick={previous} disabled={current === 0 || Boolean(turn)} aria-label="Previous chapter"><ArrowLeft /></button>
          <div className="journey-progress-dots" aria-label="Journey chapters">
            {Array.from({ length: journeyTotal }).map((_, index) => (
              <button key={index} className={index === visiblePage ? "is-active" : index < visiblePage ? "is-past" : ""} onClick={() => goTo(index)} disabled={Boolean(turn)} aria-label={index === 0 ? "Go to cover" : `Go to ${journeySpreads[index - 1].title}`}><span /></button>
            ))}
          </div>
          <button onClick={next} disabled={current === journeyTotal - 1 || Boolean(turn)} aria-label="Next chapter"><ArrowRight /></button>
        </div>

        <div className="journey-utility-controls">
          <button onClick={() => setAutoplay((value) => !value)} aria-label={autoplay ? "Pause story" : "Auto play"} aria-pressed={autoplay}>{autoplay ? <PauseCircle /> : <PlayCircle />}<span>{autoplay ? "Pause story" : "Auto play"}</span></button>
          <button onClick={() => goTo(0)} disabled={current === 0 || Boolean(turn)} aria-label="Restart story"><RotateCcw /><span>Restart</span></button>
        </div>

        {current > 0 && !turn && (
          <div className="journey-swipe-affordance" aria-hidden="true">
            <ArrowLeft /><span>drag or swipe the paper</span><ArrowRight />
          </div>
        )}

        <AnimatePresence>
          {helpOpen && current === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="journey-help">
              <BookOpen /><p><strong>Take the complete tour</strong><span>Source, fibre, sheet, purpose and return—chapter by chapter.</span></p><button onClick={openBook}>Open book <ArrowRight /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sr-only" aria-live="polite">{current === 0 ? "Journey cover" : `${currentSpread?.chapter}: ${currentSpread?.title}`}</div>
      </section>

      <section className="journey-evidence-footer">
        <div>
          <p>The tour continues</p>
          <h2>Now you know how a sheet is made. What happens next is a shared choice.</h2>
        </div>
        <div className="journey-evidence-links">
          <Link href="/circularity">Explore circularity <ArrowRight /></Link>
          <Link href="/myths">Check paper myths <ArrowRight /></Link>
          <a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer">FAO forest guidance <ExternalLink /></a>
        </div>
      </section>
    </div>
  );
}

function BookView({
  current,
  turn,
  onOpen,
  onNext,
  onPrevious,
  onTurnComplete,
  reducedMotion,
}: {
  current: number;
  turn: Turn;
  onOpen: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTurnComplete: () => void;
  reducedMotion: boolean;
}) {
  if (current === 0 && !turn) return <ClosedCover onOpen={onOpen} />;

  const forward = turn?.direction !== -1;
  const fromSpread = turn && turn.from > 0 ? journeySpreads[turn.from - 1] : current > 0 ? journeySpreads[current - 1] : null;
  const toSpread = turn && turn.to > 0 ? journeySpreads[turn.to - 1] : current > 0 ? journeySpreads[current - 1] : journeySpreads[0];
  const settled = current > 0 ? journeySpreads[current - 1] : journeySpreads[0];

  let leftBase: JourneySpread = settled;
  let rightBase: JourneySpread = settled;
  if (turn) {
    leftBase = forward ? (fromSpread ?? toSpread) : toSpread;
    rightBase = forward ? toSpread : (fromSpread ?? toSpread);
  }

  const coverTurn = Boolean(turn && (turn.from === 0 || turn.to === 0));

  const opening = turn?.from === 0;
  const closing = turn?.to === 0;

  return (
    <motion.div
      initial={opening ? { opacity: .2, scale: .76, x: -72, y: 35, rotateX: 11, rotateZ: -2.5 } : { opacity: 0, scale: .94, y: 14 }}
      animate={closing ? { opacity: .96, scale: .76, x: -54, y: 30, rotateX: 8, rotateZ: -2.5 } : { opacity: 1, scale: turn ? 1.018 : 1, x: 0, y: 0, rotateX: 0, rotateZ: 0 }}
      transition={reducedMotion ? { duration: .01 } : { duration: opening || closing ? 1.08 : .68, ease: [.22, .72, .18, 1] }}
      className={`journey-book-open ${opening ? "is-opening" : ""} ${closing ? "is-closing" : ""}`}
    >
      <div className="journey-book-shadow" />
      <div className="journey-page-stack journey-stack-left" />
      <div className="journey-page-stack journey-stack-right" />
      <PageText spread={leftBase} side="left" />
      <PageImage spread={rightBase} side="right" />
      <div className="journey-gutter" />
      {!turn && (
        <>
          <button
            className="journey-page-corner journey-page-corner-left"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onPrevious}
            aria-label="Turn to the previous chapter"
          ><ArrowLeft /><span>Previous</span></button>
          <button
            className="journey-page-corner journey-page-corner-right"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onNext}
            disabled={current === journeyTotal - 1}
            aria-label="Turn to the next chapter"
          ><span>{current === journeyTotal - 1 ? "The end" : "Turn page"}</span><ArrowRight /></button>
        </>
      )}

      {turn && (
        <motion.div
          key={`${turn.from}-${turn.to}`}
          className={`journey-turn-sheet ${forward ? "turn-forward" : "turn-backward"} ${coverTurn ? "turn-cover" : ""}`}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: forward ? -180 : 180 }}
          transition={{ duration: reducedMotion ? .01 : opening || closing ? 1.22 : .92, ease: [.64, .02, .35, 1] }}
          onAnimationComplete={onTurnComplete}
        >
          <div className="journey-turn-face journey-turn-front">
            {coverTurn && turn.from === 0 ? <CoverFace /> : forward ? <PageImage spread={fromSpread ?? toSpread} side="turn" /> : <PageText spread={fromSpread ?? toSpread} side="turn" />}
          </div>
          <div className="journey-turn-face journey-turn-back">
            {coverTurn && turn.to === 0 ? <CoverFace /> : forward ? <PageText spread={toSpread} side="turn" /> : <PageImage spread={toSpread} side="turn" />}
          </div>
          <div className="journey-turn-fold" aria-hidden="true" />
          <div className="journey-turn-edge" aria-hidden="true" />
        </motion.div>
      )}
    </motion.div>
  );
}

function ClosedCover({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button onClick={onOpen} initial={{ opacity: 0, x: -110, y: 40, scale: .78, rotateX: 14, rotateZ: -4 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0 }} transition={{ type: "spring", stiffness: 68, damping: 18, mass: 1.05 }} whileHover={{ y: -7, rotateY: -2, rotateZ: -.5, scale: 1.012 }} whileTap={{ scale: .975, rotateX: 2 }} className="journey-cover-closed" aria-label="Open the Paper Journey book">
      <CoverFace />
      <span className="journey-cover-spine" />
      <span className="journey-cover-pages" />
      <motion.span className="journey-cover-glint" animate={{ x: ["-180%", "220%"] }} transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 7.5, ease: "easeInOut" }} />
    </motion.button>
  );
}

function CoverFace() {
  return (
    <div className="journey-cover-face">
      <Image src="/images/journey/spreads-v2/cover.jpg" alt="Leather-bound storybook in a forest" fill sizes="(max-width: 768px) 78vw, 480px" priority className="object-cover" />
      <div className="journey-cover-corners" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="journey-cover-overlay"><small>Paper Foundation India</small><b>SOURCE · FIBRE · SHEET · RETURN</b><strong>How Paper<br />Is Made.</strong><span>The whole truth needs the whole journey</span><em>Open the book</em></div>
    </div>
  );
}

function PageText({ spread, side }: { spread: JourneySpread; side: "left" | "turn" }) {
  return (
    <article className={`journey-page-paper journey-page-text journey-page-${side}`} style={{ "--journey-accent": spread.accent } as CSSProperties}>
      <div className="journey-page-border" />
      <div className="journey-page-heading"><p className="journey-chapter">{spread.chapter}</p><span>{spread.processStep}</span></div>
      <span className="journey-page-rule" />
      <h2>{spread.title}</h2>
      <div className="journey-page-body">{spread.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {side === "left" ? <JourneyPageInteraction key={spread.id} spread={spread} /> : spread.stat && <div className="journey-stat"><strong>{spread.stat}</strong><span>{spread.statLabel}</span></div>}
      <footer><span>Paper Foundation India</span><span>{String(spread.id).padStart(2, "0")}</span></footer>
    </article>
  );
}

function JourneyPageInteraction({ spread }: { spread: JourneySpread }) {
  const stop = (event: { stopPropagation: () => void }) => event.stopPropagation();

  if (spread.id === 1) return <BlankPagePlay onStop={stop} />;
  if (spread.id === 2) return <SourceLens onStop={stop} />;
  if (spread.id === 3) return <SortFibre onStop={stop} />;
  if (spread.id === 4) return <PulpMixer onStop={stop} />;
  if (spread.id === 5) return <CleaningCascade onStop={stop} />;
  if (spread.id === 6) return <DeinkLab onStop={stop} />;
  if (spread.id === 7) return <FibreBondLab onStop={stop} />;
  if (spread.id === 8) return <SheetFormer onStop={stop} />;
  if (spread.id === 9) return <MillScrubber onStop={stop} />;
  if (spread.id === 10) return <ProductDial onStop={stop} />;
  if (spread.id === 11) return <KnowledgeStamp onStop={stop} />;
  return <FinalPledge onStop={stop} />;
}

type StopProps = { onStop: (event: { stopPropagation: () => void }) => void };

function BlankPagePlay({ onStop }: StopProps) {
  const [mark, setMark] = useState(0);
  const words = ["idea", "lesson", "promise", "story"];
  return <div className="journey-page-widget widget-blank" onPointerDown={onStop} onPointerUp={onStop}><button onClick={(event) => { onStop(event); setMark((value) => (value + 1) % words.length); }}><PenLine /> Touch the blank page</button><motion.strong key={mark} initial={{ opacity: 0, scale: .4, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -3 }}>{words[mark]}</motion.strong></div>;
}

function SortFibre({ onStop }: StopProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const correct = choice === "clean";
  return <div className="journey-page-widget widget-sort" onPointerDown={onStop} onPointerUp={onStop}><p>Which one protects the fibre?</p><div><button onClick={(event) => { onStop(event); setChoice("clean"); }} className={choice === "clean" ? "is-picked" : ""}>Clean + dry</button><button onClick={(event) => { onStop(event); setChoice("food"); }} className={choice === "food" ? "is-picked" : ""}>Food-stained</button></div>{choice && <span className={correct ? "is-good" : "is-nope"}>{correct ? <Check /> : <X />}{correct ? "Ready to recover" : "Contamination breaks the route"}</span>}</div>;
}

function PulpMixer({ onStop }: StopProps) {
  const [mixed, setMixed] = useState(18);
  return <div className="journey-page-widget widget-pulp" onPointerDown={onStop} onPointerUp={onStop}><div className="pulp-vessel"><motion.i animate={{ rotate: mixed * 3.6 }} /><b style={{ transform: `scale(${.55 + mixed / 220})` }} /></div><label>Loosen the sheet <input aria-label="Mix paper into pulp" type="range" min="0" max="100" value={mixed} onChange={(event) => setMixed(Number(event.target.value))} /></label><span>{mixed > 76 ? "Fibres released" : "Add water + motion"}</span></div>;
}

function CleaningCascade({ onStop }: StopProps) {
  const stages = ["Screen", "Clean", "Inspect"];
  const [stage, setStage] = useState(0);
  return <div className="journey-page-widget widget-cleaning" onPointerDown={onStop} onPointerUp={onStop}><div className="cleaning-stream">{stages.map((item,index)=><button key={item} className={index<=stage?"is-active":""} onClick={(event)=>{onStop(event);setStage(index);}}><i />{item}</button>)}</div><motion.p key={stage} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}>{stage===0?"Separate by size and shape.":stage===1?"Remove grit and dense contaminants.":"Check the furnish before it moves on."}</motion.p></div>;
}

function DeinkLab({ onStop }: StopProps) {
  const [active, setActive] = useState(false);
  return <div className="journey-page-widget widget-deink" onPointerDown={onStop} onPointerUp={onStop}><button aria-pressed={active} onClick={(event)=>{onStop(event);setActive(value=>!value);}}><span><motion.i animate={{y:active?-19:0,opacity:active ? .25 : 1}} /><motion.i animate={{y:active?-13:0,opacity:active ? .2 : 1}} /><motion.i animate={{y:active?-23:0,opacity:active ? .3 : 1}} /></span><b>{active?"Ink lifted":"Printed furnish"}</b></button><p>{active?"Detached ink follows air bubbles away.":"Use this route only when the next grade needs it."}</p></div>;
}

function FibreBondLab({ onStop }: StopProps) {
  const [refined, setRefined] = useState(35);
  return <div className="journey-page-widget widget-bond" onPointerDown={onStop} onPointerUp={onStop}><div className="bond-fibres"><motion.i animate={{rotate:-12-refined/12,x:refined/16}}/><motion.i animate={{rotate:18+refined/15,x:-refined/18}}/><motion.i animate={{rotate:-2,y:refined/28}}/></div><label>Refining level <input type="range" min="0" max="100" value={refined} onChange={(event)=>setRefined(Number(event.target.value))}/></label><span>{refined<30?"Fibres need more contact":refined>78?"Too much treatment can slow drainage":"Bonding surface developing"}</span></div>;
}

function SheetFormer({ onStop }: StopProps) {
  const [flow, setFlow] = useState(22);
  return <div className="journey-page-widget widget-former" onPointerDown={onStop} onPointerUp={onStop}><div><motion.span style={{width:`${Math.max(18,flow)}%`}} /><i /></div><label>Open the fibre flow <input type="range" min="18" max="100" value={flow} onChange={(event)=>setFlow(Number(event.target.value))}/></label><strong>{flow>78?"A continuous wet web appears":"Furnish meets the forming fabric"}</strong></div>;
}

function SourceLens({ onStop }: StopProps) {
  const [responsible, setResponsible] = useState(true);
  return <div className="journey-page-widget widget-source" onPointerDown={onStop} onPointerUp={onStop}><button onClick={(event) => { onStop(event); setResponsible((value) => !value); }} aria-pressed={responsible}><motion.span animate={{ x: responsible ? 34 : 0 }}><Trees /></motion.span></button><div><strong>{responsible ? "Source verified" : "Source unknown"}</strong><span>{responsible ? "Management evidence changes the answer." : "A tree claim without sourcing is incomplete."}</span></div></div>;
}

function MillScrubber({ onStop }: StopProps) {
  const stages = ["Drain", "Press", "Dry", "Finish"];
  const [stage, setStage] = useState(0);
  return <div className="journey-page-widget widget-mill" onPointerDown={onStop} onPointerUp={onStop}><div>{stages.map((item, index) => <button key={item} onClick={(event) => { onStop(event); setStage(index); }} className={index <= stage ? "is-active" : ""}>{index + 1}</button>)}</div><motion.span key={stage} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}><Factory /> {stages[stage]} the sheet</motion.span></div>;
}

function ProductDial({ onStop }: StopProps) {
  const products = ["Notebook", "Carton", "Tissue"];
  const [product, setProduct] = useState(0);
  return <div className="journey-page-widget widget-products" onPointerDown={onStop} onPointerUp={onStop}><motion.div animate={{ rotate: product * 120 }}><span /><span /><span /></motion.div><div>{products.map((item, index) => <button key={item} onClick={(event) => { onStop(event); setProduct(index); }} className={product === index ? "is-active" : ""}>{item}</button>)}</div><p>{product === 0 ? "Smooth + durable" : product === 1 ? "Strong + foldable" : "Soft + absorbent"}</p></div>;
}

function KnowledgeStamp({ onStop }: StopProps) {
  const [stamped, setStamped] = useState(false);
  return <div className="journey-page-widget widget-knowledge" onPointerDown={onStop} onPointerUp={onStop}><button onClick={(event) => { onStop(event); setStamped(true); }}><motion.span animate={stamped ? { y: [0, 8, -2, 0], scale: [1, .92, 1.04, 1] } : undefined}><PenLine /></motion.span>Press an idea into paper</button><AnimatePresence>{stamped && <motion.strong initial={{ opacity: 0, scale: 1.6, rotate: 9 }} animate={{ opacity: 1, scale: 1, rotate: -3 }}>REMEMBERED</motion.strong>}</AnimatePresence></div>;
}

function FinalPledge({ onStop }: StopProps) {
  const [pledges, setPledges] = useState<string[]>([]);
  const options = ["Source", "Use well", "Recover"];
  return <div className="journey-page-widget widget-pledge" onPointerDown={onStop} onPointerUp={onStop}><p>Build the next life:</p><div>{options.map((item) => <button key={item} onClick={(event) => { onStop(event); setPledges((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]); }} className={pledges.includes(item) ? "is-active" : ""}>{pledges.includes(item) ? <Check /> : <Leaf />}{item}</button>)}</div>{pledges.length === 3 && <motion.strong initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Sparkles /> The loop continues.</motion.strong>}</div>;
}

function PageImage({ spread, side }: { spread: JourneySpread; side: "right" | "turn" }) {
  const specified = spread.images?.length ? spread.images : [{ src: spread.image, alt: spread.title }];
  const images = specified;
  return (
    <div className={`journey-page-paper journey-page-image journey-page-${side} ${spread.id === journeySpreads.length ? "journey-final-page" : ""}`}>
      <div className={`journey-image-gallery gallery-count-${Math.min(images.length,3)}`}>{images.slice(0,3).map((image,index)=><div key={`${image.src}-${index}`} className={`journey-gallery-shot shot-${index+1}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 44vw, 520px" priority={spread.id <= 2 && index===0} /></div>)}</div>
      <div className="journey-image-wash" />
      <div className="journey-image-life" aria-hidden="true"><motion.i animate={{ y: [0, -13, 0], rotate: [8, 18, 8] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }} /><motion.i animate={{ y: [0, 11, 0], x: [0, -7, 0], rotate: [-18, -4, -18] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }} /><span /></div>
      <div className="journey-image-caption"><small>{spread.eyebrow}</small><strong>{images[0]?.caption ?? spread.title}</strong></div>
      {spread.id === journeySpreads.length && <div className="journey-back-mark"><span>PFI</span><p>Love paper.<br />Use paper responsibly.</p><small>Hyderabad · 2026</small></div>}
    </div>
  );
}
