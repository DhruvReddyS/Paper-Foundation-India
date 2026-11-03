import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "@/components/paper-ui/icons";
import { AdminLoginAction } from "@/components/admin/AdminLoginAction";
import { currentAdmin } from "@/lib/api-auth";
import { adminPreviewEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/**
 * A sheet of mill letterhead on a desk, rather than a card in the middle of a
 * page. The form stays the only thing you can act on: the paper character is
 * carried by the sheet itself (laid and chain lines, a watermark, a deckle
 * edge) so nothing competes with the two fields.
 *
 * A watermark is also the honest metaphor for this screen, being the mark a
 * mill presses into a sheet to prove it is genuine.
 */
function SheetWatermark() {
  return (
    <svg className="admin-signin-watermark" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Chain lines, as they fall across a sheet held to the light. */}
      {[30, 45, 60, 75, 90].map(x => (
        <line key={x} x1={x} y1="16" x2={x} y2="104" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      ))}
      {/* A single leaf, echoing the Foundation's mark. */}
      <path
        d="M60 30c14 9 21 20 21 32 0 13-9 22-21 26-12-4-21-13-21-26 0-12 7-23 21-32Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M60 36v48" stroke="currentColor" strokeWidth="1" />
      <path d="M60 52l11-8M60 52L49 44M60 66l13-9M60 66l-13-9M60 78l11-8M60 78L49 70" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

/**
 * The middleware puts the page you were trying to reach in callbackUrl. It is
 * attacker-controllable, so only an in-admin path is honoured: a value like
 * "//example.com" or "/\example.com" is a URL the browser will happily treat
 * as another origin.
 */
function safeCallback(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || raw.includes("\\") || raw.startsWith("//")) return null;
  return raw === "/admin" || raw.startsWith("/admin/") ? raw : null;
}

function noticeFor(params: Record<string, string | string[] | undefined>, callback: string | null) {
  if (params.setup === "required") return "Finish configuring the database and admin secret before signing in.";
  if (params.error === "SessionRequired") return "That session has ended. Sign in again to continue.";
  if (callback && callback !== "/admin") return `Sign in to continue to ${callback}.`;
  return null;
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const callback = safeCallback(params.callbackUrl);
  const preview = adminPreviewEnabled();

  // Someone already signed in has no business being shown the form again.
  if (!preview && await currentAdmin()) redirect(callback ?? "/admin");

  const notice = noticeFor(params, callback);

  return (
    <main className="admin-signin">
      <div className="admin-signin-sheet">
        <SheetWatermark />

        <header className="admin-signin-head">
          <div className="admin-signin-brand">
            <Image src="/images/brand/paper-foundation-nav-logo.png" alt="" width={42} height={50} priority />
            <span>
              <strong>Paper Foundation India</strong>
              <small>Administration</small>
            </span>
          </div>
          <p className="admin-signin-ref">FORM 01<br />ACCESS</p>
        </header>

        <div className="admin-signin-rule" />

        <h1>Sign in</h1>
        <p className="admin-signin-lede">
          {preview
            ? "Preview mode is active on this machine, so no credentials are needed."
            : "Enter your administrator ID and password."}
        </p>

        {notice && <p className="admin-signin-notice">{notice}</p>}

        <AdminLoginAction preview={preview} callbackUrl={callback ?? "/admin"} />

        <div className="admin-signin-foot">
          <Link href="/"><ArrowLeft /><span>Back to website</span></Link>
          <small>INTERNAL</small>
        </div>
      </div>
    </main>
  );
}
