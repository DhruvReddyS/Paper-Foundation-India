import { ArrowRight, Layers3, Scale, Sprout } from "lucide-react";
import Link from "next/link";
import styles from "./Reconsidered.module.css";

const ideas = [
  { number: "01", icon: Scale, title: "Beyond assumptions", copy: "A material cannot be understood through a single headline. Source, design, use and recovery all change the outcome." },
  { number: "02", icon: Layers3, title: "Backed by context", copy: "We connect claims to evidence, define the boundaries and make uncertainty visible instead of hiding it." },
  { number: "03", icon: Sprout, title: "Built for another life", copy: "Circularity begins with thoughtful forestry and design—and continues through collection, recovery and renewed fibre." },
] as const;

export default function Reconsidered() {
  return (
    <section id="reconsidered" className={styles.section} aria-labelledby="reconsidered-title">
      <header className={styles.heading}>
        <p>Position paper · 01</p>
        <h2 id="reconsidered-title">Before we judge a material,<br /><em>we should understand its system.</em></h2>
        <span>Paper is not one story. It is a connected chain of forests, people, products, habits and possible next lives.</span>
      </header>
      <div className={styles.ideas}>
        {ideas.map(({ number, icon: Icon, title, copy }) => (
          <article key={title}>
            <header><span>{number}</span><Icon aria-hidden="true" /></header>
            <h3>{title}</h3><p>{copy}</p>
            <i aria-hidden="true" />
          </article>
        ))}
      </div>
      <Link href="/myths">See how we test paper claims <ArrowRight aria-hidden="true" /></Link>
    </section>
  );
}
