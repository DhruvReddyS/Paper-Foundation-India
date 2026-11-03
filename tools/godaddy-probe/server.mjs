/**
 * Outbound connectivity probe for GoDaddy Node.js Hosting.
 *
 * GoDaddy documents outbound traffic as restricted to ports 80 and 443 plus
 * its own managed MySQL. MongoDB Atlas speaks on 27017, so if that
 * restriction applies as written, this site cannot run there at all: the CMS,
 * the admin sign-in and the analytics all read from Atlas.
 *
 * That is an expensive thing to discover after paying for a year of hosting,
 * and GoDaddy offers free private preview apps, so test it there first.
 *
 * Deploy this folder on its own as a preview app, open it, and read the
 * verdict. No dependencies, so nothing has to install.
 *
 * Set MONGODB_HOST in the hosting environment variables to one shard host of
 * your cluster, for example:
 *   ac-xxxxxxx-shard-00-00.yyyyyyy.mongodb.net
 */
import { createServer } from "node:http";
import { connect } from "node:net";
import { request as httpsRequest } from "node:https";

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const MONGO_HOST = process.env.MONGODB_HOST || "";
const TIMEOUT_MS = 8000;

/** Can we open a raw TCP socket to this host and port? */
function probeTcp(host, port) {
  return new Promise(resolve => {
    const started = Date.now();
    const socket = connect({ host, port });
    const finish = (ok, detail) => {
      socket.destroy();
      resolve({ ok, detail, ms: Date.now() - started });
    };
    socket.setTimeout(TIMEOUT_MS);
    socket.once("connect", () => finish(true, "connected"));
    socket.once("timeout", () => finish(false, `no answer within ${TIMEOUT_MS}ms (blocked or filtered)`));
    socket.once("error", error => finish(false, error.message));
  });
}

function probeHttps(host, path = "/") {
  return new Promise(resolve => {
    const started = Date.now();
    const call = httpsRequest({ host, path, method: "HEAD", timeout: TIMEOUT_MS }, response => {
      resolve({ ok: true, detail: `HTTP ${response.statusCode}`, ms: Date.now() - started });
      call.destroy();
    });
    call.once("timeout", () => { call.destroy(); resolve({ ok: false, detail: "timed out", ms: Date.now() - started }); });
    call.once("error", error => resolve({ ok: false, detail: error.message, ms: Date.now() - started }));
    call.end();
  });
}

async function runProbes() {
  const checks = [
    { label: "Cloudinary (media uploads)", need: "HTTPS 443", run: () => probeHttps("api.cloudinary.com") },
    { label: "Gmail API (newsletter)", need: "HTTPS 443", run: () => probeHttps("gmail.googleapis.com") },
    { label: "Google OAuth (token refresh)", need: "HTTPS 443", run: () => probeHttps("oauth2.googleapis.com") },
  ];
  if (MONGO_HOST) {
    checks.unshift({
      label: `MongoDB Atlas (${MONGO_HOST})`,
      need: "TCP 27017",
      decisive: true,
      run: () => probeTcp(MONGO_HOST, 27017),
    });
  }
  const results = [];
  for (const check of checks) results.push({ ...check, result: await check.run() });
  return results;
}

createServer(async (_request, response) => {
  const results = await runProbes();
  const mongo = results.find(item => item.decisive);
  const verdict = !MONGO_HOST
    ? { text: "Set MONGODB_HOST and reload to get a verdict.", tone: "#8a6a33" }
    : mongo.result.ok
      ? { text: "This host CAN reach MongoDB Atlas. Your site can run here.", tone: "#1f6b43" }
      : { text: "This host CANNOT reach MongoDB Atlas on 27017. Your site cannot run here.", tone: "#a13f34" };

  const rows = results.map(item => `
    <tr>
      <td>${item.label}</td>
      <td><code>${item.need}</code></td>
      <td style="color:${item.result.ok ? "#1f6b43" : "#a13f34"}">${item.result.ok ? "reachable" : "BLOCKED"}</td>
      <td>${item.result.detail} (${item.result.ms}ms)</td>
    </tr>`).join("");

  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  response.end(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Outbound probe</title>
<style>
  body{margin:0;padding:2rem 1rem;color:#1a2d21;background:#f3efe6;font:15px/1.6 system-ui,sans-serif}
  main{max-width:720px;margin:0 auto;border:1px solid #ddd8cd;border-radius:10px;padding:1.5rem;background:#fdfbf6}
  h1{margin:0 0 .3rem;font-size:1.3rem}
  p.sub{margin:0 0 1.2rem;color:#6c766e;font-size:.9rem}
  .verdict{margin:0 0 1.4rem;border-left:3px solid ${verdict.tone};padding:.7rem .9rem;background:#f7f4ec;font-weight:600;color:${verdict.tone}}
  table{width:100%;border-collapse:collapse;font-size:.86rem}
  th,td{padding:.5rem .4rem;text-align:left;border-bottom:1px solid #e8e3d8;vertical-align:top}
  th{color:#6c766e;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase}
  code{background:#f1eee5;padding:.1rem .3rem;border-radius:3px;font-size:.82em}
</style></head><body><main>
<h1>Outbound connectivity probe</h1>
<p class="sub">Node ${process.version} &middot; checked ${new Date().toISOString()}</p>
<p class="verdict">${verdict.text}</p>
<table><thead><tr><th>Service</th><th>Needs</th><th>Result</th><th>Detail</th></tr></thead><tbody>${rows}</tbody></table>
<p class="sub" style="margin:1rem 0 0">An HTTP status such as 403 or 404 still counts as reachable: it proves the connection was made and answered. Only &ldquo;BLOCKED&rdquo; means the network refused the connection.</p>
</main></body></html>`);
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Probe listening on ${PORT}`);
});
