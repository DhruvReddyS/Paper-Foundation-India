"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "#f3efe6", color: "#173b29", fontFamily: "system-ui" }}><section style={{ maxWidth: 560, textAlign: "center" }}><p style={{ letterSpacing: ".14em", fontSize: 12 }}>PAPER FOUNDATION INDIA</p><h1 style={{ fontFamily: "Georgia, serif", fontSize: 48, margin: "1rem 0" }}>This page needs another try.</h1><p style={{ color: "#667069", lineHeight: 1.6 }}>The error has been contained. No form should be resubmitted automatically.</p><button onClick={reset} style={{ marginTop: 24, padding: "12px 20px", border: 0, borderRadius: 6, color: "white", background: "#173b29", fontWeight: 700 }}>Try again</button></section></main></body></html>;
}
