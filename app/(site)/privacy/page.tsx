import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = { title: "Privacy Notice", description: "How Paper Foundation India collects, uses, protects and deletes personal information." };

export default function PrivacyPage() {
  return <article className={styles.legal}><header><p>PUBLIC INFORMATION NOTICE</p><h1>Privacy notice</h1><span>Effective 7 October 2026</span></header><div className={styles.body}>
    <section><h2>What this notice covers</h2><p>This notice explains how Paper Foundation India handles information submitted through this website, including correspondence, membership applications, newsletter subscriptions and administrative access.</p></section>
    <section><h2>Information we collect</h2><ul><li>Contact details and the contents of messages or applications you choose to send.</li><li>Newsletter email, confirmation status, preferences, consent record and unsubscribe status.</li><li>Uploaded membership documents and media supplied to the Foundation.</li><li>Limited technical and interaction data used for security, rate limiting and aggregate website analytics.</li><li>Administrator identity, access role and an audit record of CMS actions.</li></ul></section>
    <section><h2>Why we use it</h2><p>We use personal information to respond to requests, review membership applications, deliver confirmed newsletters, operate and secure the website, preserve editorial accountability and understand aggregate public use. We do not sell personal information.</p></section>
    <section><h2>Newsletter choice</h2><p>Newsletter subscriptions use double opt-in. Messages are sent only after the confirmation link is used. Every campaign contains an unsubscribe link, and unsubscribed addresses are suppressed before later delivery batches.</p></section>
    <section><h2>Storage and service providers</h2><p>Website records are stored in MongoDB Atlas, files in Cloudinary, and confirmed email is delivered through the configured Gmail account. Hosting providers process the minimum technical information needed to serve the website. Their own privacy terms also apply.</p></section>
    <section><h2>Retention and deletion</h2><p>We retain records only while they are useful for the stated purpose, legal accountability, security or recovery. Editorial revision and audit records may be retained to protect publication integrity. You may request access, correction, deletion or withdrawal of newsletter consent by contacting the Foundation.</p></section>
    <section><h2>Security</h2><p>The CMS uses named accounts, role-based access, optional two-factor authentication, encrypted sessions, rate limits, file validation, revision history and audit records. No internet service can promise absolute security, so credentials and sensitive documents should still be shared carefully.</p></section>
    <section><h2>Contact</h2><p>Privacy requests can be sent through the <Link href="/contact">contact desk</Link> or to <a href="mailto:paperfoundationindia@gmail.com">paperfoundationindia@gmail.com</a>. Please write “Privacy request” in the subject.</p></section>
    <section><h2>Changes</h2><p>Material changes will be published on this page with a revised effective date.</p></section>
  </div></article>;
}
