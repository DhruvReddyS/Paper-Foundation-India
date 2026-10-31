"use client";

import { CornerDownRight, FileSearch, Flag, Inbox, Mail, MessageCircle, Paperclip, ScanSearch, Send, ShieldCheck, X } from "@/components/paper-ui/icons";
import { FormEvent, useCallback, useRef, useState } from "react";
import styles from "./CorrespondencePage.module.css";
import { usePublicSettings } from "./usePublicSettings";

type Mode = "contact" | "report";
type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "subject" | "source" | "sourceUrl" | "message" | "attachment", string>>;

const CHANNELS = ["General Inquiry", "Partnership", "Education", "Media", "Fact-check request"] as const;
const MESSAGE_MIN = 20;
const MESSAGE_MAX = 1800;
const MAX_ATTACHMENT_BYTES = 6 * 1024 * 1024;
const ATTACHMENT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// Mirrors the server-side rule in lib/validators/inquiry so a typo is caught
// before a round trip, without claiming to be a full address verification.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function describeBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CorrespondencePage({ mode }: { mode: Mode }) {
  const settings = usePublicSettings();
  const contactEmail = String(settings["public.contact.email"] || "paperfoundationindia@gmail.com");
  const reporting = mode === "report";
  const [status, setStatus] = useState<Status>("idle");
  const [channel, setChannel] = useState<string>(CHANNELS[0]);
  const [messageLength, setMessageLength] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [reference, setReference] = useState("");
  const [attachment, setAttachment] = useState<{ url: string; name: string; bytes: number } | null>(null);
  const [attaching, setAttaching] = useState(false);
  const formStartedAt = useRef(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (form: FormData): FieldErrors => {
      const found: FieldErrors = {};
      const name = String(form.get("name") || "").trim();
      const email = String(form.get("email") || "").trim();
      const message = String(form.get("message") || "").trim();

      if (name.length < 2) found.name = "Enter the name we should reply to.";
      if (!EMAIL_SHAPE.test(email)) found.email = "Enter an address we can actually reach.";
      if (message.length < MESSAGE_MIN) {
        found.message = reporting
          ? `Paste the claim itself, at least ${MESSAGE_MIN} characters.`
          : `Tell us a little more, at least ${MESSAGE_MIN} characters.`;
      }
      if (message.length > MESSAGE_MAX) found.message = `Keep this under ${MESSAGE_MAX} characters.`;

      if (reporting) {
        if (String(form.get("source") || "").trim().length < 2) {
          found.source = "Name where the claim appeared.";
        }
        const sourceUrl = String(form.get("sourceUrl") || "").trim();
        if (sourceUrl) {
          try {
            const parsed = new URL(sourceUrl);
            if (!["http:", "https:"].includes(parsed.protocol)) found.sourceUrl = "Use a http or https link.";
          } catch {
            found.sourceUrl = "That does not look like a complete link.";
          }
        }
      } else if (String(form.get("subject") || "").trim().length < 2) {
        found.subject = "Add a short subject.";
      }

      return found;
    },
    [reporting]
  );

  async function uploadAttachment(file: File) {
    setErrors((current) => ({ ...current, attachment: undefined }));
    if (!ATTACHMENT_TYPES.includes(file.type)) {
      setErrors((current) => ({ ...current, attachment: "Attach a JPG, PNG, WebP or PDF." }));
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setErrors((current) => ({ ...current, attachment: "Attachments must be 6 MB or smaller." }));
      return;
    }

    setAttaching(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("formStartedAt", String(formStartedAt.current));
      const response = await fetch("/api/claim-evidence", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        setErrors((current) => ({
          ...current,
          attachment: data.error || "The attachment could not be uploaded. Your report can still be sent without it.",
        }));
        return;
      }
      setAttachment({ url: data.url, name: data.name || file.name, bytes: Number(data.bytes) || file.size });
    } catch {
      setErrors((current) => ({
        ...current,
        attachment: "The attachment could not be uploaded. Your report can still be sent without it.",
      }));
    } finally {
      setAttaching(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const found = validate(form);
    if (Object.keys(found).length) {
      setErrors(found);
      setFormError("Some details still need attention before this can be sent.");
      formElement.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("sending");

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
          sourceUrl: form.get("sourceUrl") || undefined,
          attachmentUrl: attachment?.url,
          attachmentName: attachment?.name,
          _website: form.get("_website"),
          formStartedAt: formStartedAt.current,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Each failure tells the sender what to do differently, rather than
        // offering one message that fits none of them.
        setStatus("error");
        if (response.status === 429) {
          const retryAfter = Number(response.headers.get("Retry-After"));
          const minutes = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.ceil(retryAfter / 60) : 0;
          setFormError(
            minutes
              ? `This desk has received several messages from your connection. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`
              : "This desk has received several messages from your connection. Please try again a little later."
          );
        } else if (response.status === 503) {
          setFormError(`The correspondence service is offline right now. Please email ${contactEmail} directly.`);
        } else if (response.status === 400) {
          setFormError("Some details were refused by the desk. Please check the fields and try again.");
        } else {
          setFormError(`This could not be sent. Please try again, or email ${contactEmail}.`);
        }
        return;
      }

      setReference(typeof data.id === "string" ? data.id.slice(-8).toUpperCase() : "");
      setStatus("sent");
      setMessageLength(0);
      setAttachment(null);
      formElement.reset();
      setChannel(CHANNELS[0]);
      formStartedAt.current = Date.now();
    } catch {
      setStatus("error");
      setFormError(`This could not be sent. Check your connection, or email ${contactEmail}.`);
    }
  }

  function startAgain() {
    setStatus("idle");
    setReference("");
    setFormError("");
    setErrors({});
    formStartedAt.current = Date.now();
  }

  const guideSteps = reporting
    ? ["Copy the exact claim", "Add the original source", "Explain the missing context"]
    : ["Choose the right desk", "Add the essential detail", "Receive replies by email"];

  return (
    <main className={`${styles.page} ${reporting ? styles.report : styles.contact}`}>
      <section className={styles.shell}>
        <div className={styles.storySide}>
          <div className={styles.copy}>
            <p>{reporting ? <><ScanSearch /> SOURCE REVIEW DESK</> : <><Inbox /> PUBLIC CORRESPONDENCE DESK</>}</p>
            <h1>{reporting ? <>Trace the<br /><em>original signal.</em></> : <>Send a thought.<br /><em>Start a connection.</em></>}</h1>
            <span>
              {reporting
                ? "Share the exact claim and where it appeared. The review desk will follow the source, define its boundary and look for the missing context."
                : "Questions, collaborations, classroom ideas and public-interest requests are welcome. Pick a channel and send the first signal."}
            </span>
            <div className={styles.trust}>
              <p><ShieldCheck /> Private by default</p>
              <p>{reporting ? <><FileSearch /> Source-led review</> : <><MessageCircle /> Routed to a real desk</>}</p>
            </div>
            <dl className={styles.deskFacts}>
              <div>
                <dt>Direct email</dt>
                <dd><a href={`mailto:${contactEmail}`}>{contactEmail}</a></dd>
              </div>
              <div>
                <dt>Typical reply</dt>
                <dd>Within five working days</dd>
              </div>
              <div>
                <dt>{reporting ? "What a report begins" : "What we cannot do"}</dt>
                <dd>{reporting ? "A source review, not a guaranteed correction" : "Give commercial or legal advice"}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.visual} aria-hidden="true">
            {reporting ? <ReportStampWall /> : <ContactConversation />}
          </div>
        </div>

        <div className={styles.formPanel}>
          {status === "sent" ? (
            <div className={styles.success}>
              <small>RECEIVED</small>
              <h2>{reporting ? "Evidence entered into review." : "Your signal reached the desk."}</h2>
              {reference && (
                <p className={styles.reference}>
                  Reference <strong>{reference}</strong>
                  <span>Quote this if you write to us about the same submission.</span>
                </p>
              )}
              <ol className={styles.nextSteps}>
                {(reporting
                  ? [
                      "The desk logs the claim and locates the earliest source it can find.",
                      "The claim is checked against published evidence and its stated boundary.",
                      "Where a correction is warranted, it is published with the record of the change.",
                    ]
                  : [
                      "Your message is routed to the desk that handles this subject.",
                      "A reader reviews it and decides what it needs.",
                      "We reply by email if the team needs more context or can help.",
                    ]
                ).map((step, index) => (
                  <li key={step}><b>{String(index + 1).padStart(2, "0")}</b>{step}</li>
                ))}
              </ol>
              <button type="button" onClick={startAgain}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <input aria-hidden="true" tabIndex={-1} autoComplete="off" name="_website" style={{ display: "none" }} />
              <header>
                <span>{reporting ? <Flag /> : <Mail />}{reporting ? "Evidence intake" : "Message composer"}</span>
                <small>All fields marked * are required</small>
              </header>

              <ol className={styles.formGuide}>
                {guideSteps.map((item, index) => (
                  <li key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</li>
                ))}
              </ol>

              {!reporting && (
                <div className={styles.channelPicker} role="radiogroup" aria-label="Choose inquiry channel">
                  {CHANNELS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      role="radio"
                      aria-checked={channel === item}
                      tabIndex={channel === item ? 0 : -1}
                      className={channel === item ? styles.selectedChannel : ""}
                      onKeyDown={(event) => {
                        const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
                        if (!offset) return;
                        event.preventDefault();
                        const next = CHANNELS[(CHANNELS.indexOf(item) + offset + CHANNELS.length) % CHANNELS.length];
                        setChannel(next);
                        event.currentTarget.parentElement
                          ?.querySelectorAll<HTMLButtonElement>("button")
                          [CHANNELS.indexOf(next)]?.focus();
                      }}
                      onClick={() => setChannel(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.fields}>
                <label>
                  <span>Name *</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "error-name" : undefined}
                  />
                  {errors.name && <small id="error-name" className={styles.fieldError}>{errors.name}</small>}
                </label>

                <label>
                  <span>Email *</span>
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "error-email" : undefined}
                  />
                  {errors.email && <small id="error-email" className={styles.fieldError}>{errors.email}</small>}
                </label>

                {reporting ? (
                  <>
                    <label className={styles.full}>
                      <span>Where did the claim appear? *</span>
                      <input
                        required
                        name="source"
                        placeholder="Article title, video, speech or social post"
                        aria-invalid={Boolean(errors.source)}
                        aria-describedby={errors.source ? "error-source" : undefined}
                      />
                      {errors.source && <small id="error-source" className={styles.fieldError}>{errors.source}</small>}
                    </label>

                    <label className={styles.full}>
                      <span>Original link</span>
                      <input
                        name="sourceUrl"
                        type="url"
                        inputMode="url"
                        placeholder="https://example.com/source"
                        aria-invalid={Boolean(errors.sourceUrl)}
                        aria-describedby={errors.sourceUrl ? "error-source-url" : "hint-source-url"}
                      />
                      {errors.sourceUrl
                        ? <small id="error-source-url" className={styles.fieldError}>{errors.sourceUrl}</small>
                        : <small id="hint-source-url">Use the earliest source you can find, not a repost.</small>}
                    </label>
                  </>
                ) : (
                  <>
                    <label className={styles.full}>
                      <span>Subject *</span>
                      <input
                        required
                        name="subject"
                        placeholder="A short, useful subject"
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={errors.subject ? "error-subject" : undefined}
                      />
                      {errors.subject && <small id="error-subject" className={styles.fieldError}>{errors.subject}</small>}
                    </label>
                    <input type="hidden" name="type" value={channel} />
                  </>
                )}

                <label className={styles.full}>
                  <span>{reporting ? "Exact claim and context *" : "Message *"}</span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    maxLength={MESSAGE_MAX}
                    onChange={(event) => setMessageLength(event.currentTarget.value.length)}
                    placeholder={
                      reporting
                        ? "Paste the exact wording first. Then explain where it appeared and why it may be misleading."
                        : "What would you like the Foundation to understand or help with?"
                    }
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "error-message" : undefined}
                  />
                  <small className={styles.counter}>{messageLength} / {MESSAGE_MAX}</small>
                  {errors.message && <small id="error-message" className={styles.fieldError}>{errors.message}</small>}
                </label>

                {reporting && (
                  <div className={`${styles.full} ${styles.attachment}`}>
                    <span>Screenshot or document</span>
                    {attachment ? (
                      <p className={styles.attachedFile}>
                        <Paperclip />
                        <b>{attachment.name}</b>
                        <small>{describeBytes(attachment.bytes)}</small>
                        <button type="button" onClick={() => setAttachment(null)} aria-label={`Remove ${attachment.name}`}>
                          <X />
                        </button>
                      </p>
                    ) : (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="claim-evidence"
                          accept=".jpg,.jpeg,.png,.webp,.pdf"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            if (file) void uploadAttachment(file);
                          }}
                        />
                        <label htmlFor="claim-evidence" className={styles.attachButton}>
                          <Paperclip /> {attaching ? "Uploading..." : "Attach the original (optional)"}
                        </label>
                      </>
                    )}
                    {errors.attachment
                      ? <small className={styles.fieldError}>{errors.attachment}</small>
                      : <small>JPG, PNG, WebP or PDF, up to 6 MB. A screenshot of the original is often the fastest route to a verdict.</small>}
                  </div>
                )}
              </div>

              <footer>
                <p>
                  {reporting
                    ? "A submission begins a review. It does not guarantee a published correction."
                    : <>Please do not include confidential commercial information. Prefer email? <a href={`mailto:${contactEmail}`}>{contactEmail}</a></>}
                </p>
                <button disabled={status === "sending" || attaching}>
                  {status === "sending" ? "Sending..." : reporting ? "Submit evidence" : "Send message"}
                  <Send />
                </button>
              </footer>

              {formError && <p className={styles.error} role="alert">{formError}</p>}
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
