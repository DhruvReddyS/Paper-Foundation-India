import GrowOrShredGame from "@/components/games/GrowOrShredGame";
import StructuredData from "@/components/site/StructuredData";
import { breadcrumbSchema, gameSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Grow or Shred | A living evidence quiz",
  description:
    "Answer sourced questions about paper, forestry and recovery and grow a living tree. Correct context builds the canopy; weak assumptions return to fibre.",
  path: "/discover/grow-or-shred",
});

export default function GrowOrShredPage() {
  return (
    <>
      <StructuredData
        schema={[
          gameSchema({
            name: "Grow or Shred",
            description: "Answer sourced questions about paper, forestry and recovery and grow a living tree. Correct context builds the canopy; weak assumptions return to fibre.",
            path: "/discover/grow-or-shred",
            genre: "Educational quiz",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Game Lab", path: "/discover" },
            { name: "Grow or Shred", path: "/discover/grow-or-shred" },
          ]),
        ]}
      />
      <GrowOrShredGame />
    </>
  );
}
