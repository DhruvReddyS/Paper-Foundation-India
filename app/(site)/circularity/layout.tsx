import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Paper Circularity | Source, make, use, recover",
  description:
    "Follow fibre through six stages, from traceable sourcing and sheet forming to use, collection and recovery, and see where a paper product leaves the loop.",
  path: "/circularity",
  keywords: ["paper circularity", "circular economy paper", "fibre recovery", "paper lifecycle"],
});

export default function CircularityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
