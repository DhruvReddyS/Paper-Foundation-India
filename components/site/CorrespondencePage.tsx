"use client";

import { Check, CheckCircle2, CornerDownRight, FileSearch, Flag, Inbox, Mail, MessageCircle, ScanSearch, Send, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./CorrespondencePage.module.css";
import { usePublicSettings } from "./usePublicSettings";

type Mode = "contact" | "report";

export default function CorrespondencePage({ mode }: { mode: Mode }) {
  const settings = usePublicSettings();
  const contactEmail = String(settings["public.contact.email"] || "paperfoundationindia@gmail.com");
  const reporting = mode === "report";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [channel, setChannel] = useState("General Inquiry");
  const [messageLength, setMessageLength] = useState(0);

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
      if (!response.ok) throw new Error();
      setStatus("sent");
      setMessageLength(0);
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className={`${styles.page} ${reporting ? styles.report : styles.contact}`}>
      <section className={styles.shell}>
        <div className={styles.storySide}>
          <div className={styles.copy}>
            <p>{reporting ? <><ScanSearch /> SOURCE REVIEW DESK</> : <><Inbox /> PUBLIC CORRESPONDENCE DESK</>}</p>
            <h1>{reporting ? <>Trace the<br /><em>original signal.</em></> : <>Send a thought.<br /><em>Start a connection.</em></>}</h1>
            <span>{reporting ? "Share the exact claim and where it appeared. The review desk will follow the source, define its boundary and look for the missing context." : "Questions, collaborations, classroom ideas and public-interest requests are welcome. Pick a channel and send the first signal."}</span>
            <div className={styles.trust}>
              <p><ShieldCheck /> Private by default</p>
              <p>{reporting ? <><FileSearch /> Source-led review</> : <><MessageCircle /> Routed to a real desk</>}</p>
            </div>
          </div>

          <div className={styles.visual} aria-hidden="true">
            {reporting ? <ReportStampWall /> : <ContactConversation />}
          </div>
        </div>

        <div className={styles.formPanel}>
          {status === "sent" ? (
            <div className={styles.success}><Check /><small>RECEIVED</small><h2>{reporting ? "Evidence entered into review." : "Your signal reached the desk."}</h2><p>We will use your email if the team needs more context.</p><button onClick={() => setStatus("idle")}>Send another</button></div>
          ) : (
            <form onSubmit={submit}>
              <header><span>{reporting ? <Flag /> : <Mail />}{reporting ? "Evidence intake" : "Message composer"}</span><small>All fields marked * are required</small></header>
              <div className={styles.formGuide}>
                {(reporting ? ["Copy the exact claim", "Add the original source", "Explain the missing context"] : ["Choose the right desk", "Add the essential detail", "Receive replies by email"]).map((item, index) => (
                  <span key={item}><b>0{index + 1}</b><CheckCircle2 />{item}</span>
                ))}
              </div>
              {!reporting && <div className={styles.channelPicker} aria-label="Choose inquiry channel">
                {["General Inquiry", "Partnership", "Education", "Media", "Fact-check request"].map((item) => (
                  <button type="button" key={item} className={channel === item ? styles.selectedChannel : ""} aria-pressed={channel === item} onClick={() => setChannel(item)}>{item}</button>
                ))}
              </div>}
              <div className={styles.fields}>
                <label><span>Name *</span><input required name="name" autoComplete="name" placeholder="Your name" /></label>
                <label><span>Email *</span><input required name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
                {reporting ? <>
                  <label className={styles.full}><span>Where did the claim appear? *</span><input required name="source" placeholder="Article title, video, speech or social post" /></label>
                  <label className={styles.full}><span>Original link</span><input name="sourceUrl" type="url" inputMode="url" placeholder="https://example.com/source" /><small>Use the earliest source you can find, not a repost.</small></label>
                </> : <>
                  <label className={styles.full}><span>Subject *</span><input required name="subject" placeholder="A short, useful subject" /></label>
                  <input type="hidden" name="type" value={channel} />
                </>}
                <label className={styles.full}><span>{reporting ? "Exact claim and context *" : "Message *"}</span><textarea required name="message" rows={4} minLength={20} maxLength={1800} onChange={(event) => setMessageLength(event.currentTarget.value.length)} placeholder={reporting ? "Paste the exact wording first. Then explain where it appeared and why it may be misleading." : "What would you like the Foundation to understand or help with?"} /><small className={styles.counter}>{messageLength} / 1800</small></label>
              </div>
              <footer><p>{reporting ? "A submission begins a review. It does not guarantee a published correction." : <>Please do not include confidential commercial information. Prefer email? <a href={`mailto:${contactEmail}`}>{contactEmail}</a></>}</p><button disabled={status === "sending"}>{status === "sending" ? "Sending..." : reporting ? "Submit evidence" : "Send message"}<Send /></button></footer>
              {status === "error" && <p className={styles.error} role="alert">This could not be sent. Please check the fields and try again.</p>}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function ContactConversation() {
  return <div className={styles.conversation}>
    <strong>“</strong>
    <article className={styles.questionBubble}><small>YOU / 10:24</small><p>Can we explore this question together?</p></article>
    <article className={styles.replyBubble}><small>PFI DESK / OPEN</small><p>Yes. Start with the context you already have.</p><CornerDownRight /></article>
    <footer><Mail /><span>A direct line for useful questions,<br />not another anonymous inbox.</span></footer>
  </div>;
}

function ReportStampWall() {
  return <div className={styles.stampWall}>
    <div className={styles.allegationBanner}>FALSE ALLEGATION?</div>
    <strong className={styles.wrongStamp}>WRONG</strong>
    <strong className={styles.mythStamp}>MYTH</strong>
    <strong className={styles.verifyStamp}>VERIFY</strong>
    <span className={styles.contextTape}>MISSING CONTEXT / TRACE SOURCE / CHECK DATE</span>
    <div className={styles.claimFragment}><small>CLAIM FRAGMENT / 08</small><p>“Everyone is sharing it, so it must be true.”</p></div>
    <footer><FileSearch /><span>Do not stamp a verdict<br />before finding the source.</span></footer>
  </div>;
}
