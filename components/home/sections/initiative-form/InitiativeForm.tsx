"use client";

import { ArrowDownToLine, ArrowLeft, ArrowRight, Check, FileCheck2, FileText, Flag, Send, Sparkles, UploadCloud, Users } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import styles from "./InitiativeForm.module.css";

export default function InitiativeForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"online" | "pdf">("online");
  const [uploadName, setUploadName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function nextStep(button: HTMLButtonElement) {
    const form = button.form;
    if (!form) return;
    const required = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-step="1"] input[required], [data-step="1"] textarea[required]'));
    const invalid = required.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    setStep(2);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    const form = new FormData(event.currentTarget);
    const details = Object.fromEntries(form.entries());
    try {
      let attachmentUrl = "";
      let attachmentName = "";
      if (method === "pdf") {
        const file = fileRef.current?.files?.[0];
        if (!file) throw new Error("Choose your completed and signed PDF.");
        const upload = new FormData();
        upload.set("file", file);
        const uploadResponse = await fetch("/api/membership-upload", { method: "POST", body: upload });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "The PDF could not be uploaded.");
        attachmentUrl = uploadResult.url;
        attachmentName = uploadResult.name;
      }
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Membership Application",
          name: details.name,
          email: details.email,
          subject: method === "pdf" ? "Signed membership PDF" : "Join Paper Foundation India",
          message: method === "pdf"
            ? "A completed and signed membership application PDF was uploaded through the public membership desk."
            : `Mobile: ${details.mobile}\nOrganisation: ${details.organisation || "Not provided"}\nDesignation: ${details.designation || "Not provided"}\nProfession: ${details.profession}\nAddress: ${details.address}\nAssociation with paper: ${details.paperAssociation}\nContribution: ${details.otherDetails || "Not provided"}`,
          attachmentUrl,
          attachmentName,
        }),
      });
      if (!response.ok) throw new Error("The application could not be recorded.");
      setStatus("sent");
      setStep(1);
      setUploadName("");
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The application could not be sent.");
      setStatus("error");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.campaignSide}>
          <div className={styles.story}>
            <p><Sparkles /> A PUBLIC CAMPAIGN FOR MATERIAL LITERACY</p>
            <h1>Bring your<br /><em>point of view.</em></h1>
            <span>Membership is a way to raise a useful question, carry responsible ideas into public life and help better information travel further.</span>
          </div>
          <CampaignScene />
        </div>

        <div className={styles.formPanel}>
          {status === "sent" ? (
            <div className={styles.success}><Check /><small>APPLICATION RECEIVED</small><h2>Your membership application is with the team.</h2><p>Thank you for adding your perspective to the Foundation.</p><button onClick={() => setStatus("idle")}>Submit another</button></div>
          ) : (
            <form onSubmit={submit}>
              <header><div><Users /><span>{method === "pdf" ? "Signed PDF application" : step === 1 ? "Your essentials" : "Your perspective"}</span></div><small>No membership fee</small></header>
              <div className={styles.methodPicker} aria-label="Choose an application method">
                <button type="button" className={method === "online" ? styles.activeMethod : ""} onClick={() => { setMethod("online"); setStep(1); setStatus("idle"); }}>
                  <FileText /><span><b>Apply online</b><small>Complete the web form</small></span>
                </button>
                <button type="button" className={method === "pdf" ? styles.activeMethod : ""} onClick={() => { setMethod("pdf"); setStatus("idle"); }}>
                  <FileCheck2 /><span><b>Upload signed PDF</b><small>Download, sign and return</small></span>
                </button>
              </div>
              {method === "online" && <div className={styles.stepper} aria-label="Application progress">
                <button type="button" className={step === 1 ? styles.activeStep : styles.completeStep} onClick={() => setStep(1)} aria-current={step === 1 ? "step" : undefined}><b>01</b><span>About you</span></button>
                <i />
                <button type="button" className={step === 2 ? styles.activeStep : ""} onClick={() => step === 2 && setStep(2)} aria-current={step === 2 ? "step" : undefined}><b>02</b><span>Your interest</span></button>
              </div>}
              {method === "online" && <fieldset data-step="1" className={`${styles.fields} ${step !== 1 ? styles.hiddenStep : ""}`}>
                <label><span>Name *</span><input required name="name" autoComplete="name" placeholder="Full name" /></label>
                <label><span>Email *</span><input required name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
                <label><span>Mobile *</span><input required name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" /></label>
                <label><span>Profession *</span><input required name="profession" placeholder="What do you do?" /></label>
                <label><span>Organisation</span><input name="organisation" autoComplete="organization" placeholder="Optional" /></label>
                <label><span>Designation</span><input name="designation" placeholder="Optional" /></label>
              </fieldset>}
              {method === "online" && <fieldset data-step="2" className={`${styles.fields} ${step !== 2 ? styles.hiddenStep : ""}`}>
                <label className={styles.full}><span>Address *</span><input required name="address" autoComplete="street-address" placeholder="City and postal address" /></label>
                <label className={styles.full}><span>Your connection to paper *</span><textarea required name="paperAssociation" rows={3} minLength={20} placeholder="Work, study, craft, recovery, research or simple curiosity" /></label>
                <label className={styles.full}><span>What would you like to contribute?</span><textarea name="otherDetails" rows={2} placeholder="A skill, question, project or perspective" /></label>
              </fieldset>}
              {method === "pdf" && <div className={styles.pdfFlow}>
                <a href="/downloads/paper-foundation-membership-application.pdf" download>
                  <span><ArrowDownToLine /><b>Download the application</b></span>
                  <small>Fill it digitally, add your signature and save the PDF.</small>
                </a>
                <div className={styles.pdfArrow}><ArrowRight /></div>
                <label className={styles.uploadDrop}>
                  <UploadCloud />
                  <span>{uploadName || "Choose signed PDF"}</span>
                  <small>PDF only, maximum 8 MB</small>
                  <input ref={fileRef} required type="file" name="membershipPdf" accept="application/pdf,.pdf" onChange={(event) => setUploadName(event.currentTarget.files?.[0]?.name || "")} />
                </label>
                <div className={styles.pdfIdentity}>
                  <label><span>Name *</span><input required name="name" autoComplete="name" placeholder="Full name" /></label>
                  <label><span>Email *</span><input required name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
                </div>
              </div>}
              <footer>
                <p>{method === "pdf" ? "Your document is stored securely with the application record." : step === 1 ? "We only ask for information needed to review and respond to your application." : "By submitting, you allow the Foundation to contact you about membership."}</p>
                <div className={styles.formActions}>
                  {method === "online" && step === 2 && <button type="button" className={styles.backButton} onClick={() => setStep(1)}><ArrowLeft /> Back</button>}
                  {method === "online" && step === 1
                    ? <button type="button" onClick={(event) => nextStep(event.currentTarget)}>Continue <ArrowRight /></button>
                    : <button disabled={status === "sending"}>{status === "sending" ? method === "pdf" ? "Uploading..." : "Sending..." : "Submit application"}<Send /></button>}
                </div>
              </footer>
              {status === "error" && <p className={styles.error}>{errorMessage || "The application could not be sent. Please try again."}</p>}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function CampaignScene() {
  return (
    <div className={styles.campaign} aria-hidden="true">
      <div className={styles.campaignBanner}><Flag /><span>THE FOUNDATION NEEDS<br /><b>MORE POINTS OF VIEW.</b></span></div>
      <article className={styles.placardOne}><span>ASK</span><b>BETTER<br />QUESTIONS</b><i /></article>
      <article className={styles.placardTwo}><span>USE</span><b>PAPER<br />RESPONSIBLY</b><i /></article>
      <article className={styles.placardThree}><span>KNOW</span><b>THE<br />SOURCE</b><i /></article>
      <div className={`${styles.hand} ${styles.handOne}`}><i /><b /></div>
      <div className={`${styles.hand} ${styles.handTwo}`}><i /><b /></div>
      <div className={`${styles.hand} ${styles.handThree}`}><i /><b /></div>
      <footer><Users /><span>EDUCATION / DESIGN / RECOVERY / RESEARCH / PUBLIC LIFE</span></footer>
    </div>
  );
}
