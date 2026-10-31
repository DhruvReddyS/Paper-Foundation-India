/**
 * Deployment preflight.
 *
 * `cms:check` answers "can this machine reach the services?". This answers the
 * different question "is this configuration safe to point a public domain at?",
 * which is where the localhost defaults that work perfectly in development
 * become silent production faults: canonical tags, Open Graph URLs, sitemap
 * entries and auth callbacks would all advertise http://localhost:3000.
 *
 * Run with: npm run preflight
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { databaseNameFromUri } from "../lib/db";

loadEnvConfig(process.cwd());

type Finding = { level: "blocker" | "warning"; message: string; fix: string };

/**
 * Next loads .env.local last, so it overrides .env. That is correct for
 * development and confusing here: a .env that is already set up for
 * production still reads as localhost on a developer's machine. Reading the
 * files directly lets the report say which one a value came from, so a real
 * misconfiguration is not confused with a local override.
 */
function readEnvFile(name: string): Record<string, string> {
  const file = path.join(process.cwd(), name);
  if (!existsSync(file)) return {};
  const values: Record<string, string> = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match) values[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return values;
}

const deployed = readEnvFile(".env");
const localOverrides = readEnvFile(".env.local");

/** The value that will actually be live, which is the one in .env. */
function deployedValue(key: string) {
  return deployed[key] ?? process.env[key] ?? "";
}

function isLocalOnlyOverride(key: string) {
  return Boolean(localOverrides[key]) && localOverrides[key] !== deployed[key];
}

const findings: Finding[] = [];

function blocker(message: string, fix: string) {
  findings.push({ level: "blocker", message, fix });
}

function warning(message: string, fix: string) {
  findings.push({ level: "warning", message, fix });
}

const siteUrl = deployedValue("NEXT_PUBLIC_SITE_URL");
const authUrl = deployedValue("NEXTAUTH_URL");

for (const [name, value] of Object.entries({ NEXT_PUBLIC_SITE_URL: siteUrl, NEXTAUTH_URL: authUrl })) {
  if (!value) {
    blocker(`${name} is not set.`, `Set ${name} to the live origin, for example https://paperfoundation.in`);
    continue;
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    blocker(`${name} is not a valid URL: ${value}`, `Set ${name} to a full origin including https://`);
    continue;
  }
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(parsed.hostname)) {
    blocker(
      `${name} still points at ${parsed.origin}.`,
      "Canonical links, Open Graph tags, the sitemap and sign-in callbacks all use this value. Set it to the live domain before deploying."
    );
  } else if (parsed.protocol !== "https:") {
    blocker(`${name} does not use HTTPS (${parsed.origin}).`, "Serve the site over HTTPS and update this value.");
  }
  if (value.endsWith("/")) {
    warning(`${name} has a trailing slash.`, "Remove it so generated URLs do not contain a double slash.");
  }
}

if (siteUrl && authUrl) {
  try {
    if (new URL(siteUrl).origin !== new URL(authUrl).origin) {
      warning(
        `NEXT_PUBLIC_SITE_URL (${new URL(siteUrl).origin}) and NEXTAUTH_URL (${new URL(authUrl).origin}) differ.`,
        "Unless the admin is deliberately on another host, make them the same origin or sign-in redirects will fail."
      );
    }
  } catch {
    // Already reported above as an invalid URL.
  }
}

const secrets = { NEXTAUTH_SECRET: 32, CRON_SECRET: 32 };
for (const [name, minimum] of Object.entries(secrets)) {
  const value = process.env[name] ?? "";
  if (!value) blocker(`${name} is not set.`, `Generate one with: openssl rand -base64 48`);
  else if (value.length < minimum) {
    blocker(`${name} is shorter than ${minimum} characters.`, "Generate a longer value with: openssl rand -base64 48");
  }
}

const uri = process.env.MONGODB_URI ?? "";
if (!uri) {
  blocker("MONGODB_URI is not set.", "Add the Atlas connection string for the production cluster.");
} else {
  const named = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(uri);
  if (!named) {
    warning(
      `MONGODB_URI names no database, so the application defaults to "${databaseNameFromUri(uri)}".`,
      'Append the database name to the URI, for example ...mongodb.net/paperfoundation?retryWrites=true'
    );
  }
}

if (process.env.ADMIN_PREVIEW_MODE === "true") {
  blocker(
    "ADMIN_PREVIEW_MODE is true.",
    "This opens the admin area without signing in. It is refused in production builds, but it must be false in the deployed environment file."
  );
}

const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
if (bootstrapPassword && bootstrapPassword.length < 12) {
  blocker("ADMIN_BOOTSTRAP_PASSWORD is shorter than 12 characters.", "Use a longer password, then re-run the seed.");
}

for (const [name, label] of [
  ["CLOUDINARY_CLOUD_NAME", "media uploads"],
  ["CLOUDINARY_API_KEY", "media uploads"],
  ["CLOUDINARY_API_SECRET", "media uploads"],
  ["GMAIL_CLIENT_ID", "newsletter delivery"],
  ["GMAIL_CLIENT_SECRET", "newsletter delivery"],
  ["GMAIL_REFRESH_TOKEN", "newsletter delivery"],
  ["GMAIL_SENDER_EMAIL", "newsletter delivery"],
] as const) {
  if (!process.env[name]) warning(`${name} is not set, so ${label} will be unavailable.`, `Add ${name} or accept that ${label} stays switched off.`);
}

if (!process.env.NEXT_PUBLIC_GA_ID) {
  warning("NEXT_PUBLIC_GA_ID is not set, so no analytics will be collected.", "Add the measurement ID, or leave it unset deliberately.");
}

for (const key of ["NEXT_PUBLIC_SITE_URL", "NEXTAUTH_URL"]) {
  if (isLocalOnlyOverride(key)) {
    findings.push({
      level: "warning",
      message: `.env.local overrides ${key} with ${localOverrides[key]} on this machine.`,
      fix: "That is correct for local development. Just make sure .env.local is not copied to the server, or it will override the live value there too.",
    });
  }
}

/**
 * Credentials can be present and still be dead. A Gmail refresh token expires
 * if the OAuth app is left in testing status, if access is revoked, or after
 * a long period unused, and nothing about the configuration shows that. The
 * only way to know is to ask Google, so the check exchanges the token.
 */
async function checkGmailToken() {
  const id = process.env.GMAIL_CLIENT_ID;
  const secret = process.env.GMAIL_CLIENT_SECRET;
  const refresh = process.env.GMAIL_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return;

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: id, client_secret: secret, refresh_token: refresh, grant_type: "refresh_token" }),
      signal: AbortSignal.timeout(15_000),
    });
    const result = (await response.json()) as { access_token?: string; error?: string; error_description?: string };
    if (response.ok && result.access_token) return;

    blocker(
      `The Gmail refresh token is not accepted by Google (${result.error ?? response.status}).`,
      "Newsletter confirmations and campaigns cannot send. Re-run the OAuth consent flow to issue a new refresh token, and publish the OAuth app rather than leaving it in testing, where tokens expire after seven days."
    );
  } catch (error) {
    warning(
      `The Gmail token could not be checked: ${error instanceof Error ? error.message : String(error)}.`,
      "Run this again with network access before deploying."
    );
  }
}

async function report() {
  await checkGmailToken();

  const blockers = findings.filter((f) => f.level === "blocker");
  const warnings = findings.filter((f) => f.level === "warning");

  console.log("");
  console.log("Deployment preflight");
  console.log("====================");
  console.log("Checking .env, the file that gets deployed.\n");
  if (!findings.length) {
    console.log("No issues found. This configuration is safe to deploy.");
  } else {
    for (const group of [blockers, warnings]) {
      for (const finding of group) {
        console.log(`\n[${finding.level.toUpperCase()}] ${finding.message}`);
        console.log(`           ${finding.fix}`);
      }
    }
    console.log(`\n${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  }
  console.log("");

  process.exitCode = blockers.length ? 1 : 0;
}

void report();
