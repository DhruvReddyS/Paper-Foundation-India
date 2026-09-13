"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="admin-fatal-state" role="alert">
    <AlertTriangle />
    <p>ADMIN WORKSPACE</p>
    <h1>This area could not be loaded.</h1>
    <span>{error.message || "A service returned an unexpected response."}</span>
    <button onClick={reset}><RefreshCw /> Try again</button>
  </section>;
}
