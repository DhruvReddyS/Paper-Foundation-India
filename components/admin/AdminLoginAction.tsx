"use client";

import { ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, UserRound } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function AdminLoginAction({ preview }: { preview: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  if (preview) {
    return (
      <Link className="admin-login-modern-action" href="/admin">
        <span className="admin-login-preview-mark">PF</span>
        <strong>Enter admin workspace</strong>
        <ArrowRight />
      </Link>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setWorking(true);
    setError("");
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    setWorking(false);
    if (!result?.ok) {
      setError(result?.error === "ACCOUNT_LOCKED" ? "Too many attempts. Try again in 15 minutes." : "User ID or password is incorrect.");
      return;
    }
    window.location.assign(result.url || "/admin");
  }

  return (
    <form className="admin-credential-form" onSubmit={submit}>
      <label><span>User ID</span><div><UserRound /><input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} placeholder="Enter your admin ID" required minLength={3} /></div></label>
      <label><span>Password</span><div><KeyRound /><input autoComplete="current-password" type={show ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" required minLength={8} /><button type="button" onClick={() => setShow(value => !value)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff /> : <Eye />}</button></div></label>
      {error && <p className="admin-login-error" role="alert">{error}</p>}
      <button className="admin-login-modern-action" disabled={working}>
        {working ? <LoaderCircle className="is-spinning" /> : <span className="admin-login-preview-mark">PF</span>}
        <strong>{working ? "Checking access..." : "Sign in securely"}</strong>
        <ArrowRight />
      </button>
    </form>
  );
}
