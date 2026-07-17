"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, Leaf, Recycle, Trees } from "lucide-react";
import { useCallback, useState, type CSSProperties } from "react";
import InteractiveBook, { type BookPage } from "@/components/ui/interactive-book";
import { journeySpreads, type JourneySpread } from "./journeyData";
import styles from "./JourneySaga.module.css";

const journeyPages: BookPage[] = journeySpreads.map((spread, index) => {
  const nextSpread = journeySpreads[index + 1];

  return {
    pageNumber: spread.id,
    content: <ProcessVisual spread={spread} />,
    backContent: nextSpread ? <ProcessNotes spread={nextSpread} /> : <ClosingPage />,
  };
});

export default function JourneySaga() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [requestedPage, setRequestedPage] = useState<number>();
  const updateChapter = useCallback((pageIndex: number) => {
    setActiveChapter(Math.min(Math.max(pageIndex + 1, 0), journeySpreads.length - 1));
  }, []);
  const active = journeySpreads[activeChapter];

  return (
    <div className={styles.page}>
      <section className={styles.stage} aria-labelledby="journey-title">
        <div className={styles.atmosphere} aria-hidden="true"><i /><i /><i /></div>

        <div className={styles.intro}>
          <p className={styles.kicker}><BookOpen /> The Paper Journey · Field book</p>
          <h1 id="journey-title">See how a sheet <em>really</em> takes form.</h1>
          <p className={styles.lede}>
            Open the book and follow fibre through sourcing, preparation, formation,
            use and recovery. Every chapter names the decision—not just the machinery.
          </p>
          <div className={styles.activeChapter} style={{ "--chapter-accent": active.accent } as CSSProperties}>
            <span>{String(active.id).padStart(2, "0")} / {String(journeySpreads.length).padStart(2, "0")}</span>
            <div><small>{active.processStep}</small><strong>{active.title}</strong></div>
          </div>
          <div className={styles.instructions}>
            <span>Click the cover to open</span><i />
            <span>Click a right page to turn</span><i />
            <span>Use arrows or keyboard</span>
          </div>
        </div>

        <div className={styles.bookWindow}>
          <InteractiveBook
            coverImage="/images/journey/paper-journey-cover.svg"
            bookTitle="The Paper Journey"
            bookAuthor="Paper Foundation India"
            pages={journeyPages}
            width={430}
            height={600}
            className={styles.book}
            insideCoverContent={<ProcessNotes spread={journeySpreads[0]} />}
            onPageChange={updateChapter}
            requestedPageIndex={requestedPage}
          />
        </div>

        <div className={styles.chapterRail} aria-label="Paper-making chapters">
          {journeySpreads.map((spread, index) => (
            <button
              type="button"
              key={spread.id}
              className={index === activeChapter ? styles.isActive : ""}
              style={{ "--chapter-accent": spread.accent } as CSSProperties}
              aria-label={`${spread.processStep}: ${spread.title}`}
              onClick={() => setRequestedPage(index - 1)}
            >
              <span>{String(spread.id).padStart(2, "0")}</span>
              <strong>{spread.processStep}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.afterword}>
        <div>
          <p>Close the book. Keep the loop open.</p>
          <h2>A useful sheet deserves a thoughtful next life.</h2>
        </div>
        <nav>
          <Link href="/circularity"><Recycle /> Explore circularity <ArrowRight /></Link>
          <Link href="/myths"><Leaf /> Check paper myths <ArrowRight /></Link>
          <a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer"><Trees /> FAO forest guidance <ExternalLink /></a>
        </nav>
      </section>
    </div>
  );
}

function ProcessNotes({ spread }: { spread: JourneySpread }) {
  return (
    <article className={styles.notes} style={{ "--chapter-accent": spread.accent } as CSSProperties}>
      <header><span>{spread.chapter}</span><small>{spread.processStep}</small></header>
      <i />
      <h2>{spread.title}</h2>
      <div>{spread.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {spread.stat && <footer><strong>{spread.stat}</strong><span>{spread.statLabel}</span></footer>}
    </article>
  );
}

function ProcessVisual({ spread }: { spread: JourneySpread }) {
  const images = spread.images.slice(0, Math.min(3, spread.images.length));
  return (
    <article className={styles.visual} style={{ "--chapter-accent": spread.accent } as CSSProperties}>
      <div className={`${styles.gallery} ${styles[`gallery${images.length}`]}`}>
        {images.map((image, index) => (
          <figure key={`${image.src}-${index}`} className={styles[`shot${index + 1}`]}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 700px) 42vw, 350px"
              priority={spread.id < 2}
            />
          </figure>
        ))}
        <div className={styles.imageWash} />
        <span className={styles.imageNumber}>{String(spread.id).padStart(2, "0")}</span>
      </div>
      <div className={styles.visualCaption}>
        <small>{spread.eyebrow}</small>
        <strong>{spread.images[0]?.caption ?? spread.title}</strong>
        <span>Turn the page <ArrowRight /></span>
      </div>
    </article>
  );
}

function ClosingPage() {
  return (
    <article className={styles.closing}>
      <Recycle />
      <small>The next chapter is shared</small>
      <h2>Keep the fibre useful.</h2>
      <p>Source responsibly. Design for purpose. Keep suitable used paper clean, separate and moving toward recovery.</p>
      <Link href="/circularity">Continue into circularity <ArrowRight /></Link>
    </article>
  );
}
