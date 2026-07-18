"use client";

import { Check, ExternalLink, FileSearch, Flag, Mail, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./CorrespondencePage.module.css";

type Mode = "contact" | "report";

export default function CorrespondencePage({ mode }: { mode: Mode }) {
  const reporting = mode === "report";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: reporting ? "Misinformation Report" : form.get("type"),
          name: form.get("name"),
          email: form.get("email"),
          subject: reporting ? form.get("source") : form.get("subject"),
          message: form.get("message"),
          sourceUrl: form.get("sourceUrl"),
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return <main className={`${styles.page} ${reporting ? styles.report : styles.contact}`}>
    <section className={styles.intro}>
      <div className={styles.pageBanner}><span>Paper Foundation India</span><strong>{reporting ? "Report a claim" : "Contact us"}</strong><small>Public desk / {reporting ? "02" : "01"}</small></div>
      <div className={styles.copy}>
        <p><span /> Public correspondence desk</p>
        <h1>{reporting ? <>Bring a claim.<br /><em>We&apos;ll trace it.</em></> : <>Let&apos;s put it<br /><em>on paper.</em></>}</h1>
        <span>{reporting ? "Send the original claim, where you found it and any context you already have. The Foundation can review it without amplifying it." : "Questions, partnerships, classroom ideas and public-interest requests all begin at this desk."}</span>
        <div className={styles.promises}>
          <p><ShieldCheck /> Your details stay with the review team.</p>
          <p><FileSearch /> {reporting ? "Every report is checked for context and source quality." : "Every note is routed to the most relevant Foundation desk."}</p>
        </div>
        <div className={styles.switch}><Link className={!reporting ? styles.active : ""} href="/contact"><Mail /> Contact us</Link><Link className={reporting ? styles.active : ""} href="/report"><Flag /> Report a claim</Link></div>
        {reporting ? <EvidenceDesk /> : <LetterpressDesk />}
      </div>
      <div className={styles.sheet}>
        {status === "sent" ? <div className={styles.success}><Check /><p>Correspondence filed</p><h2>{reporting ? "The claim is now in the review queue." : "Your note has reached the Foundation."}</h2><span>Thank you. The desk will use the email you supplied if more context is needed.</span><button onClick={() => setStatus("idle")}>Write another note</button></div> :
          <form onSubmit={submit}>
            <header><div>{reporting ? <Flag /> : <Mail />}<span>{reporting ? "Claim review form" : "Contact form"}</span></div><small>Paper Foundation India</small></header>
            <div className={styles.fields}>
              <label><span>Your name *</span><input required name="name" autoComplete="name" /></label>
              <label><span>Email address *</span><input required name="email" type="email" autoComplete="email" /></label>
              {reporting ? <>
                <label className={styles.full}><span>Where did you see the claim? *</span><input required name="source" placeholder="Article, post, video, speech or campaign" /></label>
                <label className={styles.full}><span>Original link</span><input name="sourceUrl" type="url" placeholder="https://" /></label>
              </> : <>
                <label><span>Subject *</span><input required name="subject" placeholder="How can we help?" /></label>
                <label><span>Type</span><select name="type" defaultValue="General Inquiry"><option>General Inquiry</option><option>Partnership</option><option>Education</option><option>Media</option><option>Fact-check request</option></select></label>
              </>}
              <label className={styles.full}><span>{reporting ? "Write the claim and useful context *" : "Your message *"}</span><textarea required name="message" rows={7} /></label>
            </div>
            <footer><p>{reporting ? "Submitting a report does not guarantee publication of a correction." : "Please do not send confidential commercial information through this form."}</p><button disabled={status === "sending"}>{status === "sending" ? "Filing…" : reporting ? "Send for review" : "Send correspondence"}<Send /></button></footer>
            {status === "error" && <p className={styles.error}>The desk could not file this note. Please try again.</p>}
          </form>}
      </div>
    </section>
    <section className={styles.after}><span>Need a different route?</span><Link href="/join">Join the Foundation <ExternalLink /></Link><Link href={reporting ? "/contact" : "/report"}>{reporting ? "Contact us" : "Report a claim"} <ExternalLink /></Link></section>
  </main>;
}

function LetterpressDesk() {
  return <div className={styles.contactArtifact} aria-hidden="true">
    <div className={styles.contactBook}>
      <span>PUBLIC CORRESPONDENCE / 01</span>
      <strong>Write the first line.</strong>
      <p>IDEA · QUESTION · PARTNERSHIP</p>
      <i /><i /><i />
    </div>
    <div className={styles.contactTabs}><span>A–F</span><span>G–P</span><span>Q–Z</span></div>
    <div className={styles.contactEnvelope}><b>PFI</b><span>TO THE PUBLIC DESK</span><i /></div>
    <div className={styles.contactClip} />
  </div>;
}

function EvidenceDesk() {
  return <div className={styles.reportArtifact} aria-hidden="true">
    <div className={styles.reportBoard}>
      <span>EVIDENCE FILE / OPEN</span>
      <strong>“A claim without its source is only a loose sheet.”</strong>
      <p>CLAIM → ORIGIN → BOUNDARY → CONTEXT</p>
      <i className={styles.reportPinA} /><i className={styles.reportPinB} /><i className={styles.reportThread} />
    </div>
    <div className={styles.reportSlip}><span>01</span><b>CAPTURE</b><small>Exact wording</small></div>
    <div className={styles.reportSlip}><span>02</span><b>TRACE</b><small>Original source</small></div>
    <div className={styles.reportSlip}><span>03</span><b>CONTEXT</b><small>What surrounds it</small></div>
    <div className={styles.reportMagnifier} />
  </div>;
}
