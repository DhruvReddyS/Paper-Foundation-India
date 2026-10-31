import IndiaPaperLedger from "@/components/editorial/IndiaPaperLedger";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "India Paper Ledger | Production, recovery, trade and people",
  description:
    "Sourced figures on Indian paper production, recycled fibre share, recovery rates, trade flows and employment, each with the reference it came from.",
  path: "/india-snapshot",
  keywords: ["India paper production", "paper recycling rate India", "paper industry statistics India"],
});

export default function IndiaSnapshotPage() {
  return <IndiaPaperLedger />;
}
