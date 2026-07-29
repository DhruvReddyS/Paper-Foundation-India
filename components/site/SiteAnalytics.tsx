"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function contentFromPath(path: string) {
  if (path.startsWith("/knowledge/") && path !== "/knowledge/featured") return { contentType: "article", contentId: path.split("/").filter(Boolean).at(-1) };
  if (path === "/myths") return { contentType: "myth-library", contentId: "myths" };
  if (path.startsWith("/discover/")) return { contentType: "game", contentId: path.split("/").at(-1) };
  return {};
}

function sessionId() {
  const key = "pfi-session-id";
  const current = window.sessionStorage.getItem(key);
  if (current) return current;
  const next = window.crypto.randomUUID();
  window.sessionStorage.setItem(key, next);
  return next;
}

export default function SiteAnalytics() {
  const pathname = usePathname();
  const started = useRef(Date.now());
  const completed = useRef(false);

  useEffect(() => {
    started.current = Date.now();
    completed.current = false;
    const context = contentFromPath(pathname);
    const event = context.contentType === "article" ? "article_open" : context.contentType === "game" ? "game_open" : "page_view";
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, path: pathname, ...context, sessionId: sessionId() }), keepalive: true });

    function interact(click: MouseEvent) {
      if (pathname !== "/myths") return;
      const target = click.target instanceof Element ? click.target.closest("button, a") : null;
      if (!target || !target.closest("[class*='myth'], [class*='claim']")) return;
      void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "myth_interaction", path: pathname, contentType: "myth-library", contentId: target.textContent?.trim().slice(0, 120) || "interaction", sessionId: sessionId() }), keepalive: true });
    }
    function scroll() {
      if (context.contentType !== "article" || completed.current) return;
      const progress = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (progress < .82) return;
      completed.current = true;
      void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "article_complete", path: pathname, ...context, sessionId: sessionId(), durationSeconds: Math.round((Date.now() - started.current) / 1000) }), keepalive: true });
    }
    function leave() {
      if (context.contentType !== "article") return;
      const body = JSON.stringify({ event: "article_open", path: pathname, ...context, sessionId: sessionId(), durationSeconds: Math.round((Date.now() - started.current) / 1000), metadata: { heartbeat: true } });
      navigator.sendBeacon?.("/api/analytics", new Blob([body], { type: "application/json" }));
    }
    document.addEventListener("click", interact);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pagehide", leave);
    return () => { document.removeEventListener("click", interact); window.removeEventListener("scroll", scroll); window.removeEventListener("pagehide", leave); };
  }, [pathname]);

  return null;
}
