import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";

loadEnvConfig(process.cwd());

const required = ["MONGODB_URI", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "NEXT_PUBLIC_SITE_URL", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN", "GMAIL_SENDER_EMAIL"];

async function check() {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) throw new Error(`Missing production variables: ${missing.join(", ")}`);
  if (process.env.NEXTAUTH_SECRET!.length < 32) throw new Error("NEXTAUTH_SECRET must be at least 32 characters");
  const publicUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL!);
  const authUrl = new URL(process.env.NEXTAUTH_URL!);
  if (process.env.NODE_ENV === "production" && (publicUrl.protocol !== "https:" || authUrl.protocol !== "https:")) throw new Error("Production site URLs must use HTTPS");
  const connection = await connectDB();
  await connection.connection.db?.admin().ping();
  const collections = await connection.connection.db?.listCollections().toArray() ?? [];
  console.log(JSON.stringify({ ready: true, database: "connected", collections: collections.length, publicUrl: publicUrl.origin, integrations: { cloudinary: "configured", gmail: "configured" } }, null, 2));
}

check().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
