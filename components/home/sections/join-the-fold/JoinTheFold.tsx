import { ArrowRight, BookOpen, Lightbulb, Users } from "lucide-react";
import Link from "next/link";
import styles from "./JoinTheFold.module.css";

const paths = [
  { icon: BookOpen, title: "Learn and share", copy: "Use clear, sourced material to start better conversations." },
  { icon: Users, title: "Partner with us", copy: "Build public knowledge, programmes and useful collaborations." },
  { icon: Lightbulb, title: "Contribute knowledge", copy: "Bring evidence, field insight or a question worth investigating." },
] as const;

export default function JoinTheFold() {
  return (
    <section className={styles.section} aria-labelledby="join-fold-title">
      <div className={styles.mark} aria-hidden="true"><div className={styles.paper}><span>P</span><i /><b /></div><div className={styles.rings}><i /><i /><i /></div></div>
      <div className={styles.copy}>
        <p>Paper Foundation India</p><h2 id="join-fold-title">Bring a better question.<br /><em>Join the fold.</em></h2><span>Paper touches education, livelihoods, commerce, culture and everyday life. Understanding it well is shared work.</span>
        <div className={styles.paths}>{paths.map(({icon: Icon,title,copy},index) => <article key={title}><span>0{index+1}</span><Icon /><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        <div className={styles.actions}><Link href="/get-involved">Get involved <ArrowRight /></Link><Link href="/contact">Contact the Foundation <ArrowRight /></Link></div>
      </div>
    </section>
  );
}
