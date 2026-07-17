import CorrespondencePage from "@/components/site/CorrespondencePage";

export const metadata = {
  title: "Report a Claim | Paper Foundation India",
  description: "Send a paper-related claim or possible misinformation to the Foundation for contextual review.",
};

export default function ReportPage() {
  return <CorrespondencePage mode="report" />;
}
