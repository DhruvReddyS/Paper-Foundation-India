import { defineConfig } from "@playwright/test";

/**
 * The suite runs against a production build, because that is what ships.
 * A dev build hides hydration and bundling faults behind the overlay.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [["list", { printSteps: false }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3100",
    trace: "off",
    screenshot: "off",
  },
});
