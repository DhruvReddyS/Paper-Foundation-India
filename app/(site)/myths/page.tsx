import MythsExperience from "@/components/editorial/MythsExperience";
import StructuredData from "@/components/site/StructuredData";
import mythCatalog from "@/content/mythCatalog.json";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Myths vs Facts | Paper claims under pressure",
  description:
    "Sixty familiar paper claims stamped myth, fact or needs context, each with the correction, the reasoning and the source behind it.",
  path: "/myths",
  keywords: ["paper myths", "paper facts", "paper misinformation", "is paper sustainable"],
});

export default async function MythsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = "" } = await searchParams;
  return (
    <>
      {/* The answer text here is the same correction the page shows, which is
          what a FAQPage requires. Only the first twenty are described, to keep
          the payload proportionate to the page. */}
      <StructuredData
        schema={[
          faqSchema(
            mythCatalog.slice(0, 20).map((item) => ({
              question: item.myth,
              answer: `${item.reality} ${item.explanation}`.trim(),
            }))
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Myths vs Facts", path: "/myths" },
          ]),
        ]}
      />
      <MythsExperience key={search} initialSearch={search} />
    </>
  );
}
