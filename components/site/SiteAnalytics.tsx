"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function contentFromPath(path: string) {
  if (path.startsWith("/knowledge/") && path !== "/knowledge/featured") return { contentType: "article", contentId: path.split("/").filter(Boolean).at(-1) };
  if (path === "/myths") return { contentType: "myth-library", contentId: "myths" };
  if (path.startsWith("/discover/")) return { contentType: "game", contentId: path.split("/").at(-1) };
  return {};
}

/**
 * The pages where someone is doing more than reading. A click that leads to
 * one of these is the second step the reader journey on the dashboard is
 * trying to measure.
 */
const CONVERSION_ROUTES = ["/join", "/contact", "/report"];

function sessionId() {
  const key = "pfi-session-id";
  const current = window.sessionStorage.getItem(key);
  if (current) return current;
  const next = window.crypto.randomUUID();
  window.sessionStorage.setItem(key, next);
  return next;
}

function send(body: Record<string, unknown>) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });
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
    send({ event, path: pathname, ...context, sessionId: sessionId() });

    function click(mouse: MouseEvent) {
      const target = mouse.target instanceof Element ? mouse.target.closest("button, a") : null;
      if (!target) return;

      // A call to action: either marked explicitly, or a link to one of the
      // pages where a reader does something. Without this nothing in the site
      // ever recorded cta_click, so the last step of the reader journey on the
      // dashboard sat at zero no matter how many people acted.
      const marked = target.closest("[data-cta]");
      const href = target instanceof HTMLAnchorElement ? target.getAttribute("href") : null;
      const route = href && CONVERSION_ROUTES.find(item => href === item || href.startsWith(`${item}?`) || href.startsWith(`${item}#`));
      if (marked || route) {
        send({
          event: "cta_click",
          path: pathname,
          contentType: "cta",
          contentId: marked?.getAttribute("data-cta") || route || "cta",
          sessionId: sessionId(),
        });
        return;
      }

      // Myth reveals. Keyed on the myth's own id rather than the words on the
      // button, which changed with every copy edit and split one myth into
      // several rows in the ranking.
      const myth = target.closest("[data-myth]");
      if (!myth) return;
      send({
        event: "myth_interaction",
        path: pathname,
        contentType: "myth",
        contentId: myth.getAttribute("data-myth") || "unknown",
        sessionId: sessionId(),
      });
    }

    function scroll() {
      if (context.contentType !== "article" || completed.current) return;
      const progress = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (progress < .82) return;
      completed.current = true;
      send({ event: "article_complete", path: pathname, ...context, sessionId: sessionId(), durationSeconds: Math.round((Date.now() - started.current) / 1000) });
    }

    function leave() {
      if (context.contentType !== "article") return;
      const body = JSON.stringify({ event: "article_open", path: pathname, ...context, sessionId: sessionId(), durationSeconds: Math.round((Date.now() - started.current) / 1000), metadata: { heartbeat: true } });
      navigator.sendBeacon?.("/api/analytics", new Blob([body], { type: "application/json" }));
    }

    document.addEventListener("click", click);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pagehide", leave);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pagehide", leave);
    };
  }, [pathname]);

  return null;
}
