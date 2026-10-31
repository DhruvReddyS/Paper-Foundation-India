import ResourceGrid from "./sections/ResourceGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resources and Downloads",
  description:
    "Curated research papers, reports, toolkits and reference documents about India's paper industry and material recovery.",
  path: "/resources",
  keywords: ["paper industry reports India", "paper research downloads"],
});

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = "" } = await searchParams;
  return <ResourceGrid key={search} initialSearch={search} />;
}
