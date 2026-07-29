import { ArrowDown, ExternalLink, FileCheck2, MapPin, Scale } from "lucide-react";
import Image from "next/image";
import EverydayGrid from "./sections/EverydayGrid";
import styles from "../paper-everywhere-pages.module.css";

const proofNotes = [
  {
    value: "24.8 crore",
    label: "students",
    scope: "India, UDISE+ 2023 to 2024",
    href: "https://www.education.gov.in/sites/upload_files/mhrd/files/statistics-new/udise_report_nep_23_24.pdf",
  },
  {
    value: "149,809",
    label: "registered publications",
    scope: "PRGI snapshot, 23 May 2026",
    href: "https://egov.rni.nic.in/Webforms/ReportRegdPeriodityWise.aspx",
  },
  {
    value: "9.59%",
    label: "average paper share",
    scope: "CPCB selected-city study",
    href: "https://cpcb.nic.in/uploads/plasticwaste/SOP_PWM_24062024.pdf",
  },
];

export default function EverydayPaperPage() {
  return (
    <main className={styles.everydayPage}>
      <section className={`${styles.page} ${styles.atlasHero}`}>
        <div className={styles.mast}>
          <div>
            <p>Paper Everywhere / evidence atlas</p>
            <h1>Ordinary objects.<br /><em>Extraordinary jobs.</em></h1>
          </div>
          <p>
            Open nine familiar objects and see the fibres, structures, standards and recovery decisions hiding in plain sight.
          </p>
          <a className={styles.atlasJump} href="#everyday-atlas">
            Enter the atlas <ArrowDown />
          </a>
          <div className={styles.photoLedger}>
            <figure><Image src="/images/everyday/learning-in-paper.jpg" alt="A student writing in a notebook" fill sizes="42vw" /></figure>
            <figure><Image src="/images/everyday/business-in-paper.jpg" alt="A corrugated box being packed" fill sizes="32vw" /></figure>
            <span>OBJECT FILES / 01 TO 09</span>
          </div>
        </div>
      </section>

      <section className={styles.proofDesk} aria-labelledby="proof-desk-title">
        <header>
          <div>
            <p>Proof desk / read the scope</p>
            <h2 id="proof-desk-title">A number without context is not evidence.</h2>
          </div>
          <p>
            Every figure below states what was measured, where it applies and who published it. Open the source to inspect the original record.
          </p>
        </header>
        <div className={styles.proofGrid}>
          {proofNotes.map((note, index) => (
            <a href={note.href} target="_blank" rel="noreferrer" key={note.value}>
              <span>0{index + 1}</span>
              <strong>{note.value}</strong>
              <b>{note.label}</b>
              <small><MapPin /> {note.scope}</small>
              <ExternalLink />
            </a>
          ))}
        </div>
        <div className={styles.readingKey}>
          <article><FileCheck2 /><div><strong>Primary records first</strong><p>Government, regulator and multilateral sources sit beside the claims they support.</p></div></article>
          <article><Scale /><div><strong>Claims stay within scope</strong><p>A registry count is not readership. A city study is not a national recycling rate.</p></div></article>
        </div>
      </section>

      <div id="everyday-atlas"><EverydayGrid /></div>
    </main>
  );
}
