import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export function adminAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.ADMIN_EMAILS && process.env.NEXTAUTH_SECRET);
}

export function adminPreviewEnabled() {
  return process.env.ADMIN_PREVIEW_MODE === "true" ||
    (process.env.NODE_ENV !== "production" && !adminAuthConfigured());
}

function allowedEmails() {
  return new Set((process.env.ADMIN_EMAILS ?? "").split(",").map(email => email.trim().toLowerCase()).filter(Boolean));
}

export const authOptions: NextAuthOptions = {
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "not-configured",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "not-configured",
    authorization: { params: { prompt: "select_account" } },
  })],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    async signIn({ user }) { return adminAuthConfigured() && Boolean(user.email && allowedEmails().has(user.email.toLowerCase())); },
    async session({ session }) { return session; },
  },
};

export async function canManageContent() {
  if (adminPreviewEnabled()) return true;
  if (!adminAuthConfigured()) return false;
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.email && allowedEmails().has(session.user.email.toLowerCase()));
}
