import GlossaryTermList from "./sections/GlossaryTermList";

export const metadata = {
  title: "Glossary | Paper Foundation India",
  description:
    "A comprehensive A–Z glossary of paper industry and sustainability terminology.",
};

export default async function GlossaryPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = "" } = await searchParams;
  return <GlossaryTermList key={search} initialSearch={search} />;
}
