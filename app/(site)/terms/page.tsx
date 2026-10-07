import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = { title: "Website Terms", description: "Terms governing use of the Paper Foundation India website and educational material." };

export default function TermsPage() {
  return <article className={styles.legal}><header><p>WEBSITE USE</p><h1>Terms of use</h1><span>Effective 7 October 2026</span></header><div className={styles.body}>
    <section><h2>Educational purpose</h2><p>This website supports public understanding of paper, fibre, recovery and related sustainability questions. It provides educational information, not legal, financial, medical or professional advice.</p></section>
    <section><h2>Evidence and corrections</h2><p>We aim to distinguish facts, estimates, interpretations and known limitations. Sources and conditions may change. If you identify an error or missing context, use the <Link href="/report">source review desk</Link>. A submission begins review but does not guarantee publication or a particular verdict.</p></section>
    <section><h2>Acceptable use</h2><ul><li>Do not interfere with the website, bypass security controls or submit malicious files.</li><li>Do not impersonate another person or submit unlawful, abusive or confidential third-party material.</li><li>Do not use automated systems in a way that degrades access for other visitors.</li></ul></section>
    <section><h2>Intellectual property</h2><p>Unless stated otherwise, the Foundation retains rights in original website text, design and educational material. Third-party names, reports, imagery and source material remain subject to their respective rights. Contact us before substantial republication or commercial reuse.</p></section>
    <section><h2>External links</h2><p>Links to external sources are provided for context. The Foundation does not control their availability, security or later changes.</p></section>
    <section><h2>Availability</h2><p>We may update, suspend or remove website features to maintain accuracy, security or service reliability. We cannot guarantee uninterrupted access.</p></section>
    <section><h2>Privacy</h2><p>Use of personal information is described in the <Link href="/privacy">privacy notice</Link>.</p></section>
    <section><h2>Contact</h2><p>Questions about these terms can be submitted through the <Link href="/contact">contact desk</Link>.</p></section>
  </div></article>;
}
