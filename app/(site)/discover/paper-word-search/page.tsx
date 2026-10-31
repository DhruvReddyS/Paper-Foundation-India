import PaperWordSearchGame from "@/components/games/PaperWordSearchGame";
import StructuredData from "@/components/site/StructuredData";
import { breadcrumbSchema, gameSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Fibre Word Search | A fresh grid every round",
  description:
    "A newly generated paper-vocabulary grid for every run. Search in eight directions and finish the transcript before the clock does.",
  path: "/discover/paper-word-search",
});

export default function PaperWordSearchPage() {
  return (
    <>
      <StructuredData
        schema={[
          gameSchema({
            name: "Fibre Word Search",
            description: "A newly generated paper-vocabulary grid for every run. Search in eight directions and finish the transcript before the clock does.",
            path: "/discover/paper-word-search",
            genre: "Word puzzle",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Game Lab", path: "/discover" },
            { name: "Fibre Word Search", path: "/discover/paper-word-search" },
          ]),
        ]}
      />
      <PaperWordSearchGame />
    </>
  );
}
