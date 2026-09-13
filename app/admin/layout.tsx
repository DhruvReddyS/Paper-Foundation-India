import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import AdminShell from "@/components/admin/AdminShell";
import { adminPreviewEnabled, authOptions } from "@/lib/auth";
import "./admin.css";

export const metadata: Metadata = { title: "PFI Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const preview = adminPreviewEnabled();
  const session = preview ? null : await getServerSession(authOptions);
  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;
  return <AdminShell preview={preview} admin={{
    name: preview ? "Preview administrator" : user?.name ?? "Administrator",
    email: preview ? "Local demonstration" : user?.email ?? "",
    role: preview ? "owner" : user?.role ?? "editor",
  }}>{children}</AdminShell>;
}
