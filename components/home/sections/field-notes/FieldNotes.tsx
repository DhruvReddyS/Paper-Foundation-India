import { ArrowUpRight, Factory, Recycle, Trees } from "lucide-react";
import Link from "next/link";
import styles from "./FieldNotes.module.css";

const notes = [
  { no: "01", type: "Cover essay", time: "8 min", title: "How fibre sourcing shapes the paper story", copy: "Follow the decisions behind forest management, fibre origin and the limits of a material label.", href: "/knowledge/truth-about-paper-forestry", icon: Trees, tone: "forest" },
  { no: "02", type: "Visual method", time: "6 min", title: "What a recovery rate does not tell you", copy: "Collection, contamination, yield and final use all sit behind one headline number.", href: "/knowledge/recycling-rates-compared", icon: Recycle, tone: "copper" },
  { no: "03", type: "Mill note", time: "7 min", title: "Inside the decisions that form a sheet", copy: "Water removal, fibre preparation and energy choices change performance at the mill.", href: "/knowledge/water-usage-modern-mills", icon: Factory, tone: "sage" },
] as const;

export default function FieldNotes() {
  return (
    <section className={styles.section} aria-labelledby="field-notes-title">
      <header><div><p>From the knowledge desk</p><h2 id="field-notes-title">Field notes for<br /><em>better questions.</em></h2></div><Link href="/knowledge">Browse the Knowledge Hub <ArrowUpRight /></Link></header>
      <div className={styles.notes}>
        {notes.map(({ no, type, time, title, copy, href, icon: Icon, tone }) => (
          <Link href={href} className={`${styles.note} ${styles[tone]}`} key={no}>
            <header><span>{no}</span><small>{type} · {time}</small></header>
            <div className={styles.visual}><Icon aria-hidden="true" /><i /><i /></div>
            <h3>{title}</h3><p>{copy}</p>
            <footer><span>Evidence note</span><ArrowUpRight aria-hidden="true" /></footer>
          </Link>
        ))}
      </div>
    </section>
  );
}
