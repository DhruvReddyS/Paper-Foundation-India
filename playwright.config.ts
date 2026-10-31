import { defineConfig, devices } from "@playwright/test";

/**
 * The suite runs against a production build, because that is what ships.
 * A dev build hides hydration and bundling faults behind the overlay.
 *
 * Start the server with `npm run e2e:serve`, which builds and serves with
 * ALLOW_INSECURE_LOCAL=1. Without that flag the production CSP emits
 * upgrade-insecure-requests, and Safari then upgrades every subresource on
 * http://localhost to HTTPS, fails to load them, and renders the site with no
 * CSS at all. That produces convincing but entirely false failures.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [["list", { printSteps: false }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  // Chromium carries the full suite. Firefox and WebKit run a smaller
  // cross-browser set, because the value there is catching engine differences
  // rather than repeating every assertion three times. WebKit is the stand-in
  // for Safari, which is a large share of Indian mobile traffic.
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /cross-browser\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: /cross-browser\.spec\.ts/,
    },
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3100",
    trace: "off",
    screenshot: "off",
  },
});
