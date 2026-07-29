"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import RouteLogoLoader from "@/components/site/RouteLogoLoader";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <div className="paper-page-transition">
      <AnimatePresence mode="wait" initial={false}>
        {!reduced && (
          <motion.div
            key={pathname}
            className="route-logo-transition"
            role="status"
            aria-label="Loading page"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .3, delay: .68, ease: [0.22, 1, 0.36, 1] }}
          >
            <RouteLogoLoader pathname={pathname} />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
