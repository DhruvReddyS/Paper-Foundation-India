import GameHub from "@/components/games/GameHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Games Lab",
  description:
    "Five short, evidence-led games about paper: a living quiz, a claim-verification press, a mill process puzzle, a hidden-material clue hunt and a timed fibre word search.",
  path: "/games",
  canonicalPath: "/discover",
});

export default function GamesPage() {
  return <GameHub />;
}
