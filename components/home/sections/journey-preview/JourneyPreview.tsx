"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import InteractiveBook, { type BookPage } from "@/components/ui/interactive-book";
import styles from "./JourneyPreview.module.css";

const previewPages: BookPage[] = [
  {
    pageNumber: 1,
    title: "Source + recover",
    content: <div className={styles.previewPage}><Image src="/images/journey/spreads-v2/spread5.jpg" alt="Managed fibre landscape" fill sizes="290px" /><span>Fresh and recovered fibre enter through different routes.</span></div>,
    backContent: <div className={styles.previewNote}><small>01 / SOURCE</small><strong>Start with evidence.</strong><p>Traceability, landscape management and clean recovery shape what a fibre can become.</p></div>,
  },
  {
    pageNumber: 2,
    title: "Pulp + clean",
    content: <div className={styles.previewPage}><Image src="/images/journey/spreads-v2/spread4.jpg" alt="Paper mill pulper" fill sizes="290px" /><span>Water and motion release the old sheet into usable fibre.</span></div>,
    backContent: <div className={styles.previewNote}><small>02 / PREPARE</small><strong>Remove what does not belong.</strong><p>Screens and cleaners protect the furnish before the sheet is formed again.</p></div>,
  },
  {
    pageNumber: 3,
    title: "Form + finish",
    content: <div className={styles.previewPage}><Image src="/images/journey/spreads-v2/spread6.jpg" alt="Papermaking process inspection" fill sizes="290px" /><span>A dilute flow becomes a continuous, useful web.</span></div>,
    backContent: <div className={styles.previewNote}><small>03 / MAKE</small><strong>Pressure first. Controlled heat next.</strong><p>The tour explains each decision without pretending every grade uses one recipe.</p></div>,
  },
  {
    pageNumber: 4,
    title: "Continue the journey",
    content: <div className={styles.previewFinish}><BookOpen /><strong>Ready for the full field book?</strong><Link href="/journey">Enter all 12 chapters <ArrowRight /></Link></div>,
  },
];

export default function JourneyPreview() {
  return <section className={styles.section} aria-labelledby="journey-home-title">
    <div className={styles.copy} data-reveal="left"><p>Paper Journey</p><h2 id="journey-home-title">How is paper really made? <em>Take the full tour.</em></h2><span>Open a thick field book and follow fibre from source to sheet, use and return. Each chapter explains one decision—and why the whole truth needs the whole journey.</span><Link href="/journey">Open the interactive book <BookOpen /><ArrowRight /></Link></div>
    <div className={styles.bookStage} data-reveal="right">
      <InteractiveBook
        coverImage="/images/journey/spreads-v2/cover.jpg"
        bookTitle="The Paper Journey"
        bookAuthor="Paper Foundation India"
        pages={previewPages}
        width={290}
        height={410}
        className={styles.interactiveBook}
      />
      <div className={styles.bookNote}><BookOpen /><small>A field book with weight</small><strong>Open it. Turn it. Follow it.</strong><p>The cover now opens into a real preview before the full journey.</p></div>
    </div>
  </section>;
}
