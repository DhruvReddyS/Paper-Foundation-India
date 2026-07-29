import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const has = (...keys: string[]) => keys.every(key => Boolean(process.env[key]));

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const services = [
    { id: "database", label: "Content database", provider: "MongoDB Atlas", required: true, ready: has("MONGODB_URI"), keys: ["MONGODB_URI"] },
    { id: "media", label: "Media library", provider: "Cloudinary", required: true, ready: has("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"), keys: ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] },
    { id: "admin", label: "Admin authentication", provider: "Google OAuth", required: true, ready: has("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "ADMIN_EMAILS", "NEXTAUTH_SECRET"), keys: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "ADMIN_EMAILS", "NEXTAUTH_SECRET"] },
    { id: "campaigns", label: "Subscriber campaigns", provider: "Gmail API", required: true, ready: has("GMAIL_SENDER_EMAIL", "GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"), keys: ["GMAIL_SENDER_EMAIL", "GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"] },
    { id: "site", label: "Public site address", provider: "Website", required: true, ready: has("NEXT_PUBLIC_SITE_URL", "NEXTAUTH_URL"), keys: ["NEXT_PUBLIC_SITE_URL", "NEXTAUTH_URL"] },
    { id: "analytics", label: "Google Analytics", provider: "GA4", required: false, ready: has("NEXT_PUBLIC_GA_ID"), keys: ["NEXT_PUBLIC_GA_ID"] },
  ];
  const required = services.filter(service => service.required);

  return NextResponse.json({
    services,
    ready: required.filter(service => service.ready).length,
    total: required.length,
    preview: process.env.ADMIN_PREVIEW_MODE === "true" || !has("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "ADMIN_EMAILS", "NEXTAUTH_SECRET"),
  });
}
