"use client";

import { ArrowRight, Eye, EyeOff, LoaderCircle } from "@/components/paper-ui/icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function AdminLoginAction({ preview }: { preview: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);
  // Most administrators do not have two-factor enabled, so an always-visible
  // code field is a question almost nobody needs to answer. It appears on
  // request, and on its own when the server says the account requires it.
  const [codeVisible, setCodeVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  if (preview) {
    return <Link className="admin-signin-submit" href="/admin">Enter the admin workspace</Link>;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setWorking(true);
    setError("");
    const result = await signIn("credentials", { username, password, otp, redirect: false, callbackUrl: "/admin" });
    setWorking(false);
    if (!result?.ok) {
      if (result?.error === "ACCOUNT_LOCKED") {
        setError("Too many failed attempts. Try again in 15 minutes.");
      } else if (result?.error === "MFA_REQUIRED") {
        setCodeVisible(true);
        setError("This account needs the code from your authenticator app.");
      } else if (result?.error === "MFA_INVALID") {
        setCodeVisible(true);
        setError("That security or recovery code is not valid.");
      } else {
        setError("That user ID and password do not match.");
      }
      return;
    }
    // Deliberately relative, not result.url. NextAuth builds that from
    // NEXTAUTH_URL, so a mismatch between it and the origin actually being
    // served sends a successfully authenticated administrator to another
    // host. The credentials flow always ends on this origin's /admin.
    window.location.assign("/admin");
  }

  return (
    <form className="admin-credential-form" onSubmit={submit}>
      <label>
        <span>User ID</span>
        <div>
          <input
            autoFocus
            autoComplete="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            placeholder="Your administrator ID"
            required
            minLength={3}
          />
        </div>
      </label>

      <label>
        <span>Password</span>
        <div>
          <input
            autoComplete="current-password"
            type={show ? "text" : "password"}
            value={password}
            onChange={event => setPassword(event.target.value)}
            onKeyUp={event => setCapsLock(event.getModifierState?.("CapsLock") ?? false)}
            required
          />
          <button type="button" onClick={() => setShow(value => !value)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </label>

      {capsLock && <p className="admin-signin-caps">Caps Lock is on.</p>}

      {codeVisible && (
        <label>
          <span>Security code</span>
          <div>
            <input
              autoComplete="one-time-code"
              inputMode="numeric"
              value={otp}
              onChange={event => setOtp(event.target.value)}
              placeholder="6-digit or recovery code"
              maxLength={32}
            />
          </div>
        </label>
      )}

      {error && <p className="admin-login-error" role="alert">{error}</p>}

      <button className="admin-signin-submit" disabled={working}>
        {working ? <span><LoaderCircle className="is-spinning" /> Checking</span> : <span>Sign in <ArrowRight /></span>}
      </button>

      {!codeVisible && (
        <button type="button" className="admin-signin-otp" onClick={() => setCodeVisible(true)}>
          Use a security code
        </button>
      )}
    </form>
  );
}
