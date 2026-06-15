"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, Droplets, ExternalLink, Factory, Leaf, PauseCircle, PenLine, PlayCircle, Recycle, RotateCcw, Sparkles, Trees, X } from "lucide-react";
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
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    touchStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (!touchStart.current || turn) return;
    const dx = event.clientX - touchStart.current.x;
    const dy = event.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return;
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
  }

  function resetPointer() {
    stageRef.current?.style.setProperty("--journey-pointer-x", "0");
    stageRef.current?.style.setProperty("--journey-pointer-y", "0");
  }

  const visiblePage = turn ? turn.to : current;
  const currentSpread = current > 0 ? journeySpreads[current - 1] : null;

  return (
    <main className="journey-page">
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
      >
        <div className="journey-forest" />
        <JourneyAtmosphere reducedMotion={Boolean(prefersReducedMotion)} />
        <div className="journey-vignette" />

        <header className="journey-overlay-header">
          <Link href="/" className="journey-brand-mark" aria-label="Exit journey and return home"><span /><div><small>Paper Foundation India · Exit</small><strong>One Sheet. Many Lives.</strong></div></Link>
          <div className="journey-counter"><small>Chapter</small><strong>{String(visiblePage).padStart(2, "0")}<span> / {String(journeyTotal - 1).padStart(2, "0")}</span></strong></div>
        </header>

        <div className="journey-book-stage">
          <div className="journey-book-rig">
            <BookView current={current} turn={turn} onOpen={openBook} onTurnComplete={finishTurn} reducedMotion={Boolean(prefersReducedMotion)} />
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

        <AnimatePresence>
          {helpOpen && current === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="journey-help">
              <BookOpen /><p><strong>Open the story</strong><span>Scroll, swipe, use arrow keys, or tap the controls.</span></p><button onClick={openBook}>Begin <ArrowRight /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sr-only" aria-live="polite">{current === 0 ? "Journey cover" : `${currentSpread?.chapter}: ${currentSpread?.title}`}</div>
      </section>

      <section className="journey-evidence-footer">
        <div>
          <p>Continue beyond the story</p>
          <h2>The cycle works when evidence guides every choice.</h2>
        </div>
        <div className="journey-evidence-links">
          <Link href="/circularity">Explore circularity <ArrowRight /></Link>
          <Link href="/myths">Check paper myths <ArrowRight /></Link>
          <a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer">FAO forest guidance <ExternalLink /></a>
        </div>
      </section>
    </main>
  );
}

function BookView({ current, turn, onOpen, onTurnComplete, reducedMotion }: { current: number; turn: Turn; onOpen: () => void; onTurnComplete: () => void; reducedMotion: boolean }) {
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
      initial={opening ? { opacity: 0, scale: .48, x: -120, y: 70, rotateX: 18, rotateZ: -4 } : { opacity: 0, scale: .92, y: 18 }}
      animate={closing ? { opacity: .94, scale: .58, x: -80, y: 58, rotateX: 12, rotateZ: -4 } : { opacity: 1, scale: turn ? 1.035 : 1, x: 0, y: 0, rotateX: 0, rotateZ: 0 }}
      transition={reducedMotion ? { duration: .01 } : { duration: opening || closing ? 1.25 : .72, ease: [.2, .75, .16, 1] }}
      className={`journey-book-open ${opening ? "is-opening" : ""} ${closing ? "is-closing" : ""}`}
    >
      <div className="journey-book-shadow" />
      <div className="journey-page-stack journey-stack-left" />
      <div className="journey-page-stack journey-stack-right" />
      <PageText spread={leftBase} side="left" />
      <PageImage spread={rightBase} side="right" />
      <div className="journey-gutter" />

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
        </motion.div>
      )}
    </motion.div>
  );
}

function ClosedCover({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button onClick={onOpen} initial={{ opacity: 0, x: -150, y: 55, scale: .72, rotateX: 20, rotateZ: -7 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0 }} transition={{ type: "spring", stiffness: 72, damping: 16, mass: 1.15 }} whileHover={{ y: -10, rotateZ: -1.2, scale: 1.025 }} whileTap={{ scale: .96, rotateX: 4 }} className="journey-cover-closed" aria-label="Open the Paper Journey book">
      <CoverFace />
      <span className="journey-cover-pages" />
      <motion.span className="journey-cover-glint" animate={{ x: ["-180%", "220%"] }} transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }} />
    </motion.button>
  );
}

function CoverFace() {
  return (
    <div className="journey-cover-face">
      <Image src="/images/journey/spreads/cover.jpg" alt="Leather-bound storybook in a forest" fill sizes="(max-width: 768px) 78vw, 480px" priority className="object-cover" />
      <div className="journey-cover-overlay"><small>Paper Foundation India</small><strong>One Sheet.<br />Many Lives.</strong><span>An interactive paper journey</span></div>
    </div>
  );
}

function PageText({ spread, side }: { spread: JourneySpread; side: "left" | "turn" }) {
  return (
    <article className={`journey-page-paper journey-page-text journey-page-${side}`} style={{ "--journey-accent": spread.accent } as CSSProperties}>
      <div className="journey-page-border" />
      <p className="journey-chapter">{spread.chapter}</p>
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
  if (spread.id === 2) return <RecoveryLoop onStop={stop} />;
  if (spread.id === 3) return <SortFibre onStop={stop} />;
  if (spread.id === 4) return <PulpMixer onStop={stop} />;
  if (spread.id === 5) return <SourceLens onStop={stop} />;
  if (spread.id === 6) return <FibreBalance onStop={stop} />;
  if (spread.id === 7) return <MillScrubber onStop={stop} />;
  if (spread.id === 8) return <ProductDial onStop={stop} />;
  if (spread.id === 9) return <KnowledgeStamp onStop={stop} />;
  if (spread.id === 10) return <RecoveryChoice onStop={stop} />;
  return <FinalPledge onStop={stop} />;
}

type StopProps = { onStop: (event: { stopPropagation: () => void }) => void };

function BlankPagePlay({ onStop }: StopProps) {
  const [mark, setMark] = useState(0);
  const words = ["idea", "lesson", "promise", "story"];
  return <div className="journey-page-widget widget-blank" onPointerDown={onStop} onPointerUp={onStop}><button onClick={(event) => { onStop(event); setMark((value) => (value + 1) % words.length); }}><PenLine /> Touch the blank page</button><motion.strong key={mark} initial={{ opacity: 0, scale: .4, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -3 }}>{words[mark]}</motion.strong></div>;
}

function RecoveryLoop({ onStop }: StopProps) {
  const [returned, setReturned] = useState(false);
  return <div className="journey-page-widget widget-recovery" onPointerDown={onStop} onPointerUp={onStop}><button onClick={(event) => { onStop(event); setReturned((value) => !value); }}><motion.span animate={{ rotate: returned ? 360 : 0 }}><Recycle /></motion.span>{returned ? "Fibre is back in the loop" : "Return this used sheet"}</button><i className={returned ? "is-returned" : ""} /></div>;
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

function SourceLens({ onStop }: StopProps) {
  const [responsible, setResponsible] = useState(true);
  return <div className="journey-page-widget widget-source" onPointerDown={onStop} onPointerUp={onStop}><button onClick={(event) => { onStop(event); setResponsible((value) => !value); }} aria-pressed={responsible}><motion.span animate={{ x: responsible ? 34 : 0 }}><Trees /></motion.span></button><div><strong>{responsible ? "Source verified" : "Source unknown"}</strong><span>{responsible ? "Management evidence changes the answer." : "A tree claim without sourcing is incomplete."}</span></div></div>;
}

function FibreBalance({ onStop }: StopProps) {
  const [recovered, setRecovered] = useState(75);
  const [message, setMessage] = useState("A broad Indian fibre mix is led by recovered paper.");
  useEffect(() => {
    if (recovered === 75) return;
    setMessage(recovered > 75 ? "More recovered? Good instinct—but fibres shorten. Fresh fibre replenishes the loop." : "More fresh fibre can add strength, while recovery keeps useful material circulating.");
    const timer = window.setTimeout(() => {
      setRecovered(75);
      setMessage("Back to the broad 75 / 25 reference mix—not a universal recipe for every paper grade.");
    }, 720);
    return () => window.clearTimeout(timer);
  }, [recovered]);
  return <div className="journey-page-widget widget-balance" onPointerDown={onStop} onPointerUp={onStop}><div className="balance-numbers"><strong>{recovered}%<small>recovered</small></strong><strong>{100 - recovered}%<small>fresh</small></strong></div><div className="balance-control"><button aria-label="Use less recovered fibre" onClick={(event) => { onStop(event); setRecovered((value) => Math.max(35, value - 10)); }}>−</button><input aria-label="Explore recovered and fresh fibre balance" type="range" min="35" max="95" value={recovered} onChange={(event) => setRecovered(Number(event.target.value))} /><button aria-label="Use more recovered fibre" onClick={(event) => { onStop(event); setRecovered((value) => Math.min(95, value + 10)); }}>+</button></div><motion.p key={message} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>{message}</motion.p></div>;
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

function RecoveryChoice({ onStop }: StopProps) {
  const [choice, setChoice] = useState<"clean" | "dirty" | null>(null);
  return <div className="journey-page-widget widget-choice" onPointerDown={onStop} onPointerUp={onStop}><div><button onClick={(event) => { onStop(event); setChoice("clean"); }}><Recycle /> Clean + dry</button><button onClick={(event) => { onStop(event); setChoice("dirty"); }}><Droplets /> Wet + soiled</button></div>{choice && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{choice === "clean" ? "The mill route stays open." : "This fibre may be lost from recovery."}</motion.p>}</div>;
}

function FinalPledge({ onStop }: StopProps) {
  const [pledges, setPledges] = useState<string[]>([]);
  const options = ["Source", "Use well", "Recover"];
  return <div className="journey-page-widget widget-pledge" onPointerDown={onStop} onPointerUp={onStop}><p>Build the next life:</p><div>{options.map((item) => <button key={item} onClick={(event) => { onStop(event); setPledges((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]); }} className={pledges.includes(item) ? "is-active" : ""}>{pledges.includes(item) ? <Check /> : <Leaf />}{item}</button>)}</div>{pledges.length === 3 && <motion.strong initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Sparkles /> The loop continues.</motion.strong>}</div>;
}

function PageImage({ spread, side }: { spread: JourneySpread; side: "right" | "turn" }) {
  return (
    <div className={`journey-page-paper journey-page-image journey-page-${side}`}>
      <Image src={spread.image} alt={spread.title} fill sizes="(max-width: 768px) 44vw, 520px" priority={spread.id <= 2} className="object-cover" />
      <div className="journey-image-wash" />
      <div className="journey-image-life" aria-hidden="true"><motion.i animate={{ y: [0, -13, 0], rotate: [8, 18, 8] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }} /><motion.i animate={{ y: [0, 11, 0], x: [0, -7, 0], rotate: [-18, -4, -18] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }} /><span /></div>
      <div className="journey-image-caption"><small>{spread.chapter}</small><strong>{spread.title}</strong></div>
    </div>
  );
}
