import AdminDashboard from "@/components/admin/AdminDashboard";
import { overviewReport } from "@/lib/overview-report";

// Read fresh on every visit rather than cached.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  return <AdminDashboard initial={await overviewReport()} />;
}
