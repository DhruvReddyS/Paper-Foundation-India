import AdminAnalytics from "@/components/admin/AdminAnalytics";
import { analyticsReport } from "@/lib/analytics-report";

// The figures are read fresh on every visit rather than cached.
export const dynamic = "force-dynamic";

export default async function Page() {
  return <AdminAnalytics initial={await analyticsReport(30)} />;
}
