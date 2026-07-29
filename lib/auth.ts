import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";

export function adminAuthConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.NEXTAUTH_SECRET);
}

export function adminPreviewEnabled() {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.ADMIN_PREVIEW_MODE === "true" || !adminAuthConfigured();
}

const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(80),
  password: z.string().min(8).max(160),
});

async function bootstrapOwner(username: string, password: string) {
  const bootstrapUsername = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim().toLowerCase();
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!bootstrapUsername || !bootstrapPassword || username !== bootstrapUsername || password !== bootstrapPassword) return null;
  if (await AdminUser.exists({})) return null;
  return AdminUser.create({
    username,
    name: "Foundation Owner",
    passwordHash: await bcrypt.hash(password, 12),
    role: "owner",
    createdBy: "environment bootstrap",
    lastLoginAt: new Date(),
  });
}

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({
    name: "Admin credentials",
    credentials: {
      username: { label: "User ID", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success || !adminAuthConfigured()) return null;
      await connectDB();
      const { username, password } = parsed.data;
      let admin = await AdminUser.findOne({ username }).select("+passwordHash +failedAttempts +lockedUntil");
      if (!admin) admin = await bootstrapOwner(username, password);
      if (!admin || !admin.active) return null;
      if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) throw new Error("ACCOUNT_LOCKED");

      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        const attempts = (admin.failedAttempts ?? 0) + 1;
        admin.failedAttempts = attempts >= 5 ? 0 : attempts;
        admin.lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
        await admin.save();
        return null;
      }

      admin.failedAttempts = 0;
      admin.lockedUntil = null;
      admin.lastLoginAt = new Date();
      await admin.save();
      return { id: String(admin._id), name: admin.name, email: admin.username, role: admin.role };
    },
  })],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
        token.role = (user as { role?: string }).role ?? "editor";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id?: string; role?: string }).id = String(token.adminId ?? token.sub ?? "");
        (session.user as typeof session.user & { id?: string; role?: string }).role = String(token.role ?? "editor");
      }
      return session;
    },
  },
};

export async function canManageContent() {
  if (adminPreviewEnabled()) return true;
  if (!adminAuthConfigured()) return false;
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}
