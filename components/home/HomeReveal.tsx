"use client";

import { useEffect } from "react";

export default function HomeReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".home-shell > section:not(:first-child)");
    const details = document.querySelectorAll<HTMLElement>(".home-shell [data-reveal]");
    const reveal = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      });
    };
    // Whole sections must reveal at their leading edge. Ratio thresholds leave
    // intentionally tall sticky stories blank for almost a full viewport.
    const sectionObserver = new IntersectionObserver(reveal, {
      threshold: 0,
      rootMargin: "0px 0px -1px 0px",
    });
    const detailObserver = new IntersectionObserver(reveal, {
      threshold: .12,
      rootMargin: "0px 0px -8% 0px",
    });
    sections.forEach((element) => sectionObserver.observe(element));
    details.forEach((element) => detailObserver.observe(element));
    return () => {
      sectionObserver.disconnect();
      detailObserver.disconnect();
    };
  }, []);
  return null;
}
