import TruthPressGame from "@/components/games/TruthPressGame";
import StructuredData from "@/components/site/StructuredData";
import { breadcrumbSchema, gameSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Truth Press | Stamp the claim",
  description:
    "Read each paper claim and stamp it myth, needs context or fact, then inspect the evidence and the named source before the next sheet enters the press.",
  path: "/discover/truth-press",
});

export default function TruthPressPage() {
  return (
    <>
      <StructuredData
        schema={[
          gameSchema({
            name: "The Truth Press",
            description: "Read each paper claim and stamp it myth, needs context or fact, then inspect the evidence and the named source before the next sheet enters the press.",
            path: "/discover/truth-press",
            genre: "Claim verification",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Game Lab", path: "/discover" },
            { name: "The Truth Press", path: "/discover/truth-press" },
          ]),
        ]}
      />
      <TruthPressGame />
    </>
  );
}
