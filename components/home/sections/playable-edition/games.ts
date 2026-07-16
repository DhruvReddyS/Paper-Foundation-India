import { Factory, Puzzle, ScanSearch, Stamp, Trees, type LucideIcon } from "lucide-react";

export type PlayableGame = {
  number: string;
  title: string;
  note: string;
  format: string;
  interaction: string;
  href: string;
  icon: LucideIcon;
};

export const playableGames: PlayableGame[] = [
  {
    number: "01",
    title: "Grow or Shred",
    note: "Grow evidence into a living tree",
    format: "Paper IQ",
    interaction: "Tap + learn",
    href: "/discover/grow-or-shred",
    icon: Trees,
  },
  {
    number: "02",
    title: "The Truth Press",
    note: "Stamp claims with the right verdict",
    format: "Claim lab",
    interaction: "Tap + learn",
    href: "/discover/truth-press",
    icon: Stamp,
  },
  {
    number: "03",
    title: "Mill Shuffle",
    note: "Build a working paper mill line",
    format: "Process",
    interaction: "Drag + order",
    href: "/discover/mill-master",
    icon: Factory,
  },
  {
    number: "04",
    title: "Hidden Paper",
    note: "Find fibre hiding in daily life",
    format: "Clue hunt",
    interaction: "Clues + reveal",
    href: "/discover/hidden-paper",
    icon: ScanSearch,
  },
  {
    number: "05",
    title: "Fibre Crossword",
    note: "Solve ten paper words before the clock wins",
    format: "Speed grid",
    interaction: "Type + race",
    href: "/discover/paper-crossword",
    icon: Puzzle,
  },
];
