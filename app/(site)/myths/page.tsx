import MythsExperience from "@/components/editorial/MythsExperience";

export const metadata = { title: "Myths vs Facts | Paper Foundation India", description: "Put familiar paper claims under pressure with evidence and context." };

export default async function MythsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = "" } = await searchParams;
  return <MythsExperience key={search} initialSearch={search} />;
}
