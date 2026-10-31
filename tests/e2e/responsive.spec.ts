import { expect, test, type Page } from "@playwright/test";

/**
 * Layout and interaction checks across the three sizes the site is actually
 * read at. These assert the things a screenshot review misses: content wider
 * than the screen, touch targets too small to hit, images that never load,
 * and anything the browser logged as an error.
 */

const PAGES = [
  "/",
  "/about",
  "/knowledge",
  "/knowledge/featured",
  "/knowledge/paper-isnt-the-problem-waste-is",
  "/myths",
  "/glossary",
  "/resources",
  "/journey",
  "/circularity",
  "/everyday-paper",
  "/everyday-paper/notebooks",
  "/india-map",
  "/india-snapshot",
  "/discover",
  "/join",
  "/contact",
  "/report",
  "/privacy",
  "/terms",
  "/no-such-page",
];

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1440, height: 900 },
];

/** Errors a page has no control over, which would make the suite flaky. */
function isIgnorableError(text: string) {
  return /favicon|ERR_INTERNET_DISCONNECTED|net::ERR_ABORTED|Download the React DevTools/i.test(text);
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const offenders: { tag: string; cls: string; right: number }[] = [];
    for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      const style = getComputedStyle(el);
      if (style.position === "fixed" || style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      // Deliberately scrollable strips are allowed to be wider than the screen.
      const scroller = el.closest<HTMLElement>("[data-allow-overflow]");
      if (scroller) continue;
      let parent: HTMLElement | null = el.parentElement;
      let inScroller = false;
      while (parent) {
        const parentStyle = getComputedStyle(parent);
        if (/(auto|scroll)/.test(parentStyle.overflowX)) { inScroller = true; break; }
        parent = parent.parentElement;
      }
      if (inScroller) continue;
      if (rect.right > docWidth + 1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: typeof el.className === "string" ? el.className.slice(0, 60) : "",
          right: Math.round(rect.right),
        });
      }
    }
    return { docWidth, scrollWidth: document.documentElement.scrollWidth, offenders: offenders.slice(0, 6) };
  });
}

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of PAGES) {
      test(`${path} renders without layout or console faults`, async ({ page }) => {
        const errors: string[] = [];
        page.on("console", (message) => {
          if (message.type() === "error" && !isIgnorableError(message.text())) errors.push(message.text());
        });
        page.on("pageerror", (error) => errors.push(String(error)));

        const response = await page.goto(path, { waitUntil: "domcontentloaded" });
        expect(response, `${path} returned no response`).toBeTruthy();
        expect(
          response!.status(),
          `${path} returned ${response!.status()}`
        ).toBe(path === "/no-such-page" ? 404 : 200);

        await page.waitForTimeout(1200);

        // The page must not be a crashed error boundary.
        const body = await page.locator("body").innerText();
        expect(body.length, `${path} rendered almost no text`).toBeGreaterThan(60);
        expect(body, `${path} shows an error boundary`).not.toMatch(/Application error|Try again\s*$/);

        // Nothing should push the page sideways.
        const overflow = await horizontalOverflow(page);
        expect(
          overflow.scrollWidth,
          `${path} scrolls sideways at ${viewport.width}px. Widest: ${JSON.stringify(overflow.offenders)}`
        ).toBeLessThanOrEqual(overflow.docWidth + 1);

        const realErrors = path === "/no-such-page"
          ? errors.filter((e) => !/status of 404/.test(e))
          : errors;
        expect(realErrors, `${path} logged console errors`).toEqual([]);
      });
    }
  });
}

test.describe("touch targets", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const path of ["/", "/discover", "/contact", "/report", "/myths"]) {
    test(`${path} controls are big enough to tap`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      const small = await page.evaluate(() => {
        const MIN = 32; // generous: the WCAG target is 44, many icon buttons sit just under
        const offenders: { label: string; w: number; h: number }[] = [];
        const isInlineInText = (el: HTMLElement) => {
          // Exempt by WCAG 2.5.8: a link inside a run of prose cannot be
          // enlarged without breaking the line it sits in.
          if (getComputedStyle(el).display !== "inline") return false;
          const parent = el.parentElement;
          if (!parent) return false;
          const parentText = (parent.textContent || "").trim().length;
          const ownText = (el.textContent || "").trim().length;
          return parentText > ownText + 12;
        };
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("a, button, [role='button']"))) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (getComputedStyle(el).visibility === "hidden") continue;
          if (isInlineInText(el)) continue;
          if (rect.height < MIN || rect.width < MIN) {
            offenders.push({
              label: (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            });
          }
        }
        return offenders.slice(0, 10);
      });

      expect(small, `${path} has controls under 32px`).toEqual([]);
    });
  }
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("the menu opens, expands a group and navigates", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();

    await menu.getByRole("button", { name: /discover/i }).click();
    const gamesLink = menu.getByRole("link", { name: /Games Lab/i });
    await expect(gamesLink).toBeVisible();
    await gamesLink.click();

    await page.waitForURL(/\/games|\/discover/);
    // Navigating must close the menu, or it covers the page it just opened.
    await expect(page.locator("#mobile-navigation")).toBeHidden();
  });
});

test.describe("images", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const path of ["/", "/everyday-paper", "/knowledge", "/journey"]) {
    test(`${path} images all load and carry alt text`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.currentSrc || img.src)
          .slice(0, 8)
      );
      expect(broken, `${path} has images that failed to load`).toEqual([]);

      const missingAlt = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => !img.hasAttribute("alt"))
          .map((img) => img.currentSrc || img.src)
          .slice(0, 8)
      );
      expect(missingAlt, `${path} has images with no alt attribute`).toEqual([]);
    });
  }
});
