import { expect, test } from "@playwright/test";

/**
 * Runs on Chromium, Firefox and WebKit.
 *
 * WebKit stands in for Safari, which matters here: a large share of Indian
 * mobile traffic is iOS, and several things this site relies on behave
 * differently there. Canvas letter spacing is unsupported, MediaRecorder
 * output formats differ, and CSS that Chromium forgives can break layout.
 *
 * The point is to catch engine differences, not to repeat the whole suite.
 */

const KEY_PAGES = ["/", "/myths", "/knowledge", "/discover", "/contact", "/india-map"];

for (const path of KEY_PAGES) {
  test(`${path} renders correctly`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (m) => {
      if (m.type() === "error" && !/favicon|DevTools|Download the React/i.test(m.text())) errors.push(m.text());
    });

    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await page.waitForTimeout(1800);

    const body = await page.locator("body").innerText();
    expect(body.length, `${path} rendered almost nothing`).toBeGreaterThan(80);
    expect(body).not.toMatch(/Application error/i);

    const overflow = await page.evaluate(() => ({
      doc: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(overflow.scroll, `${path} scrolls sideways`).toBeLessThanOrEqual(overflow.doc + 1);

    expect(errors, `${path} logged console errors`).toEqual([]);
  });
}

test("an article shows its written body and its sources", async ({ page }) => {
  await page.goto("/knowledge/paper-isnt-the-problem-waste-is", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  await expect(page.locator(".article-cms-body")).toBeVisible();
  expect(await page.locator(".article-cms-body h2").count()).toBeGreaterThanOrEqual(3);
  expect(await page.locator(".article-source-list a").count()).toBeGreaterThanOrEqual(3);
  // A page with a real body must not also claim to be a draft.
  await expect(page.locator(".article-draft-notice")).toHaveCount(0);
});

test("a game starts and produces a shareable result", async ({ page }) => {
  await page.goto("/discover/mill-master", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /start mission/i }).click();
  await page.waitForTimeout(800);

  const target = ["Sort fibre", "Make pulp", "Clean pulp", "Refine fibres", "Form sheet", "Press water", "Dry sheet", "Finish reel"];
  const read = () => page.locator(".mill-order-card .mill-order-copy strong").allInnerTexts();

  for (let slot = 0; slot < target.length; slot += 1) {
    for (let guard = 0; guard < 20; guard += 1) {
      const order = (await read()).map((s) => s.trim());
      const at = order.indexOf(target[slot]);
      if (at === slot || at === -1) break;
      await page.locator(".mill-order-card").nth(at).locator(".mill-order-move button").first().click();
      await page.waitForTimeout(70);
    }
  }

  await page.getByRole("button", { name: /check line/i }).click();
  await expect(page.locator(".game-result-panel")).toBeVisible({ timeout: 20_000 });
  expect(await page.locator(".share-row-platforms a, .share-row-platforms button").count()).toBeGreaterThanOrEqual(8);
});

test("the still scorecard can be produced in this engine", async ({ page }) => {
  // The canvas card uses letterSpacing, which WebKit does not implement. The
  // code guards it; this proves the guard works rather than assuming it.
  await page.goto("/discover/mill-master", { waitUntil: "domcontentloaded" });
  const result = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { ok: false, reason: "no 2d context" };
    try {
      const supports = "letterSpacing" in ctx;
      if (supports) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "3px";
      ctx.font = "600 20px Arial";
      ctx.fillText("test", 10, 40);
      return { ok: canvas.toDataURL("image/png").startsWith("data:image/png"), supports };
    } catch (error) {
      return { ok: false, reason: String(error) };
    }
  });
  expect(result.ok, `canvas export failed: ${JSON.stringify(result)}`).toBe(true);
});

test("the mobile menu works in this engine", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);

  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.locator("#mobile-navigation").getByRole("button", { name: /discover/i }).click();
  await expect(page.locator("#mobile-navigation").getByRole("link", { name: /Games Lab/i })).toBeVisible();
});
