"use client";

import { useEffect } from "react";

export default function HomeReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".home-shell > section:not(:first-child), .home-shell [data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}
