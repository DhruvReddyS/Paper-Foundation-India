import MillMasterGame from "@/components/games/MillMasterGame";
import StructuredData from "@/components/site/StructuredData";
import { breadcrumbSchema, gameSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Paper Mill Shuffle | Rebuild the production line",
  description:
    "Eight papermaking stages are out of order. Drag them into the only sequence that turns recovered paper into a finished reel.",
  path: "/discover/mill-master",
});

export default function MillMasterPage() {
  return (
    <>
      <StructuredData
        schema={[
          gameSchema({
            name: "Paper Mill Shuffle",
            description: "Eight papermaking stages are out of order. Drag them into the only sequence that turns recovered paper into a finished reel.",
            path: "/discover/mill-master",
            genre: "Process puzzle",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Game Lab", path: "/discover" },
            { name: "Paper Mill Shuffle", path: "/discover/mill-master" },
          ]),
        ]}
      />
      <MillMasterGame />
    </>
  );
}
