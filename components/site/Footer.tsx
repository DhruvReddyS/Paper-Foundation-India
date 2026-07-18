import { ArrowUpRight, BookOpen, Gamepad2, Leaf, MapPinned } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const columns=[
 {label:"Understand",links:[["Knowledge Hub","/knowledge"],["Myths vs Facts","/myths"],["Glossary","/glossary"],["Resources","/resources"]]},
 {label:"Experience",links:[["Paper Journey","/journey"],["Games Lab","/games"],["Paper Everywhere","/everyday-paper"],["Circularity","/circularity"]]},
 {label:"India & Foundation",links:[["India Fibre Map","/india-map"],["India by Numbers","/india-snapshot"],["About the Foundation","/about"],["Join the Initiative","/join"]]},
] as const;

export default function Footer(){return <footer className={styles.footer}>
 <div className={styles.signal}><span><Leaf/> Source responsibly</span><span><BookOpen/> Learn completely</span><span><Gamepad2/> Explore playfully</span><span><MapPinned/> Understand locally</span></div>
 <div className={styles.callout}><div><p>The next page is not blank.</p><h2>It is waiting for <em>what we choose.</em></h2></div><Link href="/join">Join Paper Foundation India <ArrowUpRight/></Link></div>
 <div className={styles.directory}>
  <div className={styles.brand}><Image src="/images/brand/paper-foundation-nav-logo.png" alt="" width={52} height={66}/><h3>Paper Foundation <small>India</small></h3><p>Evidence-led public understanding for a material with more than one life.</p></div>
  {columns.map(column=><nav aria-label={column.label} key={column.label}><span>{column.label}</span>{column.links.map(([label,href])=><Link href={href} key={href}>{label}<ArrowUpRight/></Link>)}</nav>)}
 </div>
 <div className={styles.wordmark} aria-hidden="true">PAPER</div>
 <div className={styles.bottom}><p>© {new Date().getFullYear()} Paper Foundation India</p><p>Evidence first · context visible · fibre valued</p><Link href="/contact">Contact <ArrowUpRight/></Link></div>
 </footer>}
