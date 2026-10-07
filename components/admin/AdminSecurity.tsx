"use client";

import { Check, Copy, Download, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAdminAccess } from "./AdminShell";

type Status = { configured: boolean; enabled: boolean; recoveryCodesRemaining: number };

export default function AdminSecurity() {
  const { isOwner } = useAdminAccess();
  const [status, setStatus] = useState<Status>({ configured: false, enabled: false, recoveryCodesRemaining: 0 });
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const response = await fetch("/api/admin/mfa", { cache: "no-store" }); const data = await response.json(); if (response.ok) setStatus(data); }, []);
  useEffect(() => { void load(); }, [load]);
  async function act(action: "begin" | "enable" | "disable") {
    setBusy(true); setNotice("");
    const response = await fetch("/api/admin/mfa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...(action === "begin" ? {} : { code }) }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setNotice(data.error || "Security update failed");
    if (action === "begin") { setSecret(data.secret); setQrCode(data.qrCode); setNotice("Scan the code, then enter the six-digit result."); }
    if (action === "enable") { setRecoveryCodes(data.recoveryCodes); setSecret(""); setQrCode(""); setCode(""); setNotice("Two-factor authentication is active. Save the recovery codes now."); await load(); }
    if (action === "disable") { setCode(""); setRecoveryCodes([]); setNotice("Two-factor authentication was disabled."); await load(); }
  }
  const copy = (value: string) => void navigator.clipboard.writeText(value).then(() => setNotice("Copied securely."));
  return <div className="admin-security-page">
    <header className="admin-workspace-heading"><div><p>Account protection and recovery</p><h1>Security centre</h1></div><div>{isOwner && <a className="admin-action" href="/api/admin/export"><Download /> Download owner backup</a>}<button className="admin-action" onClick={() => void load()}><RefreshCw /> Recheck</button></div></header>
    {notice && <div className="admin-notice">{notice}</div>}
    <section className="admin-security-grid">
      <article className="admin-security-card"><header><ShieldCheck /><div><strong>Authenticator protection</strong><span>{status.enabled ? "Enabled" : "Not enabled"}</span></div></header><p>Add a second proof after the password. It works with Google Authenticator, Microsoft Authenticator, 1Password and compatible TOTP apps.</p>{status.enabled ? <div className="admin-security-action"><small>{status.recoveryCodesRemaining} recovery codes remain</small><input value={code} onChange={event => setCode(event.target.value)} placeholder="Current code to disable" /><button disabled={busy || !code} onClick={() => void act("disable")}>Disable 2FA</button></div> : <button className="admin-button" disabled={busy || !status.configured} onClick={() => void act("begin")}><KeyRound /> Start secure setup</button>}</article>
      <article className="admin-security-card"><header><Download /><div><strong>Owner backup export</strong><span>Manual recovery copy</span></div></header><p>Owners can download a timestamped JSON export of CMS content, workflow, audience and audit collections. Password hashes and MFA secrets are excluded.</p>{isOwner ? <a className="admin-button" href="/api/admin/export"><Download /> Download backup</a> : <small>Ask an owner to create protected backups.</small>}</article>
    </section>
    {qrCode && <section className="admin-mfa-setup"><div><Image src={qrCode} alt="Authenticator setup QR code" width={280} height={280} unoptimized /></div><div><p>STEP 1</p><h2>Scan or enter the secret</h2><code>{secret}</code><button onClick={() => copy(secret)}><Copy /> Copy secret</button><p>STEP 2</p><label>Six-digit code<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value)} maxLength={6} /></label><button className="admin-button" disabled={busy || code.length !== 6} onClick={() => void act("enable")}><Check /> Verify and enable</button></div></section>}
    {recoveryCodes.length > 0 && <section className="admin-recovery-codes"><header><div><p>ONE-TIME RECOVERY CODES</p><h2>Store these away from this computer</h2></div><button onClick={() => copy(recoveryCodes.join("\n"))}><Copy /> Copy all</button></header><div>{recoveryCodes.map(item => <code key={item}>{item}</code>)}</div><p>Each code works once. They will not be displayed again.</p></section>}
  </div>;
}
