"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoveHorizontal,
  MousePointer2,
  Rotate3D,
  RotateCcw,
  X,
  ZoomIn,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { articleCoverImage, featuredArticles } from "@/content/articleCatalog";
import styles from "./featured-shelf/FeaturedShelfExperience.module.css";

const FeaturedShelfScene = dynamic(() => import("./featured-shelf/FeaturedShelfScene"), {
  ssr: false,
  loading: () => <div aria-live="polite">Preparing the reading room…</div>,
});

export default function FeaturedArticlesExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inspected, setInspected] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const wheel = useRef({ total: 0, direction: 0, lastMove: 0 });
  const drag = useRef({ active: false, startX: 0, startIndex: 0, lastStep: 0 });
  const current = featuredArticles[activeIndex];

  const move = useCallback((direction: number) => {
    setInspected(false);
    setActiveIndex((index) => Math.max(0, Math.min(featuredArticles.length - 1, index + direction)));
  }, []);

  const activate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const inspect = useCallback((index: number) => {
    setActiveIndex(index);
    setInspected(true);
    setResetSignal((signal) => signal + 1);
  }, []);

  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (event.key === "Escape" && inspected) {
        event.preventDefault();
        setInspected(false);
      }
      if (event.key === "Enter" && !inspected) {
        event.preventDefault();
        inspect(activeIndex);
      }
    }
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [activeIndex, inspect, inspected, move]);

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (inspected) return;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(delta) < 1) return;
    const direction = Math.sign(delta);
    const now = Date.now();
    if (direction !== wheel.current.direction || now - wheel.current.lastMove > 700) {
      wheel.current.total = 0;
      wheel.current.direction = direction;
    }
    wheel.current.total += delta;
    if (Math.abs(wheel.current.total) < 120 || now - wheel.current.lastMove < 380) return;
    wheel.current.total = 0;
    wheel.current.lastMove = now;
    move(direction);
  }

  function beginDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (inspected || event.button !== 0) return;
    drag.current = { active: true, startX: event.clientX, startIndex: activeIndex, lastStep: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function continueDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active || inspected) return;
    const step = Math.trunc((drag.current.startX - event.clientX) / 138);
    if (step === drag.current.lastStep) return;
    drag.current.lastStep = step;
    setActiveIndex(Math.max(0, Math.min(featuredArticles.length - 1, drag.current.startIndex + step)));
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <main className={styles.room}>
      <section className={styles.hero}>
        <header className={styles.masthead}>
          <Link className={styles.back} href="/knowledge"><ArrowLeft /> Knowledge library</Link>
          <div className={styles.mastheadTitle}>
            <p>THE FEATURED READING ROOM / 2026</p>
            <h1>The complete <em>shelf.</em></h1>
          </div>
          <p className={styles.mastheadMeta}>
            Ten clothbound volumes for reading the landscapes, people, mills and recovery routes behind paper.
          </p>
        </header>

        <div
          className={styles.stage}
          role="region"
          aria-label="Interactive shelf of featured articles"
          tabIndex={0}
          onWheel={handleWheel}
          onPointerDown={beginDrag}
          onPointerMove={continueDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <FeaturedShelfScene
            articles={featuredArticles}
            activeIndex={activeIndex}
            inspected={inspected}
            reducedMotion={reducedMotion}
            resetSignal={resetSignal}
            onActivate={activate}
            onInspect={inspect}
            onCloseInspection={() => setInspected(false)}
          />
          <div className={styles.grain} aria-hidden="true" />
          <span className={styles.folio}>Shelf 01 · Essential reads</span>
          <span className={styles.instruction}>
            {inspected ? <><Rotate3D /> Drag the book to inspect</> : <><MoveHorizontal /> Drag or scroll the shelf</>}
          </span>

          <AnimatePresence mode="wait">
            <motion.article
              className={styles.details}
              key={`${current.slug}-${inspected ? "inspection" : "browse"}`}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0 : .38, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <figure className={styles.detailCover}>
                <Image
                  src={articleCoverImage(current)}
                  alt={`Cover artwork for ${current.title}`}
                  fill
                  sizes="(max-width: 720px) calc(100vw - 48px), 360px"
                  priority={activeIndex === 0}
                />
                <span className={styles.detailVolume}>Volume {String(activeIndex + 1).padStart(2, "0")}</span>
                <span className={styles.detailTime}><Clock3 /> {current.time} read</span>
              </figure>
              <div className={styles.detailBody}>
                <div className={styles.detailMeta}>
                  <span>{current.category}</span>
                  <span>Featured article</span>
                </div>
                <h2>{current.title}</h2>
                <p>{current.summary}</p>
                <footer className={styles.detailActions}>
                  <span><BookOpen /> Long-form reading</span>
                  <Link href={`/knowledge/${current.slug}`}>
                    Read article <ArrowRight />
                  </Link>
                </footer>
              </div>
            </motion.article>
          </AnimatePresence>

          {!inspected ? (
            <>
              <nav className={styles.controls} aria-label="Shelf navigation">
                <button className={styles.controlButton} type="button" onClick={() => move(-1)} disabled={activeIndex === 0}>
                  <ChevronLeft /><span>Previous</span>
                </button>
                <span className={styles.counter}>{String(activeIndex + 1).padStart(2, "0")} / {String(featuredArticles.length).padStart(2, "0")}</span>
                <button className={styles.inspectButton} type="button" onClick={() => inspect(activeIndex)}>
                  <BookOpen /> Inspect book
                </button>
                <button className={styles.controlButton} type="button" onClick={() => move(1)} disabled={activeIndex === featuredArticles.length - 1}>
                  <span>Next</span><ChevronRight />
                </button>
              </nav>
              <nav className={styles.markers} aria-label="Choose featured volume">
                {featuredArticles.map((article, index) => (
                  <button
                    type="button"
                    className={`${styles.marker} ${index === activeIndex ? styles.markerActive : ""}`}
                    aria-label={`Volume ${index + 1}: ${article.title}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => activate(index)}
                    key={article.slug}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </nav>
            </>
          ) : (
            <>
              <nav className={styles.controls} aria-label="Book inspection controls">
                <button className={styles.controlButton} type="button" onClick={() => setResetSignal((signal) => signal + 1)}>
                  <RotateCcw /><span>Reset view</span>
                </button>
                <button className={styles.closeButton} type="button" onClick={() => setInspected(false)}>
                  <X /><span>Return to shelf</span>
                </button>
              </nav>
              <div className={styles.inspectHelp} aria-hidden="true">
                <span><MousePointer2 /> Orbit</span>
                <span><MoveHorizontal /> Pan</span>
                <span><ZoomIn /> Zoom</span>
              </div>
            </>
          )}
        </div>
      </section>

      <section className={styles.catalogue} aria-labelledby="featured-catalogue-title">
        <header>
          <div>
            <p>THE READING CATALOGUE</p>
            <h2 id="featured-catalogue-title">Every volume, in one place.</h2>
          </div>
          <p>
            Prefer a direct route? The complete featured collection remains available as a clear editorial index.
          </p>
        </header>
        <div className={styles.catalogueList}>
          {featuredArticles.map((article, index) => (
            <Link className={styles.catalogueItem} href={`/knowledge/${article.slug}`} key={article.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <small>{article.category} · {article.time} read</small>
                <h3>{article.title}</h3>
              </div>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
