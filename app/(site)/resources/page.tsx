import ResourceGrid from "./sections/ResourceGrid";

export const metadata = {
  title: "Resources & Downloads | Paper Foundation India",
  description:
    "Access curated research papers, reports, toolkits, and infographics about India's paper industry and sustainability.",
};

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = "" } = await searchParams;
  return <ResourceGrid key={search} initialSearch={search} />;
}
