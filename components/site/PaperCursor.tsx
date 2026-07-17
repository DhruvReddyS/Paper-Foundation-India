"use client";

import { useEffect, useRef } from "react";

const interactiveSelector = "a, button, input, textarea, select, summary, [role='button'], [data-paper-cursor]";

export default function PaperCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointRef = useRef({ x: -80, y: -80 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    document.documentElement.dataset.paperCursor = "on";

    function paint() {
      const cursor = cursorRef.current;
      if (!cursor) return;
      cursor.style.setProperty("--cursor-x", `${pointRef.current.x}px`);
      cursor.style.setProperty("--cursor-y", `${pointRef.current.y}px`);
      rafRef.current = null;
    }

    function move(event: PointerEvent) {
      pointRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current === null) rafRef.current = window.requestAnimationFrame(paint);
      cursorRef.current?.classList.add("is-visible");
    }

    function hover(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null;
      cursorRef.current?.classList.toggle("is-hovering", Boolean(target));
      cursorRef.current?.classList.toggle("is-writing", Boolean(target?.matches("input, textarea, select")));
    }

    function press() { cursorRef.current?.classList.add("is-pressed"); }
    function release() { cursorRef.current?.classList.remove("is-pressed"); }
    function leave() { cursorRef.current?.classList.remove("is-visible"); }

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", hover, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      delete document.documentElement.dataset.paperCursor;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", hover);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("mouseleave", leave);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={cursorRef} className="paper-cursor" aria-hidden="true"><i /><span>OPEN</span></div>;
}
