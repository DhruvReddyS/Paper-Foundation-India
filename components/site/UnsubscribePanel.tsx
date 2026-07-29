"use client";

import { CheckCircle2, MailX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UnsubscribePanel({ email, token }: { email: string; token: string }) {
  const [status, setStatus] = useState<"ready" | "working" | "done" | "error">("ready");
  async function unsubscribe() {
    setStatus("working");
    const response = await fetch("/api/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, token }) });
    setStatus(response.ok ? "done" : "error");
  }
  return <main className="unsubscribe-page"><section>{status === "done" ? <CheckCircle2 /> : <MailX />}<p>PAPER FOUNDATION INDIA</p><h1>{status === "done" ? "You are unsubscribed." : "Change your email preference."}</h1><p>{status === "done" ? `${email} will no longer receive reader updates.` : "You can stop reader updates from this address at any time."}</p>{status === "ready" && <button onClick={() => void unsubscribe()}>Unsubscribe {email}</button>}{status === "working" && <button disabled>Updating...</button>}{status === "error" && <p>This link is not valid. Contact the Foundation for help.</p>}<Link href="/">Return home</Link></section></main>;
}
