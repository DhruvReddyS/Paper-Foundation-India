import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ExternalLink, FileCheck2, MapPin, Recycle, ScanSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaperEverywhereObject, paperEverywhereObjects } from "@/content/paperEverywhere";
import styles from "./PaperObject.module.css";

export function generateStaticParams() {
  return paperEverywhereObjects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPaperEverywhereObject(slug);
  return item ? {
    title: `${item.title} | Paper Everywhere`,
    description: item.thesis,
  } : {};
}

export default async function PaperObjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPaperEverywhereObject(slug);
  if (!item) notFound();

  const index = paperEverywhereObjects.findIndex((entry) => entry.slug === item.slug);
  const previous = paperEverywhereObjects[(index - 1 + paperEverywhereObjects.length) % paperEverywhereObjects.length];
  const next = paperEverywhereObjects[(index + 1) % paperEverywhereObjects.length];

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/everyday-paper"><ArrowLeft /> All object files</Link>
        <span>Paper Everywhere / {item.number} of {paperEverywhereObjects.length.toString().padStart(2, "0")}</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>{item.category} / evidence dossier</p>
          <h1>{item.title}</h1>
          <strong>{item.thesis}</strong>
          <span>{item.introduction}</span>
        </div>
        <figure>
          <Image src={item.image} alt={item.alt} fill priority sizes="(max-width: 900px) 100vw, 52vw" />
          <figcaption>OBJECT RECORD / {item.number}</figcaption>
        </figure>
      </section>

      <section className={styles.figureBand} aria-label="Verified figure">
        <span>Verified figure</span>
        <strong>{item.figure}</strong>
        <div>
          <h2>{item.figureLabel}</h2>
          <p>{item.figureContext}</p>
        </div>
        <a href={item.source.url} target="_blank" rel="noreferrer">
          Inspect source <ExternalLink />
        </a>
      </section>

      <section className={styles.anatomy}>
        <header>
          <p>Read the object in three passes</p>
          <h2>Material. Job. Next route.</h2>
        </header>
        <div className={styles.columns}>
          <article>
            <span>01</span><ScanSearch />
            <h3>Material anatomy</h3>
            <ul>{item.material.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
          <article>
            <span>02</span><FileCheck2 />
            <h3>What it must do</h3>
            <ul>{item.job.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
          <article>
            <span>03</span><Recycle />
            <h3>After use</h3>
            <ul>{item.afterUse.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className={styles.evidence}>
        <div className={styles.caution}>
          <span>Evidence check</span>
          <h2>What this source does not prove.</h2>
          <p>{item.evidenceCheck}</p>
        </div>
        <article>
          <p>Primary source record</p>
          <strong>{item.source.organisation}</strong>
          <h3>{item.source.title}</h3>
          <dl>
            <div><dt>Published</dt><dd>{item.source.year}</dd></div>
            <div><dt>Location</dt><dd><MapPin /> Scope stated in the figure note</dd></div>
            <div><dt>Reference</dt><dd>{item.source.note}</dd></div>
          </dl>
          <a href={item.source.url} target="_blank" rel="noreferrer">Open original record <ExternalLink /></a>
        </article>
      </section>

      <nav className={styles.nextFiles} aria-label="Adjacent object files">
        <Link href={`/everyday-paper/${previous.slug}`}><ArrowLeft /><span>Previous file<small>{previous.title}</small></span></Link>
        <Link href={`/everyday-paper/${next.slug}`}><span>Next file<small>{next.title}</small></span><ArrowRight /></Link>
      </nav>
    </main>
  );
}
