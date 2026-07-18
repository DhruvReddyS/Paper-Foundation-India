"use client";

import {
  ArrowLeft,
  Check,
  ExternalLink,
  FileEdit,
  Flag,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./InitiativeForm.module.css";

export default function InitiativeForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const details = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          type: "Membership Application",
          subject: "Join Paper Foundation India",
          message: `Profession: ${details.profession}\nAssociation with paper: ${details.paperAssociation}\nOther details: ${details.otherDetails}`,
        }),
      });
      if (!response.ok) throw new Error();
      setStatus("sent");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.pageBanner}>
          <span>Paper Foundation India</span>
          <strong>Join us</strong>
          <small>Membership desk / 03</small>
        </div>
        <div className={styles.joinCopy}>
          <Link href="/">
            <ArrowLeft /> Back to home
          </Link>
          <p>Membership correspondence</p>
          <h1>
            Put your name
            <br />
            <em>behind the work.</em>
          </h1>
          <span>
            Complete the digital version of the Foundation&apos;s official
            application. There is no financial commitment or membership fee.
          </span>
          <aside>
            <ShieldCheck />
            <div><small>Main objective</small><strong>Love paper. Encourage its responsible use.</strong></div>
          </aside>
        </div>
        <div className={styles.paper}>
          <header>
            <div>
              <FileEdit />
              <span>My details</span>
            </div>
            <small>Official digital application</small>
          </header>
          {status === "sent" ? (
            <div className={styles.success}>
              <Check />
              <h2>Application received.</h2>
              <p>
                Thank you for supporting a fair and responsible paper
                conversation.
              </p>
              <button onClick={() => setStatus("idle")}>
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label>
                <span>Name *</span>
                <input required name="name" />
              </label>
              <label>
                <span>Organization Name</span>
                <input name="organisation" />
              </label>
              <label>
                <span>Designation</span>
                <input name="designation" />
              </label>
              <label className={styles.full}>
                <span>Address *</span>
                <textarea required name="address" rows={3} />
              </label>
              <label>
                <span>Mobile No. *</span>
                <input required name="mobile" type="tel" />
              </label>
              <label>
                <span>Email ID *</span>
                <input required name="email" type="email" />
              </label>
              <label>
                <span>Profession *</span>
                <input required name="profession" />
              </label>
              <label className={styles.full}>
                <span>Any association with paper</span>
                <textarea name="paperAssociation" rows={3} />
              </label>
              <label className={styles.full}>
                <span>Any Other Details</span>
                <textarea name="otherDetails" rows={4} />
              </label>
              <footer>
                <p>
                  By submitting, you confirm that the details are accurate and
                  may be used to contact you about membership.
                </p>
                <button disabled={status === "sending"}>
                  {status === "sending" ? "Submitting…" : "Submit application"}
                  <Send />
                </button>
              </footer>
              {status === "error" && (
                <p className={styles.error}>
                  The application could not be sent. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
      <section className={styles.after}>
        <span>Need a different route?</span>
        <Link href="/contact">
          <Mail /> Contact us <ExternalLink />
        </Link>
        <Link href="/report">
          <Flag /> Report a claim <ExternalLink />
        </Link>
      </section>
    </main>
  );
}
