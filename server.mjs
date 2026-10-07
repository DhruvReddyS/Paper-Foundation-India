import { createServer } from "node:http";
import next from "next";

const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

const server = createServer((request, response) => handle(request, response));
server.listen(port, hostname, () => {
  console.log(`Paper Foundation India is listening on ${hostname}:${port}`);
});

let campaignTimer;
if (process.env.CRON_SECRET && process.env.MONGODB_URI) {
  const runCampaignWorker = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/cron/campaigns`, {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
        signal: AbortSignal.timeout(55_000),
      });
      if (!response.ok) console.error(`Campaign worker returned HTTP ${response.status}`);
    } catch (error) {
      console.error("Campaign worker request failed", error);
    }
  };
  campaignTimer = setInterval(runCampaignWorker, 60_000);
  campaignTimer.unref();
  setTimeout(runCampaignWorker, 15_000).unref();
} else {
  console.warn("Campaign worker is disabled until CRON_SECRET and MONGODB_URI are configured.");
}

function shutdown(signal) {
  console.log(`${signal} received; shutting down.`);
  if (campaignTimer) clearInterval(campaignTimer);
  server.close(error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
