export const gameIds = [
  "grow-or-shred",
  "truth-press",
  "mill-master",
  "hidden-paper",
  "paper-word-search",
] as const;

export type GameId = (typeof gameIds)[number];

export type GameDefinition = {
  id: GameId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  href: string;
  description: string;
  hook: string;
  verb: string;
  duration: string;
  difficulty: string;
  skill: string;
  theme: "botanical" | "press" | "mill" | "detective" | "type";
};

export const gameCatalog: GameDefinition[] = [
  {
    id: "grow-or-shred",
    number: "01",
    title: "Grow or Shred",
    shortTitle: "Grow",
    subtitle: "A living evidence quiz",
    href: "/discover/grow-or-shred",
    description:
      "Answer paper questions and grow a living tree. Correct context builds branches and leaves; weak assumptions return to fibre.",
    hook: "Grow the facts. Shred the assumptions.",
    verb: "Cultivate",
    duration: "4–6 min",
    difficulty: "Adaptive",
    skill: "Evidence recall",
    theme: "botanical",
  },
  {
    id: "truth-press",
    number: "02",
    title: "The Truth Press",
    shortTitle: "Press",
    subtitle: "A claim-verification desk",
    href: "/discover/truth-press",
    description:
      "Stamp each claim Myth or Fact, then inspect the evidence before the next sheet enters the press.",
    hook: "Put every claim under pressure.",
    verb: "Investigate",
    duration: "5–7 min",
    difficulty: "Considered",
    skill: "Claim verification",
    theme: "press",
  },
  {
    id: "mill-master",
    number: "03",
    title: "Paper Mill Shuffle",
    shortTitle: "Mill",
    subtitle: "A process engineering puzzle",
    href: "/discover/mill-master",
    description:
      "Rebuild the production line by moving eight papermaking stages into the only sequence that keeps the sheet running.",
    hook: "One misplaced stage stops the mill.",
    verb: "Engineer",
    duration: "3–5 min",
    difficulty: "Hands-on",
    skill: "Process sequencing",
    theme: "mill",
  },
  {
    id: "hidden-paper",
    number: "04",
    title: "Hidden Paper",
    shortTitle: "Hidden",
    subtitle: "A material clue hunt",
    href: "/discover/hidden-paper",
    description:
      "Find engineered paper in unexpected products. Every extra clue sharpens the image but reduces the available score.",
    hook: "Paper is hiding in plain sight.",
    verb: "Inspect",
    duration: "4–6 min",
    difficulty: "Observant",
    skill: "Material literacy",
    theme: "detective",
  },
  {
    id: "paper-word-search",
    number: "05",
    title: "Fibre Word Search",
    shortTitle: "Words",
    subtitle: "A timed vocabulary grid",
    href: "/discover/paper-word-search",
    description:
      "A new ten-word paper puzzle is generated for every run. Search horizontally, vertically and diagonally before time runs out.",
    hook: "Ten words. One fresh grid. Five minutes.",
    verb: "Search",
    duration: "Up to 5 min",
    difficulty: "Fast",
    skill: "Vocabulary",
    theme: "type",
  },
];

export function getGameDefinition(id: GameId) {
  return gameCatalog.find((game) => game.id === id)!;
}
