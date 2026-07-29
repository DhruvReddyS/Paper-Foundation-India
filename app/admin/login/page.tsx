import { ArrowLeft, BarChart3, FileCheck2, LayoutDashboard, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminLoginAction } from "@/components/admin/AdminLoginAction";
import { adminPreviewEnabled } from "@/lib/auth";

const workspaceAreas = [
  { icon: FileCheck2, title: "Publish content", copy: "Articles, myths, resources and research notes." },
  { icon: LayoutDashboard, title: "Shape the website", copy: "Homepage order, games, navigation and public pages." },
  { icon: BarChart3, title: "Read the insights", copy: "Article readership, interactions and game performance." },
];

export default function AdminLogin() {
  const preview = adminPreviewEnabled();
  return (
    <main className="admin-login admin-login-modern">
      <section className="admin-login-modern-copy">
        <header>
          <Link href="/"><ArrowLeft /><span>Back to website</span></Link>
          <div className="admin-login-modern-brand">
            <Image src="/images/brand/paper-foundation-nav-logo.png" alt="" width={42} height={50} priority />
            <span><strong>Paper Foundation India</strong><small>Administration</small></span>
          </div>
        </header>

        <div className="admin-login-modern-intro">
          <p>SECURE ADMIN PORTAL</p>
          <h1>Manage the website with clarity.</h1>
          <span>{preview ? "Preview mode is ready. Enter the complete workspace without authentication." : "Use your Paper Foundation India administrator ID and password."}</span>
          <AdminLoginAction preview={preview} />
          <div className="admin-login-modern-access">
            <ShieldCheck />
            <span><strong>{preview ? "Local preview access" : "Restricted access"}</strong><small>{preview ? "Credential authentication activates when MongoDB and the admin secret are configured." : "Passwords are encrypted and repeated failed attempts are temporarily locked."}</small></span>
          </div>
        </div>

        <footer>Paper Foundation India · Internal workspace</footer>
      </section>

      <aside className="admin-login-modern-aside">
        <div>
          <p>ADMIN WORKSPACE</p>
          <h2>One calm place to run every public touchpoint.</h2>
          <ul>
            {workspaceAreas.map(({ icon: Icon, title, copy }) => (
              <li key={title}>
                <Icon />
                <span><strong>{title}</strong><small>{copy}</small></span>
              </li>
            ))}
          </ul>
          <footer><i /> {preview ? "Complete admin preview is active" : "Protected by encrypted credentials and secure sessions"}</footer>
        </div>
      </aside>
    </main>
  );
}
