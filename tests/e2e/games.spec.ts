import { expect, test, type Page } from "@playwright/test";

/**
 * Plays each game to its result screen.
 *
 * Every control is clicked three times in quick succession on purpose. React
 * batches synchronous clicks, and that is exactly how the original scoring and
 * skipping faults appeared: a double tap advanced twice or scored twice. A
 * single click would pass even with those bugs present.
 */

const GAMES = [
  "/discover/grow-or-shred",
  "/discover/truth-press",
  "/discover/mill-master",
  "/discover/hidden-paper",
  "/discover/paper-word-search",
];

async function start(page: Page, path: string) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/favicon|DevTools/i.test(m.text())) errors.push(m.text());
  });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /start mission/i }).click();
  await page.waitForTimeout(500);
  return errors;
}

/** Reads the result panel once a game finishes. */
async function readResult(page: Page) {
  const panel = page.locator(".game-result-panel");
  await expect(panel, "the game never reached its result screen").toBeVisible({ timeout: 25_000 });
  const heading = (await panel.locator(".game-result-card-preview h1").innerText()).replace(/\s+/g, " ");
  const [, scored, total] = heading.match(/(\d+)\s*\/\s*(\d+)/) ?? [];
  return {
    score: Number(scored),
    outOf: Number(total),
    badge: (await panel.locator(".game-result-stamp").innerText()).trim(),
    shareTargets: await panel.locator(".share-row-platforms a, .share-row-platforms button").count(),
    primaryActions: await panel.locator(".share-row-primary button").count(),
  };
}

function assertSaneResult(result: Awaited<ReturnType<typeof readResult>>, label: string) {
  expect(result.outOf, `${label}: no maximum score`).toBeGreaterThan(0);
  expect(result.score, `${label}: negative score`).toBeGreaterThanOrEqual(0);
  // The guard that catches double counting.
  expect(result.score, `${label}: scored ${result.score} out of a possible ${result.outOf}`).toBeLessThanOrEqual(result.outOf);
  expect(result.badge.length, `${label}: no badge awarded`).toBeGreaterThan(2);
  expect(result.shareTargets, `${label}: missing social share targets`).toBeGreaterThanOrEqual(8);
  expect(result.primaryActions, `${label}: missing share, save and copy actions`).toBeGreaterThanOrEqual(3);
}

test.describe("games play to completion", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Grow or Shred: a round of 8, each question visited once", async ({ page }) => {
    const errors = await start(page, "/discover/grow-or-shred");
    const seen = new Set<string>();
    const resultPanel = page.locator(".game-result-panel");
    const reveal = page.locator(".evidence-reveal");

    // Driven by observed state rather than fixed delays, so the test does not
    // flake when several specs share a machine.
    for (let i = 0; i < 40; i += 1) {
      if (await resultPanel.isVisible()) break;

      const number = page.locator(".question-number");
      const before = (await number.innerText().catch(() => "")).trim();
      if (before) seen.add(before);

      await page.locator(".answer-grid button").first().click({ clickCount: 3, delay: 10 });
      await expect(reveal, "the evidence panel did not open after answering").toBeVisible();

      await page.locator(".evidence-reveal button").first().click({ clickCount: 3, delay: 10 });
      // Either the next question is shown, or the round is over.
      await expect
        .poll(async () => (await resultPanel.isVisible()) || (await number.innerText().catch(() => before)).trim() !== before, {
          message: "the quiz did not advance past " + before,
        })
        .toBe(true);
    }

    const result = await readResult(page);
    assertSaneResult(result, "Grow or Shred");
    expect(seen.size, "a question was skipped or shown twice").toBe(8);
    expect(errors).toEqual([]);
  });

  test("The Truth Press: three verdicts, one ledger row per claim", async ({ page }) => {
    const errors = await start(page, "/discover/truth-press");
    await expect(page.locator(".stamp-options button"), "the press must offer three verdicts").toHaveCount(3);

    const seen = new Set<string>();
    for (let i = 0; i < 60; i += 1) {
      if (await page.locator(".game-result-panel").isVisible()) break;
      const kicker = page.locator(".claim-sheet .game-kicker");
      const before = (await kicker.innerText().catch(() => "")).trim();
      if (before) seen.add(before);

      await page.locator(".stamp-options button:not([disabled])").first().click({ clickCount: 3, delay: 10 });
      await expect(page.locator(".truth-evidence"), "the evidence panel did not open").toBeVisible();

      await page.locator(".truth-evidence button").first().click({ clickCount: 3, delay: 10 });
      await expect
        .poll(
          async () =>
            (await page.locator(".game-result-panel").isVisible()) ||
            (await kicker.innerText().catch(() => before)).trim() !== before,
          { message: "the press did not advance past " + before }
        )
        .toBe(true);
    }

    const result = await readResult(page);
    assertSaneResult(result, "The Truth Press");
    // One row per claim proves no answer was recorded twice.
    expect(await page.locator(".truth-result-ledger li").count()).toBe(seen.size);
    expect(errors).toEqual([]);
  });

  test("Paper Mill Shuffle: the correct order scores full marks", async ({ page }) => {
    const errors = await start(page, "/discover/mill-master");
    const target = ["Sort fibre", "Make pulp", "Clean pulp", "Refine fibres", "Form sheet", "Press water", "Dry sheet", "Finish reel"];
    const read = () => page.locator(".mill-order-card .mill-order-copy strong").allInnerTexts();

    for (let slot = 0; slot < target.length; slot += 1) {
      for (let guard = 0; guard < 20; guard += 1) {
        const order = (await read()).map((s) => s.trim());
        const at = order.indexOf(target[slot]);
        if (at === slot || at === -1) break;
        await page.locator(".mill-order-card").nth(at).locator(".mill-order-move button").first().click();
        await page.waitForTimeout(60);
      }
    }

    expect((await read()).map((s) => s.trim()), "the line was not reassembled").toEqual(target);
    await page.getByRole("button", { name: /check line/i }).click();

    const result = await readResult(page);
    assertSaneResult(result, "Paper Mill Shuffle");

    // Scoring is 800, less 70 for each check after the first, less 10 for
    // every 15 seconds taken, floored at 300. Solving it on the first check
    // means no attempt penalty, so the score must equal the time-adjusted
    // maximum exactly. Asserting the formula catches a regression in either
    // term, which a simple "score is high" check would not.
    const elapsed = await page
      .locator(".game-result-summary span", { hasText: /Time played/i })
      .innerText();
    const [minutes, seconds] = elapsed.match(/(\d+):(\d+)/)!.slice(1).map(Number);
    const expected = Math.max(300, 800 - Math.floor((minutes * 60 + seconds) / 15) * 10);
    expect(result.score, "a first-attempt solve should carry no attempt penalty").toBe(expected);
    expect(errors).toEqual([]);
  });

  test("Hidden Paper: every object is answerable from its own options", async ({ page }) => {
    const errors = await start(page, "/discover/hidden-paper");
    const seen = new Set<string>();
    let reveals = 0;

    for (let i = 0; i < 90; i += 1) {
      if (await page.locator(".game-result-panel").isVisible()) break;

      const next = page.locator(".product-reveal-card .game-primary-button");
      if (await next.isVisible().catch(() => false)) {
        seen.add((await page.locator(".clue-console .game-kicker").innerText()).trim());
        await next.click({ clickCount: 3, delay: 10 });
        await page.waitForTimeout(240);
        continue;
      }

      // Try every option; one of them must be the answer.
      const options = page.locator(".mystery-options button");
      const count = await options.count();
      if (count) {
        await options.nth(i % count).click();
        await page.waitForTimeout(140);
        continue;
      }

      const reveal = page.locator(".reveal-answer-button");
      if (await reveal.isVisible().catch(() => false)) {
        reveals += 1;
        await reveal.click();
        await page.waitForTimeout(200);
      }
    }

    const result = await readResult(page);
    assertSaneResult(result, "Hidden Paper");
    expect(seen.size, "an object was skipped").toBeGreaterThanOrEqual(5);
    // Cycling through every option must solve each object without giving up.
    expect(reveals, "an object could not be solved from its own option list").toBe(0);
    expect(errors).toEqual([]);
  });

  test("Fibre Word Search: a generated grid can be fully solved", async ({ page }) => {
    const errors = await start(page, "/discover/paper-word-search");
    await expect(page.locator(".word-board button")).toHaveCount(144);

    const solved = await page.evaluate(async () => {
      const SIZE = 12;
      const cells = Array.from(document.querySelectorAll<HTMLElement>(".word-board button"));
      const grid = cells.map((c) => (c.textContent || "").trim());
      const words = Array.from(document.querySelectorAll(".word-transcript > div strong")).map((e) => (e.textContent || "").trim());
      const DIRS = [[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      let found = 0;
      for (const word of words) {
        let placed: { r: number; c: number; er: number; ec: number } | null = null;
        for (let r = 0; r < SIZE && !placed; r += 1) {
          for (let c = 0; c < SIZE && !placed; c += 1) {
            for (const [dr, dc] of DIRS) {
              const er = r + dr * (word.length - 1);
              const ec = c + dc * (word.length - 1);
              if (er < 0 || er >= SIZE || ec < 0 || ec >= SIZE) continue;
              let ok = true;
              for (let k = 0; k < word.length; k += 1) {
                if (grid[(r + dr * k) * SIZE + (c + dc * k)] !== word[k]) { ok = false; break; }
              }
              if (ok) { placed = { r, c, er, ec }; break; }
            }
          }
        }
        if (!placed) continue;
        cells[placed.r * SIZE + placed.c].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
        await sleep(30);
        const end = cells[placed.er * SIZE + placed.ec];
        const box = end.getBoundingClientRect();
        end.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: box.x + 4, clientY: box.y + 4 }));
        await sleep(90);
        found += 1;
      }
      return { words: words.length, found };
    });

    expect(solved.found, "a listed word was not present in the generated grid").toBe(solved.words);
    const result = await readResult(page);
    assertSaneResult(result, "Fibre Word Search");
    expect(errors).toEqual([]);
  });
});

test.describe("the result card", () => {
  for (const width of [375, 768, 1440]) {
    test(`reads correctly at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await start(page, "/discover/mill-master");

      const target = ["Sort fibre", "Make pulp", "Clean pulp", "Refine fibres", "Form sheet", "Press water", "Dry sheet", "Finish reel"];
      const read = () => page.locator(".mill-order-card .mill-order-copy strong").allInnerTexts();
      for (let slot = 0; slot < target.length; slot += 1) {
        for (let guard = 0; guard < 20; guard += 1) {
          const order = (await read()).map((s) => s.trim());
          const at = order.indexOf(target[slot]);
          if (at === slot || at === -1) break;
          await page.locator(".mill-order-card").nth(at).locator(".mill-order-move button").first().click();
          await page.waitForTimeout(50);
        }
      }
      await page.getByRole("button", { name: /check line/i }).click();
      await expect(page.locator(".game-result-panel")).toBeVisible({ timeout: 20_000 });

      // The message length changes with the game and the score, so this
      // guards the card against a footer that collides with the text above it.
      const gap = await page.evaluate(() => {
        const card = document.querySelector(".game-result-card-preview")!;
        const message = card.querySelector(".game-result-message")!.getBoundingClientRect();
        const footer = card.querySelector("footer")!.getBoundingClientRect();
        return Math.round(message.bottom - footer.top);
      });
      expect(gap, `the message overlaps the card footer by ${gap}px`).toBeLessThanOrEqual(0);

      // Everything a reader needs in order to share must be present. The
      // score and the badge appear at every width; the longer message is
      // deliberately dropped on a phone because it restates both of them.
      await expect(page.locator(".game-result-card-preview h1")).toBeVisible();
      await expect(page.locator(".game-result-stamp")).toBeVisible();
      if (width >= 1024) await expect(page.locator(".game-result-message")).toBeVisible();
      expect(await page.locator(".share-row-primary button").count()).toBeGreaterThanOrEqual(3);
      expect(await page.locator(".share-row-platforms a, .share-row-platforms button").count()).toBe(8);
    });
  }
});

test.describe("games on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const path of GAMES) {
    test(`${path} opens and starts without layout faults`, async ({ page }) => {
      const errors = await start(page, path);
      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(overflow.scroll, `${path} scrolls sideways on a phone`).toBeLessThanOrEqual(overflow.doc + 1);
      expect(errors).toEqual([]);
    });
  }
});
