"use client";

import { ArrowUpRight, BookOpen, Gamepad2, Leaf, LockKeyhole, MapPinned } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";
import { usePublicSettings } from "./usePublicSettings";

const columns = [
  { label: "Understand", links: [["Knowledge Hub", "/knowledge"], ["Myths vs Facts", "/myths"], ["Glossary", "/glossary"], ["Resources", "/resources"]] },
  { label: "Experience", links: [["Paper Journey", "/journey"], ["Games Lab", "/games"], ["Paper Everywhere", "/everyday-paper"], ["Circularity", "/circularity"]] },
  { label: "India and Foundation", links: [["India Fibre Atlas", "/india-map"], ["India Paper Ledger", "/india-snapshot"], ["About the Foundation", "/about"], ["Join the Initiative", "/join"]] },
] as const;

export default function Footer() {
  const settings = usePublicSettings();
  const brand = String(settings["public.brand.name"] || "Paper Foundation");
  const country = String(settings["public.brand.country"] || "India");
  const intro = String(settings["public.footer.intro"] || "The next page is not blank.");
  const body = String(settings["public.footer.body"] || "It is waiting for what we choose.");
  const action = String(settings["public.footer.action"] || "Join Paper Foundation India");
  const statement = String(settings["public.footer.statement"] || "Evidence first|context visible|fibre valued").split("|").filter(Boolean).join(" · ");
  return <footer className={styles.footer}>
    <div className={styles.signal}>
      <span><Leaf /> Source responsibly</span>
      <span><BookOpen /> Learn completely</span>
      <span><Gamepad2 /> Explore playfully</span>
      <span><MapPinned /> Understand locally</span>
    </div>
    <div className={styles.callout}>
      <div><p>{intro}</p><h2>{body}</h2></div>
      <Link href="/join">{action} <ArrowUpRight /></Link>
    </div>
    <div className={styles.directory}>
      <div className={styles.brand}>
        <Image src="/images/brand/paper-foundation-nav-logo.png" alt="" width={52} height={66} />
        <h3>{brand} <small>{country}</small></h3>
        <p>Evidence-led public understanding for a material with more than one life.</p>
      </div>
      {columns.map(column => <nav aria-label={column.label} key={column.label}>
        <span>{column.label}</span>
        {column.links.map(([label, href]) => <Link href={href} key={href}>{label}<ArrowUpRight /></Link>)}
      </nav>)}
    </div>
    <div className={styles.bottom}>
      <p>© {new Date().getFullYear()} {brand} {country}</p>
      <p>{statement}</p>
      <nav aria-label="Footer utility links"><Link href="/contact">Contact <ArrowUpRight /></Link><Link href="/admin/login"><LockKeyhole /> Admin portal</Link></nav>
    </div>
  </footer>;
}
