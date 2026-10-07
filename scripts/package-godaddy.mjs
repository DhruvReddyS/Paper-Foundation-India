import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const releaseRoot = join(root, ".release");
const stageRoot = join(releaseRoot, "paper-foundation-india");
const archivePath = join(releaseRoot, "paper-foundation-india-godaddy.zip");

const rootFiles = new Set([
  ".env.example",
  ".eslintrc.json",
  "DEPLOY_GODADDY.md",
  "middleware.ts",
  "next-env.d.ts",
  "next.config.ts",
  "package-lock.json",
  "package.json",
  "postcss.config.js",
  "server.mjs",
  "tailwind.config.ts",
  "tsconfig.json",
]);
const sourceDirectories = ["app", "components", "content", "lib", "public", "scripts"];

function isDeployFile(file) {
  if (file.includes("..") || file.startsWith(`${sep}`)) return false;
  if (rootFiles.has(file)) return true;
  return sourceDirectories.some(directory => file === directory || file.startsWith(`${directory}/`));
}

const output = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: root });
const files = output.toString("utf8").split("\0").filter(Boolean).filter(isDeployFile);

rmSync(stageRoot, { recursive: true, force: true });
rmSync(archivePath, { force: true });
mkdirSync(stageRoot, { recursive: true });

for (const file of files) {
  const source = join(root, file);
  if (!existsSync(source)) continue;
  const destination = join(stageRoot, file);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination);
}

writeFileSync(join(stageRoot, "DEPLOYMENT_CHECKLIST.txt"), [
  "PAPER FOUNDATION INDIA — GODADDY DEPLOYMENT",
  "",
  "1. Upload the ZIP to GoDaddy Node.js Hosting (or connect the GitHub repository).",
  "2. Add every production variable listed in .env.example in GoDaddy Settings.",
  "3. Set NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL to the final https:// domain.",
  "4. Run the deployment. GoDaddy will run npm install, npm run build, then npm start.",
  "5. Open /api/health and /admin, sign in, enable MFA, and send one test campaign.",
  "6. Never upload a local .env or .env.local file.",
  "",
  "Full instructions: DEPLOY_GODADDY.md",
  "",
].join("\n"));

for (const file of files) {
  if (/^\.env(?:\.|$)/.test(file) && file !== ".env.example") throw new Error(`Secret file cannot be bundled: ${file}`);
}

const zip = spawnSync("zip", ["-q", "-r", archivePath, "."], { cwd: stageRoot, encoding: "utf8" });
if (zip.status !== 0) throw new Error(zip.stderr || "Could not create deployment ZIP. Install the zip command and retry.");

const relativeArchive = relative(root, archivePath);
console.log(`Created ${relativeArchive} with ${files.length + 1} files.`);
console.log("The archive contains source code and .env.example only; local secret files are excluded.");
