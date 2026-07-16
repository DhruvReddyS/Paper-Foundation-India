"use client";

import { ArrowRight, BookOpen, Coffee, Package, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./PaperEverywhere.module.css";

const objects = [
  { id: "book", label: "Learning", title: "Ideas you can hold", copy: "Books, notebooks and learning materials turn fibre into memory, access and exchange.", icon: BookOpen },
  { id: "cup", label: "Food service", title: "Performance in layers", copy: "Paper-based food service products balance strength, safety, barriers and local recovery realities.", icon: Coffee },
  { id: "bag", label: "Everyday carrying", title: "Designed for a task", copy: "Bags reveal how fibre choice, construction and reuse habits work together.", icon: ShoppingBag },
  { id: "box", label: "Protection", title: "Quiet infrastructure", copy: "Boxes protect products and help goods move through complex supply chains.", icon: Package },
] as const;

export default function PaperEverywhere() {
  const [active, setActive] = useState(0);
  const object = objects[active];
  const Icon = object.icon;
  return (
    <section className={styles.section} aria-labelledby="paper-everywhere-title">
      <header><p><Search /> Paper everywhere</p><h2 id="paper-everywhere-title">Look again.<br /><em>Fibre is hiding in plain sight.</em></h2><span>Tap the numbered objects in this everyday paper table.</span></header>
      <div className={styles.scene}>
        <div className={styles.table}>
          <div className={styles.tableLabel}>Everyday object study · 04 pieces</div>
          {objects.map((item, index) => { const ItemIcon = item.icon; return <button className={`${styles.object} ${styles[item.id]} ${active === index ? styles.active : ""}`} onClick={() => setActive(index)} aria-label={`Inspect ${item.label}`} aria-pressed={active === index} key={item.id}><ItemIcon /><span>0{index + 1}</span></button>; })}
          <div className={styles.shadow} aria-hidden="true" />
        </div>
        <article key={object.id}>
          <header><span>Object 0{active + 1}</span><Icon aria-hidden="true" /></header><small>{object.label}</small><h3>{object.title}</h3><p>{object.copy}</p>
          <nav>{objects.map((item,index) => <button className={active === index ? styles.current : ""} onClick={() => setActive(index)} key={item.id}>{item.label}</button>)}</nav>
          <Link href="/everyday-paper">Discover paper in daily life <ArrowRight /></Link>
        </article>
      </div>
    </section>
  );
}
