import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { adminPreviewEnabled } from "@/lib/auth";
import "./admin.css";

export const metadata: Metadata = { title: "PFI Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell preview={adminPreviewEnabled()}>{children}</AdminShell>;
}
