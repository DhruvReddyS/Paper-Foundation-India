import CorrespondencePage from "@/components/site/CorrespondencePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Report a Claim | Source review desk",
  description:
    "Send a paper-related claim or possible misinformation for source review. Attach the original screenshot or document and the desk will trace it.",
  path: "/report",
  keywords: ["report paper misinformation", "fact check paper claim", "paper myth report"],
});

export default function ReportPage() {
  return <CorrespondencePage mode="report" />;
}
