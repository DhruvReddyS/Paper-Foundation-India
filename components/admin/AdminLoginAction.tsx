"use client";

import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285f4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z" />
      <path fill="#34a853" d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.52c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#fbbc05" d="M6.39 13.88A6.01 6.01 0 0 1 6.08 12c0-.65.11-1.29.31-1.88v-2.6H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.48l3.34-2.6Z" />
      <path fill="#ea4335" d="M12 5.99c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.95 5.52l3.34 2.6C7.18 7.75 9.39 5.99 12 5.99Z" />
    </svg>
  );
}

export function AdminLoginAction({ preview }: { preview: boolean }) {
  if (preview) {
    return (
      <Link className="admin-login-modern-action" href="/admin">
        <span className="admin-login-preview-mark">PF</span>
        <strong>Enter admin workspace</strong>
        <ArrowRight />
      </Link>
    );
  }

  return (
    <button className="admin-login-modern-action" onClick={() => void signIn("google", { callbackUrl: "/admin" })}>
      <GoogleMark />
      <strong>Continue with Google</strong>
      <ArrowRight />
    </button>
  );
}
