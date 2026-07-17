"use client";

import Image from "next/image";
import EverydayGrid from "./sections/EverydayGrid";
import PaperFeatureExplorer from "@/components/editorial/PaperFeatureExplorer";
import styles from "../paper-everywhere-pages.module.css";

export default function EverydayPaperPage() {
  return (
    <main className="min-h-screen">
      <section className={styles.page}>
        <div className={styles.mast}>
          <div><p>Everyday paper / object atlas</p><h1>The quiet material doing loud work.</h1></div>
          <p>Look past the surface. A notebook carries memory, a carton protects a journey and a label makes an object legible.</p>
          <div className={styles.photoLedger} aria-hidden="true">
            <figure><Image src="/images/everyday/learning-in-paper.jpg" alt="" fill sizes="42vw" /></figure>
            <figure><Image src="/images/everyday/business-in-paper.jpg" alt="" fill sizes="32vw" /></figure>
            <span>OBJECT FILE / 01—09</span>
          </div>
        </div>
      </section>
      <PaperFeatureExplorer />
      <div id="everyday-atlas"><EverydayGrid /></div>
    </main>
  );
}
