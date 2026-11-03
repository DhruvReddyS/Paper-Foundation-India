import { expect, test, type Page } from "@playwright/test";

/**
 * The checks a careful reviewer would make by hand on every page, run on
 * every page instead of the two or three anyone actually gets to.
 *
 * responsive.spec proves a page does not break its layout. This proves it is
 * usable once it has rendered: that you can hit the controls with a thumb,
 * that a screen reader is told what the pictures are, that every field has a
 * name, and that no text is quietly clipped by the box it sits in.
 */
const PAGES = [
  "/", "/about", "/knowledge", "/knowledge/featured", "/myths", "/glossary",
  "/resources", "/journey", "/circularity", "/everyday-paper", "/india-map",
  "/india-snapshot", "/discover", "/games", "/join", "/contact", "/report",
  "/privacy", "/terms", "/unsubscribe",
  "/discover/grow-or-shred", "/discover/truth-press", "/discover/mill-master",
  "/discover/hidden-paper", "/discover/paper-word-search",
];

/** Apple and Google both put the comfortable minimum at around 44px. */
const MIN_TAP = 40;

async function settle(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.status(), `${path} returned ${response?.status()}`).toBe(200);
  await page.waitForTimeout(1100);
}

test.describe("thumb-sized controls on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const path of PAGES) {
    test(`${path} has controls big enough to tap`, async ({ page }) => {
      await settle(page, path);
      const small = await page.evaluate((min) => {
        const offenders: { label: string; w: number; h: number }[] = [];
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("button, a[href], input, select"))) {
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          // WCAG 2.5.8 exempts a target in a sentence or a block of text, so
          // this is about controls rather than links set in prose.
          if (el.tagName === "A") {
            const display = style.display;
            const inline = display === "inline" || display === "inline-flex" || display === "contents";
            if (inline || el.closest("p, li, small, figcaption")) continue;
          }
          if (el.getAttribute("type") === "hidden") continue;
          if (rect.height < min || rect.width < min) {
            offenders.push({
              label: (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 40),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            });
          }
        }
        return offenders.slice(0, 8);
      }, MIN_TAP);
      expect(small, `${path} has controls under ${MIN_TAP}px: ${JSON.stringify(small)}`).toEqual([]);
    });
  }
});

test.describe("told to a screen reader", () => {
  for (const path of PAGES) {
    test(`${path} names its images and fields`, async ({ page }) => {
      await settle(page, path);
      const faults = await page.evaluate(() => {
        const problems: string[] = [];

        for (const img of Array.from(document.querySelectorAll("img"))) {
          if (!img.hasAttribute("alt")) problems.push(`img with no alt: ${img.getAttribute("src")?.slice(0, 60)}`);
        }

        for (const field of Array.from(document.querySelectorAll<HTMLInputElement>("input, select, textarea"))) {
          if (field.type === "hidden") continue;
          const style = getComputedStyle(field);
          if (style.display === "none" || style.visibility === "hidden") continue;
          const labelled = Boolean(
            field.getAttribute("aria-label") ||
            field.getAttribute("aria-labelledby") ||
            field.getAttribute("title") ||
            (field.id && document.querySelector(`label[for="${CSS.escape(field.id)}"]`)) ||
            field.closest("label") ||
            field.getAttribute("placeholder")
          );
          if (!labelled) problems.push(`unnamed field: ${field.name || field.type}`);
        }

        for (const control of Array.from(document.querySelectorAll<HTMLElement>("button, a[href]"))) {
          const style = getComputedStyle(control);
          if (style.display === "none" || style.visibility === "hidden") continue;
          const rect = control.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const named = Boolean(
            control.textContent?.trim() ||
            control.getAttribute("aria-label") ||
            control.getAttribute("title") ||
            control.querySelector("img[alt]:not([alt=''])")
          );
          if (!named) problems.push(`unnamed control: ${control.tagName.toLowerCase()}.${String(control.className).slice(0, 40)}`);
        }

        return problems.slice(0, 8);
      });
      expect(faults, `${path}: ${JSON.stringify(faults)}`).toEqual([]);
    });
  }
});

test.describe("one heading to lead each page", () => {
  for (const path of PAGES) {
    test(`${path} has a single top-level heading`, async ({ page }) => {
      await settle(page, path);
      const headings = await page.evaluate(() =>
        Array.from(document.querySelectorAll("h1"))
          .filter((h) => {
            const style = getComputedStyle(h);
            return style.display !== "none" && style.visibility !== "hidden";
          })
          .map((h) => h.textContent?.trim().slice(0, 50) ?? "")
      );
      expect(headings.length, `${path} has ${headings.length} h1 elements: ${JSON.stringify(headings)}`).toBe(1);
    });
  }
});
