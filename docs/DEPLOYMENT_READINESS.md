# Deployment readiness

Last full pass: 31 October 2026.

This is the honest state of the project: what was found, what was fixed, what
was proven by running it, and what is still open. Anything not verified by a
command or a browser session is marked as unverified rather than assumed.

---

## 1. Verification results

Run everything with `npm run verify:deploy`.

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | pass, 0 errors, 0 warnings |
| Types | `npm run typecheck` | pass |
| Unit tests | `npm test` | 27 pass, 0 fail |
| Production build | `npm run build` | pass, 80 pages generated |
| Dependency audit | `npm audit --omit=dev` | 0 vulnerabilities |
| CMS services | `npm run cms:check` | ready, database connected, 18 collections |
| Deployment config | `npm run preflight` | **2 blockers** (see section 5) |
| Route sweep | 35 public routes + 404 | all correct |

The test suite grew from 10 to 27 tests. The new ones cover share captions per
platform, game data integrity, SEO metadata and structured data, and database
name resolution.

---

## 2. The database was never the problem

The previous audit reported the Atlas cluster as unreachable
(`ENOTFOUND _mongodb._tcp...`). That was a transient local DNS failure. The
cluster resolves and accepts connections.

The real problem was different and larger: **the CMS had never been seeded.**
Every content collection was empty, there was no administrator account, and
every public page was silently serving the hard-coded editorial fallback
instead of the CMS.

This has been fixed. After seeding:

| Collection | Records |
| --- | --- |
| Articles | 35 |
| Myths | 60 |
| Glossary | 79 |
| Resources | 28 |
| Game configurations | 5 |
| Site settings | 10 |
| Administrators | 1 (bootstrap owner) |

All five public APIs now report `source: "cms"` rather than a fallback.

A second, quieter fault was found alongside it: the connection string names no
database, so the driver was connecting to Atlas's default `test` database. The
cluster had collections in **both** `paperfoundation` and `test`. The
application now resolves the database name explicitly and defaults to
`paperfoundation`, and `preflight` warns whenever the URI omits it.

---

## 3. What was verified by actually using it

Not inspected, used.

**Games.** All five played start to finish in a browser against the production
build:

- Grow or Shred: 12 questions, in order, scorecard produced.
- The Truth Press: 10 claims, three-way verdict, per-claim result ledger.
- Paper Mill Shuffle: eight stages reordered via the arrow controls, 800/800.
- Hidden Paper: all 7 objects, including the new reveal route.
- Fibre Word Search: 12x12 grid, all 10 words found by selection, result shown.

**Claim report desk.** Submitted empty (four inline field errors), with a bad
email and bad URL (two precise errors), then valid. The valid submission
reached MongoDB, returned reference `1C915CB9`, and showed the next-steps
panel. The test record was deleted afterwards.

**Admin.** Signed in through the app's dev preview, edited a site setting,
published it, confirmed the new value through the public settings API, then
restored the original. Admin routes correctly redirect to login when signed
out.

**Scorecards.** Generated the real PNG from the share button and inspected it.

---

## 4. Bugs found and fixed

The significant ones, in order of how much they mattered.

1. **Grow or Shred was frozen on question one.** Nesting an `AnimatePresence`
   inside a `mode="wait"` parent left the exiting question mounted forever, so
   the flagship game could never be completed. The question panel now remounts
   on its key with no exit to await. The same hazard was removed from The Truth
   Press and Paper Mill Shuffle.

2. **Double-clicking skipped questions and double-counted scores.** React
   batches synchronous clicks, so handlers that read state and then incremented
   it ran twice: a triple tap produced 2400 out of a possible 2000. Grow or
   Shred was rebuilt around a single answers record where replaying an update is
   a no-op; the other games use an index latch. Verified by hammering every
   control three times per step.

3. **One Hidden Paper object could not be solved.** "Moulded-fibre egg carton"
   was not among its own options. It only worked because the old matcher
   accepted any substring, which also meant "Tea" solved "Tea bag". Matching is
   now exact and a test asserts every object is answerable from its own list.

4. **The myths page claimed sources that did not exist.** When a myth had no
   citations the card printed "Source record available". It now says
   "Source citation pending editorial review".

5. **A word-search grid could crash the page.** `generatePuzzle` threw after 30
   failed attempts. It now returns the densest grid it managed.

6. **Three cited sources were dead links** on live pages (UDISE+, the press
   registrar, FAO forestry statistics). All 101 external links were checked;
   these are now corrected to live official pages. 78 return 200 and the rest
   are bot-blocked 403s that work in a browser.

7. **The article share button did nothing.** It now opens a real share row.

8. **A dead database made every page slow.** A failed connection is now
   remembered for 15 seconds instead of re-waiting the full selection timeout
   on every request.

---

## 5. Blockers before the domain goes live

`npm run preflight` reports these and exits non-zero.

1. **`NEXT_PUBLIC_SITE_URL` is `http://localhost:3000`.** This value is written
   into canonical tags, Open Graph URLs, the sitemap and every share link. Ship
   as-is and the site tells Google and every social network that it lives on
   localhost. Set it to `https://paperfoundation.in`.

2. **`NEXTAUTH_URL` is `http://localhost:3000`.** Admin sign-in redirects will
   fail on the live domain. Set it to the same origin.

Warnings worth clearing at the same time: add the database name to
`MONGODB_URI`, and set `NEXT_PUBLIC_GA_ID` if analytics are wanted.

---

## 6. Still open, and who has to do it

**The articles are not real articles.** This is the most serious remaining
issue and it is editorial, not technical.

All 35 article pages render the same three paragraphs of generated text under
article-specific headings. The 20 markdown files in `content/articles/` are no
better: they are drawn from a small shared pool and are mostly off-topic for
the titles above them (the file for "Why Using Both Sides of Paper Matters"
discusses landfill methane, FSC certification and fibre shortening). They are
deliberately not wired in, because publishing them would be worse than the
current state.

Until a real body is published through the CMS, each article page:

- is served `noindex, follow`, so Google cannot index 35 near-duplicate pages,
- is left out of the sitemap,
- carries a visible notice saying the text is an editorial draft.

Publishing a real body through the admin flips all three automatically. Nothing
further is needed in code.

**The 60 myths have no citations.** The claims and corrections are good and
well balanced, correcting over-claims in paper's favour as readily as attacks
on it. But every `sources` array is empty, so the page now admits the gap. For
an organisation whose case rests on evidence, this is the highest-value
editorial task after the articles.

**One figure needs re-checking.** "149,809 registered publications" was cited
to a retired URL. The link now points at the Press Registrar General of India,
but the number itself should be confirmed against the current register.

**Test telemetry.** Game playthroughs and page views from this verification are
still in the `gameresults` and `analytics` collections. Clearing them needed a
bulk delete, which was blocked; clear them from the admin Analytics page.

**Not verified by me:** real email delivery through Gmail, Cloudinary uploads
against the live account, the scheduled campaign worker, GoDaddy DNS and HTTPS,
and cross-browser or real-device behaviour. Frame-rate profiling could not be
measured reliably in the automation browser and should be checked on a real
phone.

---

## 7. Design and front-end work

Audited against 30 common "AI-generated" design tropes. The site was already
strongly specific: cream and forest palette, Fraunces with DM Sans and DM Mono,
letterpress offset shadows, real photography, hand-drawn canvas illustrations,
and both legal pages present.

Changed:

- **The icon library is gone.** All 122 Lucide icons were replaced with a
  bespoke set drawn for this project (`components/paper-ui/icons.tsx`), with a
  compatible API so the swap touched 121 files without changing a call site.
  `lucide-react` has been removed from the dependencies. The sparkle is now a
  printer's registration mark.
- Checkmark bullets replaced with numbered steps; the remaining tick glyph and
  em dash removed.
- Pure white panel fills warmed to paper white across 48 declarations.
- A custom 404 page, and a flat letterpress Open Graph card generated as a real
  asset rather than rendered per request.
- The custom cursor now respects `prefers-reduced-motion`.

---

## 8. Housekeeping

- **98 orphaned files deleted** after an import-graph analysis, including the
  superseded India map, the duplicate contact forms and the unused UI kit.
- **`public/` went from 82 MB to 19 MB.** 44 MB of unreferenced draft artwork
  moved to `assets/` (preserved, not served) and 78 images recompressed for a
  further 19 MB, with no visible quality change.
- Next.js patched to 15.5.28, closing a critical advisory. **Next 16 was
  deliberately not taken**: it is a major version and the risk is not worth
  carrying into a launch. Zod moved to 4.6.7, closing a high advisory.

---

## 9. Commands

```bash
npm run verify          # lint, types, tests, build
npm run preflight       # deployment configuration safety
npm run cms:check       # database and integrations
npm run verify:deploy   # all of the above, in order
npm run seed            # idempotent content seed
node scripts/optimise-images.mjs --dry   # image budget report
```

## 10. Order of work before launch

1. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to the live HTTPS origin.
2. Add the database name to `MONGODB_URI`.
3. Run `npm run verify:deploy` and get a clean preflight.
4. Publish real bodies for the articles you want indexed.
5. Attach sources to the myths.
6. Deploy to a protected staging host and test Gmail, Cloudinary and the
   campaign worker against the live accounts.
7. Check on a real phone, and with a keyboard only.
8. Point the domain.
