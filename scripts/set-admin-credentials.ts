/**
 * Sets the owner account's user ID and password.
 *
 * The environment bootstrap in lib/auth.ts only creates an account when the
 * admin_users collection is completely empty, which is correct — it stops a
 * stale environment variable from silently minting a second owner later. The
 * consequence is that changing ADMIN_BOOTSTRAP_* after the first seed has no
 * effect at all, and there is otherwise no way to recover an account whose
 * password is lost or whose user ID needs to change.
 *
 * This closes that gap. It is idempotent: run it as often as you like.
 *
 * Run with: npm run admin:credentials
 * Reads ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD from .env.
 */
import bcrypt from "bcryptjs";
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

loadEnvConfig(process.cwd());

import { connectDB } from "../lib/db";
import { AdminUser } from "../lib/models/AdminUser";

/** Matches the rule enforced in lib/auth.ts and scripts/seed.ts. */
function passwordComplaint(password: string) {
  if (password.length < 12) return "must be at least 12 characters";
  if (!/[a-z]/.test(password)) return "must include a lowercase letter";
  if (!/[A-Z]/.test(password)) return "must include an uppercase letter";
  if (!/\d/.test(password)) return "must include a number";
  return null;
}

async function main() {
  const username = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!username || !password) {
    throw new Error("Set ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD in .env first.");
  }
  if (username.length < 3 || username.length > 80) {
    throw new Error("ADMIN_BOOTSTRAP_USERNAME must be between 3 and 80 characters.");
  }
  const complaint = passwordComplaint(password);
  if (complaint) throw new Error(`ADMIN_BOOTSTRAP_PASSWORD ${complaint}.`);

  await connectDB();

  const existing = await AdminUser.findOne({ username }).select("+sessionVersion");
  const owners = await AdminUser.countDocuments({ role: "owner", active: true });

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = "owner";
    existing.active = true;
    // A password change must end every session opened with the old one.
    existing.sessionVersion = (existing.sessionVersion ?? 1) + 1;
    existing.failedAttempts = 0;
    existing.lockedUntil = null;
    await existing.save();
    console.log(`Updated the password for "${username}" and signed out its existing sessions.`);
  } else {
    await AdminUser.create({
      username,
      name: "Foundation Owner",
      passwordHash,
      role: "owner",
      active: true,
      createdBy: "set-admin-credentials",
    });
    console.log(`Created owner account "${username}".`);
    if (owners > 0) {
      console.log(`Note: ${owners} other active owner account(s) already existed and were left untouched.`);
      console.log("Review them in the admin Users screen and deactivate any that should not have access.");
    }
  }

  if (existing?.mfaEnabled) {
    console.log("This account has two-factor authentication enabled, so signing in still needs the authenticator code.");
  }

  const total = await AdminUser.countDocuments();
  console.log(`admin_users now holds ${total} account(s).`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
  void mongoose.disconnect();
});
