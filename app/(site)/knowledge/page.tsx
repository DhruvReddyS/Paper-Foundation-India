import KnowledgeExperience from "@/components/editorial/KnowledgeExperience";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Knowledge Studio | Evidence-led reading on paper",
  description:
    "Long-form articles and explainers on fibre sourcing, recovery, recycling science and circular material systems, each with its sources listed.",
  path: "/knowledge",
  keywords: ["paper articles", "paper recycling explained", "fibre sourcing"],
});
export default function KnowledgePage() { return <KnowledgeExperience />; }
