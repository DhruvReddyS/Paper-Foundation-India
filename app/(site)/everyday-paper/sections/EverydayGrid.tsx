"use client";

import EverydayCard from "./EverydayCard";
import styles from "./EverydayGrid.module.css";

const items = [
  { title: "Notebooks", image: "/images/everyday/learning-in-paper.jpg", front: "A stable place for ideas to stay.", back: "A notebook’s value begins with use: filled pages, both sides where appropriate, then clean separation into a suitable recovery stream.", category: "Education" },
  { title: "Corrugated boxes", image: "/images/everyday/business-in-paper.jpg", front: "Lightweight structure carrying heavy responsibility.", back: "Flutes and linerboard create strength with relatively little material. Clean, flattened boxes are a valuable recovered grade.", category: "Packaging" },
  { title: "Tissue", image: "/images/everyday/hygiene-in-paper.jpg", front: "A specialised sheet designed for hygiene.", back: "Tissue grades balance softness, strength and absorbency. Used hygiene papers usually do not belong in ordinary paper recycling.", category: "Hygiene" },
  { title: "Newsprint", image: "/images/everyday/newsprint-in-paper.jpg", front: "A shared record made portable.", back: "Newsprint prioritises efficient communication. Fibre choice, ink and the local collection system shape its next route.", category: "Media" },
  { title: "Tea filters", image: "/images/everyday/food-in-paper.jpg", front: "Porosity engineered into a tiny paper product.", back: "Filter paper must let liquid pass while retaining particles. Food contact and mixed components affect disposal options.", category: "Food" },
  { title: "Banknotes", image: "/images/everyday/currency-paper.jpg", front: "Paper-like, but engineered for years of handling.", back: "Indian banknote substrate uses cotton rather than ordinary wood-pulp paper, showing why appearance alone cannot identify a material.", category: "Specialty" },
  { title: "Medicine cartons", image: "/images/everyday/health-in-paper.jpg", front: "Protection and information travelling together.", back: "A medicine carton protects the pack and carries essential instructions. Coatings, inserts and contamination change recovery decisions.", category: "Healthcare" },
  { title: "Paper bags", image: "/images/everyday/craft-in-paper.jpg", front: "A carrying format whose impact depends on reuse.", back: "Strength, fibre source, number of uses and end-of-life all matter. No material label is a complete environmental verdict.", category: "Retail" },
  { title: "Textbooks", image: "/images/knowledge/articles/zero-paper-waste-campuses.jpg", front: "Information designed to be revisited.", back: "Durability and readability extend a textbook’s service. Sharing, repair and responsible collection can keep its value moving.", category: "Education" },
] as const;

export default function EverydayGrid() {
  return (
    <section className={styles.section}>
      <header><div><p>Everyday atlas / nine object files</p><h2>Open the object.<br />Read the material job.</h2></div><p>Each reveal stays inside its own card, so the archive never jumps or pushes an entire row.</p></header>
      <div className={styles.grid}>{items.map((item, index) => <EverydayCard key={item.title} item={item} index={index} />)}</div>
    </section>
  );
}
