import HiddenPaperGame from "@/components/games/HiddenPaperGame";
import StructuredData from "@/components/site/StructuredData";
import { breadcrumbSchema, gameSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hidden Paper | Find the fibre you missed",
  description:
    "Tea bags, speaker cones, air filters and sandpaper. Identify engineered paper in unexpected products using as few clues as you can.",
  path: "/discover/hidden-paper",
});

export default function HiddenPaperPage() {
  return (
    <>
      <StructuredData
        schema={[
          gameSchema({
            name: "Hidden Paper",
            description: "Tea bags, speaker cones, air filters and sandpaper. Identify engineered paper in unexpected products using as few clues as you can.",
            path: "/discover/hidden-paper",
            genre: "Material clue hunt",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Game Lab", path: "/discover" },
            { name: "Hidden Paper", path: "/discover/hidden-paper" },
          ]),
        ]}
      />
      <HiddenPaperGame />
    </>
  );
}
