"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="paper-page-transition"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: reduced ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {!reduced && (
          <motion.div
            className="paper-transition-sheet"
            aria-hidden="true"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
          >
            <i />
            <span>Paper Foundation India</span>
          </motion.div>
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
