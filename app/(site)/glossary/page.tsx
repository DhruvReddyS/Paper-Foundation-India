import GlossaryTermList from "./sections/GlossaryTermList";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Glossary | A to Z of paper and fibre terms",
  description:
    "Clear definitions for the language of paper: grades, furnish, deinking, consistency, recovery and the rest of the working vocabulary.",
  path: "/glossary",
  keywords: ["paper glossary", "pulp and paper terms", "papermaking vocabulary"],
});

export default async function GlossaryPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = "" } = await searchParams;
  return <GlossaryTermList key={search} initialSearch={search} />;
}
