import GameHub from "@/components/games/GameHub";
import StructuredData from "@/components/site/StructuredData";
import { gameCatalog } from "@/components/games/gameCatalog";
import { breadcrumbSchema, collectionSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Game Lab | Five playable paper experiments",
  description:
    "Five short, evidence-led games about paper: a living quiz, a claim-verification press, a mill process puzzle, a hidden-material clue hunt and a timed fibre word search.",
  path: "/discover",
  keywords: ["paper games", "recycling game", "educational games paper", "paper quiz"],
});

export default function DiscoverPage() {
  return (
    <>
      <StructuredData
        schema={[
          collectionSchema({
            name: "The Game Lab",
            description: "Five short, evidence-led games about paper: a living quiz, a claim-verification press, a mill process puzzle, a hidden-material clue hunt and a timed fibre word search.",
            path: "/discover",
            items: gameCatalog.map((game) => ({ name: game.title, path: game.href })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Game Lab", path: "/discover" },
          ]),
        ]}
      />
      <GameHub />
    </>
  );
}
