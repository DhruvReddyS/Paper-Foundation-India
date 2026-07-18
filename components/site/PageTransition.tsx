"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/": "Opening the field edition",
  "/journey": "Binding the paper journey",
  "/knowledge": "Preparing the reading desk",
  "/knowledge/featured": "Opening the feature folio",
  "/myths": "Retrieving the evidence files",
  "/glossary": "Indexing the paper lexicon",
  "/resources": "Gathering source material",
  "/games": "Loading the playable edition",
  "/join": "Preparing the membership folio",
  "/contact": "Opening the correspondence desk",
  "/report": "Preparing the evidence desk",
};

function labelFor(pathname: string) {
  if (routeNames[pathname]) return routeNames[pathname];
  if (pathname.startsWith("/knowledge/")) return "Opening the selected article";
  if (pathname.startsWith("/discover/")) return "Setting the game table";
  return "Turning to the next page";
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="paper-page-transition"
        initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={reduced ? undefined : { opacity: 0, y: -12, filter: "blur(3px)" }}
        transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        {!reduced && (
          <motion.div
            className="route-paper-transition"
            aria-hidden="true"
            initial={{ y: "0%" }}
            animate={{ y: "-105%" }}
            transition={{ duration: 0.86, delay: 0.22, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="route-paper-grain" />
            <motion.div
              className="route-paper-fibre route-paper-fibre-a"
              animate={{ x: [0, 18, 0], rotate: [-8, 7, -8] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="route-paper-fibre route-paper-fibre-b"
              animate={{ x: [0, -14, 0], rotate: [14, -4, 14] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="route-paper-press">
              <span className="route-paper-monogram">P</span>
              <div>
                <small>Paper Foundation India</small>
                <strong>{labelFor(pathname)}</strong>
              </div>
              <i><b /></i>
            </div>
            <div className="route-paper-edge" />
          </motion.div>
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
