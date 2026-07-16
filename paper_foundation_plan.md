# Paper Foundation India — Complete Website Plan

> Historical research document. For the current scope, routes, and team ownership, use `PLAN/PLAN.md`, `PLAN/TEAM_OWNERSHIP.md`, and the briefs in `PLAN/PAGES/`. Newsroom and Corrections have been removed from the current product scope.
## "Use Paper Without Hesitation"

> **Version:** 1.0 — Full Site Plan  
> **Status:** Pre-build, frontend first  
> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · MongoDB (Mongoose) · NextAuth · Cloudinary

---

## TABLE OF CONTENTS

1. [Brand & Design System](#1-brand--design-system)
2. [Paper-World Concept](#2-paper-world-concept)
3. [Tech Stack & Project Structure](#3-tech-stack--project-structure)
4. [Public Pages — Detailed](#4-public-pages--detailed)
   - 4.1 Home / Landing Page
   - 4.2 Myths vs Facts
   - 4.3 Knowledge Hub (Blog Index)
   - 4.4 Article Reader
   - 4.5 Paper Journey (Scroll Experience)
   - 4.6 India Paper Map
   - 4.7 India Snapshot
   - 4.8 Circularity Explainer
   - 4.9 Everyday Paper
   - 4.10 Discover Hub (Games)
   - 4.11 Game 1 — Test Your Assumptions
   - 4.12 Game 2 — Sort It Out
   - 4.13 Game 3 — Guess the Paper Product
   - 4.14 Game 4 — Paper Trail
   - 4.15 Resources Library
   - 4.16 Glossary
   - 4.17 Search
   - 4.18 About
   - 4.19 Newsroom
   - 4.20 Get Involved
   - 4.21 Contact
   - 4.22 Corrections
5. [Shared Components](#5-shared-components)
6. [Admin Panel — Detailed](#6-admin-panel--detailed)
7. [Content & Seed Data](#7-content--seed-data)
8. [Animations & Interactions](#8-animations--interactions)
9. [SEO & Performance](#9-seo--performance)
10. [Build Order — Step by Step](#10-build-order--step-by-step)

---

## 1. BRAND & DESIGN SYSTEM

### Identity
- **Name:** Paper Foundation India
- **Tagline:** Use Paper Without Hesitation
- **Mission:** Evidence-based, fair, and responsible public understanding of paper, recycling, and circularity in India
- **Tone:** Premium institutional meets editorial publication. Calm, trustworthy, serious but fresh. Pro-paper — never anti-digital or anti-anything else.
- **Voice:** Evidence-first. "Research shows…" not "We believe…" Invitational not preachy. Never sensational.

### Colour Palette
| Token | Hex | Use |
|---|---|---|
| `--paper-white` | `#FAF8F5` | Primary background |
| `--paper-warm` | `#F2EDE7` | Section alternates, recycled feel |
| `--kraft` | `#E8DDD0` | Card backgrounds, paper texture feel |
| `--forest` | `#2D5F3E` | Primary brand colour, CTAs |
| `--forest-light` | `#3A7A50` | Hover states |
| `--sage` | `#8B9D77` | Accent, badges |
| `--copper` | `#C4956A` | Sparingly — highlights, special badges |
| `--charcoal` | `#2C2C2C` | Primary text |
| `--mid-grey` | `#6B6B6B` | Secondary text |
| `--border` | `#E0DAD2` | Borders, dividers |
| `--dark-green` | `#244D32` | Dark sections (impact counters, footer) |

### Typography
| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Display | Libre Baskerville | 56px | 700 | Letter-spacing: -0.02em |
| H1 | Libre Baskerville | 40px | 700 | Letter-spacing: -0.01em |
| H2 | Libre Baskerville | 32px | 600 | |
| H3 | DM Sans | 24px | 600 | |
| Body large | DM Sans | 18px | 400 | Line-height: 1.7 |
| Body | DM Sans | 16px | 400 | Line-height: 1.7 |
| Caption | DM Sans | 12px | 400 | |
| Mono / URLs | DM Mono | 13px | 400 | Citations, slugs |

**Never use:** Inter, Roboto, Arial, or any generic system font for display/headings.

### Layout
- Max container: `1200px` centred
- Horizontal padding: `24px` mobile / `48px` tablet / `64px` desktop
- Article content max-width: `680px`
- Section vertical spacing: `96px` desktop / `64px` tablet / `48px` mobile
- Grid: 12-column
- Card border-radius: `12px`
- Button border-radius: `8px`
- Badge/pill border-radius: `999px`

### Card Styles
- Background: white on `--paper-warm` sections, `--paper-white` on white sections
- Shadow: `0 4px 12px rgba(0,0,0,0.06)`
- Hover: `translateY(-2px)` + `0 8px 24px rgba(0,0,0,0.10)`
- Paper stack hover: second sheet offset visible underneath (+2px offset, lighter shadow)

### Button Styles
- **Primary:** `--forest` background, white text, `8px` radius, `12px 24px` padding
- **Secondary:** Outlined, `--forest` border + text, transparent background
- **Ghost:** No border, `--forest` text, hover shows background tint
- Hover: primary darkens to `--dark-green`, 150ms transition

---

## 2. PAPER-WORLD CONCEPT

The entire site is designed to feel like it **lives inside a physical paper world**. Every surface, texture, interaction, and transition references paper in some way. This is not decoration — it is the identity.

### Core Visual Elements

#### Paper Texture Overlay
- Subtle grain texture (`noise: 0.15, opacity: 0.04`) applied via CSS `::before` pseudo-element on all section backgrounds
- Different stocks for different sections:
  - Hero / editorial: smooth pressed paper
  - Games / discover: rougher kraft texture
  - Admin: clean neutral (no texture)

#### Torn Paper Edge Dividers
- Every section transition uses a torn paper SVG edge instead of a straight line
- SVG path is hand-drawn style, slightly irregular
- The tear appears to lift slightly on scroll (subtle `translateY` parallax)
- Component: `<TornEdge direction="down" | "up" colour="--paper-warm" />`

#### Fibre Particle System
- Used on: Hero background, Paper Journey intro
- Canvas-based: 80–120 micro fibres, 1–3px wide, 8–20px long
- Behaviour: slow random drift, slight rotation, very low opacity (0.06–0.12)
- Performance: `requestAnimationFrame`, paused when off-screen, respects `prefers-reduced-motion`
- Component: `<FibreParticles density="low"|"medium" colour="--sage" />`

#### Fold & Unfold Interactions
- Myth cards: fold open like origami (Y-axis rotation from 90° to 0°, with paper crease shadow)
- Get Involved form: each step unfolds from the bottom (scaleY 0→1, origin bottom)
- Mobile nav: slides down like a paper flap being lifted
- All fold animations: `300–400ms`, `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot = paper spring)

#### Ink Bleed Typography
- Applied to: hero headline, page display headings (first render only)
- Effect: letters appear to bleed outward 1–2px, then sharpen to crisp
- Implementation: CSS `filter: blur(2px)` → `blur(0)` over 600ms on mount
- Only runs once per page load, never on scroll-triggered text

#### Paper Stack Cards
- All content cards show a stacked paper effect on hover
- Implementation: `::after` pseudo-element positioned `+3px right, +3px down`, slightly lighter background, same border-radius
- Gives depth through paper layering, not heavy drop shadows

#### Custom Cursor (Desktop Only)
- A tiny paper crane SVG that rotates 15° in the direction of movement
- Size: 24×24px, forest green
- Fallback: standard cursor on touch devices and if user prefers reduced motion
- Can be disabled in site settings

---

## 3. TECH STACK & PROJECT STRUCTURE

### Stack
| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | SSR, ISR, file-based routing |
| Language | TypeScript | Type safety across full stack |
| Styling | Tailwind CSS | Utility-first, consistent with design tokens |
| Animation | Framer Motion | Scroll triggers, layout animations, gestures |
| Database | MongoDB + Mongoose | Flexible schema for content types |
| Auth | NextAuth.js | Admin auth, session management |
| Images | Cloudinary | Upload, transform, optimise |
| Rich Text | Tiptap | Article editor with extensions |
| Validation | Zod | Schema validation on API routes |
| Email | Resend | Subscriber confirmation, contact form |
| Analytics | Custom (MongoDB) | Page views, game plays, myth reveals |

### Folder Structure
```
app/
  (site)/                   ← Public site (shared Nav, Footer, CampaignBanner)
    page.tsx                ← Home / landing
    myths/page.tsx
    knowledge/
      page.tsx              ← Blog index
      [slug]/page.tsx       ← Article reader
    journey/page.tsx
    india-map/page.tsx
    india-snapshot/page.tsx
    circularity/page.tsx
    everyday-paper/page.tsx
    discover/
      page.tsx              ← Games hub
      quiz/page.tsx
      sort-it-out/page.tsx
      guess-it/page.tsx
      paper-trail/page.tsx
    resources/page.tsx
    glossary/page.tsx
    search/page.tsx
    about/page.tsx
    newsroom/page.tsx
    get-involved/page.tsx
    contact/page.tsx
    corrections/page.tsx

  admin/                    ← Admin panel (auth-gated, separate layout)
    login/page.tsx
    page.tsx                ← Dashboard
    articles/
      page.tsx
      [id]/page.tsx
    myths/page.tsx
    games/page.tsx
    resources/page.tsx
    glossary/page.tsx
    newsroom/page.tsx
    inquiries/page.tsx
    subscribers/page.tsx
    media/page.tsx
    analytics/page.tsx
    settings/page.tsx

  api/
    articles/route.ts
    myths/route.ts
    resources/route.ts
    glossary/route.ts
    games/route.ts
    inquiries/route.ts
    subscribers/route.ts
    newsroom/route.ts
    analytics/route.ts
    corrections/route.ts
    upload/route.ts
    auth/[...nextauth]/route.ts

components/
  paper-ui/                 ← Shared paper-world components
    TornEdge.tsx
    PaperCard.tsx
    PaperTexture.tsx
    FibreParticles.tsx
    InkBleedText.tsx
    PaperBadge.tsx
    PaperStack.tsx
  site/                     ← Public site components
    Nav.tsx
    Footer.tsx
    CampaignBanner.tsx
    Hero.tsx
    MythCard.tsx
    ArticleCard.tsx
    CircularityDiagram.tsx
    IndiaMap.tsx
    ContactForm.tsx
    NewsletterSignup.tsx
    QuizWidget.tsx
    CountUp.tsx
    ReadingProgress.tsx
    TableOfContents.tsx
    ShareBar.tsx
    CorrectionLog.tsx
  admin/
    Sidebar.tsx
    DataTable.tsx
    ArticleEditor.tsx
    MythEditor.tsx
    Toaster.tsx
    BulkActionBar.tsx
    StatCard.tsx
  ui/
    Button.tsx
    Badge.tsx
    Modal.tsx
    Accordion.tsx
    Tabs.tsx
    Input.tsx
    Tooltip.tsx

lib/
  db.ts                     ← MongoDB connection
  models/                   ← Mongoose models
    Article.ts
    Myth.ts
    Resource.ts
    Glossary.ts
    Game.ts
    Inquiry.ts
    Subscriber.ts
    NewsItem.ts
    Correction.ts
    Analytics.ts
  validators/               ← Zod schemas
  auth.ts
  cloudinary.ts
  utils.ts
  analytics.ts

content/
  seed/
    articles.json
    myths.json
    resources.json
    quiz.json
    glossary.json
    timeline.json
    sort-items.json
    guess-products.json

scripts/
  seed.ts
  hash-password.ts
```

### Environment Variables
```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

---

## 4. PUBLIC PAGES — DETAILED

---

### 4.1 HOME / LANDING PAGE
**Route:** `/`  
**Purpose:** First impression, engagement hook, routes visitors to all major sections  
**Concept:** Cinematic, scroll-driven, paper-world immersive

#### Section 1 — Campaign Banner
- Thin 36px bar pinned at very top of viewport
- Paper texture subtle background (`--kraft`)
- Admin-controlled: message text + optional CTA link
- Dismissible: X button, dismissed state stored in `localStorage`
- Toggle on/off from admin settings panel

#### Section 2 — Navbar
- Transparent on page load, transitions to solid `--paper-white` + backdrop blur on scroll (threshold: 60px)
- Left: Logo (wordmark, SVG) + paper crane icon
- Centre: Nav links — Knowledge Hub / Myths & Facts / Discover / India Map / About
- Right: Search icon (opens fullscreen overlay) + "Get Involved" CTA button
- Active link: forest green underline, 2px, animated slide-in
- Mobile (< 768px): hamburger icon → paper flap fold-down drawer with full nav links
- Scroll behaviour: hides on scroll down, reappears on scroll up (60px threshold)

#### Section 3 — Hero (Full Viewport)
- **Left column (60%):**
  - Eyebrow text: "Paper Foundation India" in small caps, sage colour, fade in
  - Display headline (56px Libre Baskerville): ink-bleed load animation
  - Suggested copy: *"India's paper story is remarkable. Most people just haven't heard it yet."*
  - Subtext (18px DM Sans): *"Evidence-based awareness about paper, recycling, and circularity in India. Use paper without hesitation."*
  - CTA row: Primary button "Explore the Evidence" → `/knowledge` | Secondary outlined "Test Your Assumptions" → `/discover/quiz`
  - Tagline badge below CTAs: pill badge — "Use Paper Without Hesitation"
- **Right column (40%):**
  - Animated paper fibre particle field (canvas)
  - Fibres slowly drift and subtly align into the outline of a paper sheet
  - Behind fibres: very light abstract SVG — overlapping translucent circles, paper-toned
- Scroll-down indicator: animated chevron pulses at bottom centre
- Full viewport height, `min-height: 100svh`

#### Section 4 — Torn Paper Transition
- First `<TornEdge>` divider
- Appears to peel upward 4px on scroll entry
- Colour transitions from `--paper-white` to `--paper-warm`

#### Section 5 — The Number That Shocks
- Single dark forest green (`--dark-green`) section, full width
- One giant number: **"75%"** — count-up animation triggers on scroll entry
- Resolves beneath: *"of India's paper is made from recycled fibre — one of the highest rates in the world."*
- Source note below in small text with superscript citation
- Sub-stat row: three smaller numbers fade in with stagger — "26M tonnes/year" · "4th largest producer" · "700+ mills"
- Maximum impact, zero clutter. White text on dark green.

#### Section 6 — Trust Strip
- 5 proof badges on `--paper-warm` background, inline scrolling strip
- Badges (pill style, forest border): "Evidence-Based Content" · "Primary Sources Always Cited" · "Corrections Published Openly" · "Industry Independent" · "Peer-Referenced"
- Subtle horizontal scroll animation (continuous loop, paused on hover)

#### Section 7 — Myth Teaser ("Think You Know Paper?")
- Heading: *"Think you know paper? Most people don't."*
- Three myth cards displayed face-down on a kraft paper textured surface
- Cards tremble with a subtle CSS wiggle animation — like they're eager to be flipped
- On hover: card lifts and shows "Click to reveal"
- On click: flip animation (Y-axis rotate 180°) reveals the myth/fact
- Below cards: CTA → "See all myths & facts" → `/myths`
- Section background: `--kraft` with paper grain overlay

#### Section 8 — Paper Journey Teaser
- Heading: *"Paper's journey is more remarkable than you think"*
- 3-stage horizontal animated preview of the full Paper Journey:
  - Stage: Collection → Recycled Pulp → New Sheet
- Scroll-triggered horizontal slide (each stage slides in from right)
- Each stage: icon + bold stat + one-line description
- CTA button at end: "See the full journey" → `/journey`
- Torn paper edge below

#### Section 9 — Featured Articles (3 cards)
- Heading: *"From our Knowledge Hub"*
- 3 editorial blog cards in a row (2+1 on tablet, stacked on mobile)
- Each card: cover image area (paper texture if no image), category badge, reading time, serif title, 2-line excerpt, "Read more" link
- Paper stack hover effect
- Admin marks which articles are "featured" — these three are pulled dynamically
- Link: "Browse all articles" → `/knowledge`

#### Section 10 — India in Numbers (Impact Counter)
- Dark forest green section (`--dark-green`), white text
- 4 animated count-up numbers in a row:
  - 26M+ — Tonnes of paper produced annually
  - 75% — Raw material from recycled fibre
  - 4th — Largest paper producer globally
  - 700+ — Paper mills across India
- Each counter: large bold number, unit, label, tiny source footnote
- Count-up animation triggers once on first scroll into view
- Torn paper edge top and bottom

#### Section 11 — Discover / Game Teaser
- Heading: *"How much do you actually know about paper?"*
- One live quiz question displayed — pulled from seed/admin
- User can click an answer right there on the homepage
- On answer: shows "X% of people got this wrong" + correct answer reveal
- CTA: "Play all games" → `/discover`
- Background: `--paper-warm` with very subtle fibre texture

#### Section 12 — Circularity Loop
- Heading: *"Paper is circular by nature"*
- Animated SVG loop: the paper lifecycle as a flowing ring
- 6 nodes around the ring, each pulsing in sequence (2s loop)
- Auto-playing, not interactive here (save full interactivity for `/circularity`)
- Clean, elegant, forest green
- CTA: "Explore the full cycle" → `/circularity`

#### Section 13 — Newsletter Signup
- Heading: *"Get the Fact of the Week"*
- Subtext: *"One surprising paper fact, every week. Evidence-backed, source-cited."*
- Shows last week's fact as a preview card (social proof)
- Single email input + "Subscribe" button
- Success state: paper crane animation flies across the input
- Error handling: inline, friendly

#### Section 14 — Footer
- Top: `<TornEdge>` torn paper in reverse (tears down into the footer)
- Background: `--dark-green` / dark charcoal
- 4-column layout:
  - Col 1: Logo + tagline + short mission sentence
  - Col 2: Explore — Knowledge Hub, Myths vs Facts, Paper Journey, India Map, Discover
  - Col 3: Organisation — About, Newsroom, Get Involved, Contact, Corrections
  - Col 4: Newsletter signup (compact) + Social icons (LinkedIn, Twitter/X, Instagram)
- Bottom bar: © Paper Foundation India · Built on evidence · Privacy Policy · Terms
- Mobile: stacked, accordion for link columns

---

### 4.2 MYTHS VS FACTS
**Route:** `/myths`  
**Purpose:** The hero engagement feature. Revealing surprising truths about paper.  
**Content principle:** Pro-paper. Never anti-digital, anti-plastic, anti-anything.

#### Page Header
- Large serif heading: *"Myths vs Facts"*
- Subtext: *"Paper is surrounded by assumptions. We go back to the evidence."*
- Myth count badge: "47 myths debunked" (dynamic from DB)

#### Myth of the Day Widget
- Pinned card at top, visually distinct (copper accent border)
- Shows today's featured myth — admin picks which myth is "myth of the day"
- Not yet revealed — has the tremble animation
- Label: "Myth of the Day"

#### Category Filter Tabs
- All · Forests & Sourcing · Recycling · Circularity · Industry · Environment · History
- Active tab: forest green underline + background tint
- Smooth content transition on filter change
- URL updates: `/myths?category=recycling` (shareable filtered views)

#### Search Bar
- Full-width search within myths
- Instant filter as user types (client-side, no API call for first 20 loaded)
- Searches myth text + fact text + tags

#### Myth Card Grid
- 2-column desktop / 1-column mobile
- **Unrevealed state:**
  - Kraft paper texture background
  - "MYTH" label in red pill badge
  - Bold myth statement (the false claim, stated plainly)
  - Tags (category pills)
  - Tremble/wiggle CSS animation
  - "Tap to reveal the fact" label at bottom
- **Revealed state (on click):**
  - Card flips (Y-axis 180°, 400ms, paper-spring easing)
  - Back face: clean white background
  - "FACT" label in forest green pill badge
  - Bold fact statement
  - 2–3 sentence explanation
  - Source badges (up to 3 — org name, linked)
  - "I believed this myth too" button (increments vote count, stored in DB)
  - Vote count: "847 people believed this"
  - Share button: copies shareable link + opens share sheet
- **Confetti:** small paper-shred confetti burst on reveal (canvas, 600ms, forest green + copper + sage colours)

#### FAQ Accordions
- Below the grid: 5–7 contextual FAQs about paper and recycling
- Accordion open/close: smooth `height` transition, arrow rotates
- Admin-editable from settings

#### "Submit a Myth" CTA
- Small CTA at bottom: "Heard a myth about paper we haven't covered? Tell us."
- Links to contact form with pre-filled inquiry type: "Myth Submission"

---

### 4.3 KNOWLEDGE HUB (BLOG INDEX)
**Route:** `/knowledge`  
**Purpose:** Editorial blog — long-form evidence-based articles, shareable to social media

#### Hero/Featured Article
- Full-width feature card at top
- Large cover image (or paper texture placeholder)
- Category badge · Reading time · Date
- Large serif title (H1 size)
- 3-line excerpt
- "Read article" CTA
- Admin marks one article as "featured" for this slot

#### Filter Bar
- Category tabs: All · Recycling · Sourcing · Circularity · History · Industry · Policy
- Tag pills (secondary filter): multi-select, shows active count
- Sort: Latest / Most Read / Oldest
- Search input (filters displayed articles)

#### Article Card Grid
- 3-column desktop / 2-column tablet / 1-column mobile
- Each card:
  - Cover image or paper-texture placeholder (forest green gradient)
  - Category badge (pill, top-left over image)
  - Reading time (clock icon + "X min read")
  - Title (serif, 2 lines max, ellipsis)
  - Excerpt (2 lines, sans-serif)
  - Author name + date
  - Paper stack hover effect
- "Quick Read" badge variant: copper border, lightning icon — for articles under 3 min

#### Pagination
- Load more button (not infinite scroll — intentional)
- Shows: "Showing 12 of 47 articles"
- Load more fetches next 12

#### Social Share Prompt
- Small bar above footer: "Found this useful? Share the Knowledge Hub" + share icons
- OG image auto-generated per article for rich social previews

---

### 4.4 ARTICLE READER
**Route:** `/knowledge/[slug]`  
**Purpose:** Deep reading experience. The gold standard for editorial credibility.

#### Reading Progress Bar
- 3px line at very top of viewport (above navbar)
- Forest green, grows left to right as user scrolls
- Smooth, no jank (driven by `scroll` event with `requestAnimationFrame`)

#### Article Header
- Category badge + "X min read" + date + "Sources Cited: X" badge
- Large serif title (H1, 40–48px)
- Author name + avatar (if available)
- Cover image (full content width, max 720px, constrained height 400px, `object-fit: cover`)

#### Two-Column Layout (Desktop)
- Left (main): article body, max 680px
- Right (sticky sidebar): Table of Contents

#### Table of Contents (Sticky Sidebar)
- Auto-generated from H2/H3 in article body
- Highlights current section on scroll (IntersectionObserver)
- Smooth scroll to section on click
- Collapses to a "Contents" button on mobile (expands as overlay)

#### Article Body
- Font: DM Sans 18px, line-height 1.8, charcoal
- H2: Libre Baskerville 28px
- H3: DM Sans 22px semi-bold
- Blockquotes: left border (3px forest green), slightly indented, sage text
- Inline images: full content width with caption below
- Code/data blocks: monospace, light grey background

#### Inline Source Citations
- Superscript numbers `[1]` `[2]` in forest green after cited sentences
- On click/hover: tooltip popover shows source title, organisation, year, link
- Implementation: Tiptap custom extension for citation marks

#### Shareable Pullquote Block
- Admin can mark any paragraph as a "shareable quote" in the editor
- Renders as a styled pullquote with vertical forest green rule
- Share icon on hover → opens share options (Twitter/X, LinkedIn, WhatsApp, copy link)
- Pre-formats the tweet/post with the quote + article link

#### Correction Log
- If article has corrections: collapsible section at end of article body
- Shows: date of correction, what changed, why
- Label: "Correction — [Date]"
- Auto-populated when admin adds a correction entry in the editor

#### References Section
- Numbered list at bottom of article
- Format: `[1] Title of Source — Organisation Name (Year) — Link`
- Collapsed to first 3 with "Show all X references" toggle

#### Related Articles (3 cards)
- Algorithmically matched by category and tags
- Same card design as Knowledge Hub grid
- Heading: "More from the Knowledge Hub"

#### Share Bar (Sticky Mobile / Bottom Desktop)
- Icons: Twitter/X · LinkedIn · WhatsApp · Copy link
- Mobile: sticky bar at bottom of screen while reading
- Desktop: fixed left-side vertical bar (appears after scrolling past header)

---

### 4.5 PAPER JOURNEY (SCROLL EXPERIENCE)
**Route:** `/journey`  
**Purpose:** Cinematic, scroll-driven storytelling of how paper is made in India

#### Page Concept
Full-screen scroll-jacking experience. Each stage occupies 100vh. Smooth snap scrolling between stages. Each stage is a visual scene, not a static card.

#### Progress Indicator
- Left-side vertical timeline: 8 dots, current stage highlighted
- Stage name appears next to active dot
- Mobile: top horizontal progress bar with stage number

#### Stage 1 — Collection
- Scene: animated city/town with paper collection points lighting up
- Text: *"It starts on your street. Used paper — newspapers, boxes, notebooks — is collected daily across India's cities and towns."*
- Stat callout: *"India has one of the world's largest informal paper collection networks"*
- Animation: small truck SVG drives across scene, bins fill up

#### Stage 2 — Sorting & Grading
- Scene: conveyor belt animation with different paper types being sorted
- Text: *"Not all paper is the same. Collected paper is sorted into grades — OCC (cardboard), newspapers, white office paper, mixed paper."*
- Callout card: Paper Grade glossary — OCC / ONP / WL / MP
- Animation: items slide along belt, branch into different streams

#### Stage 3 — Recycled Pulp (THE MYTH-BUSTER — 75%)
- **This is the centrepiece of the entire journey**
- Scene goes dark. Single spotlight. Giant "75%" appears with count-up.
- Text: *"75% of India's paper starts here — as recycled fibre. Water and agitation break used paper back into its original fibres."*
- Animated pulp vat: paper sheets dissolving, fibres separating in water
- Callout: *"Most people assume paper comes from freshly cut trees. For India's paper industry, that's the exception — not the rule."*
- Confetti of paper fibre particles swirl around the stat

#### Stage 4 — Fresh Pulp (25%)
- Text: *"The remaining 25% comes from sustainably sourced fresh fibre — not old-growth forests."*
- Shows the actual sources: sugarcane bagasse · wheat straw · bamboo · eucalyptus (fast-growing, plantation)
- Myth address: *"Indian paper mills use agro-residues and fast-rotation plantations — not ancient forests."*
- Animated icons for each fibre source appear with short labels

#### Stage 5 — Blending & Refining
- The two streams (recycled + fresh) visually flow together and merge
- Text: *"Both pulp streams are refined — fibres are cut to consistent length, cleaned, and prepared for the paper machine."*
- Animation: two streams converging into one flowing river

#### Stage 6 — The Paper Machine
- Most dramatic visual — a cross-section animation of a Fourdrinier paper machine
- Pulp flows onto the wire, water drains, sheet forms, pressed, dried
- Labels appear on each section: Wire section · Press section · Dryer drums · Calendar
- Text: *"The paper machine is one of the largest machines in industrial manufacturing — some run at 100km/h."*
- Stat: *"A modern paper machine can produce enough paper to wrap the Earth's equator — every day."*

#### Stage 7 — Finishing & Dispatch
- Sheet wound into giant reels, cut, coated, stacked
- Text: *"The finished paper is reeled, cut to specification, and dispatched — to printers, publishers, packaging companies, and more."*

#### Stage 8 — Use & Return (The Loop Closes)
- Camera pulls back to show the full cycle
- The paper is used, then collected again
- Arrow returns to Stage 1 — the loop is complete
- Text: *"Paper is not a linear product. It is a circular material — designed, by nature, to return."*
- Final CTA: "Explore the circularity in detail" → `/circularity`
- Share button: "Share the Paper Journey"

#### Mobile Version
- Swipe-through carousel instead of scroll-jacking
- Each stage is a card — swipe left to progress
- Stage number indicator at top
- Same content, adapted layout

---

### 4.6 INDIA PAPER MAP
**Route:** `/india-map`  
**Purpose:** Interactive data visualisation — paper's story across India's states

#### Map Component
- Full SVG map of India, state boundaries
- Choropleth colouring based on selected data layer
- Colour scale: light sage → deep forest green (low → high)
- Hover/tap on any state: popover card appears with state-specific data
- Smooth colour transitions when switching data layers (300ms)

#### Data Layer Toggle
Three toggle buttons above the map:
1. **Paper Consumption** — tonnes per capita or total
2. **Recycling Rate** — % of paper recycled by state
3. **Mill Locations** — dots for each paper mill

#### State Popover (on hover/tap)
- State name + flag/icon
- Selected metric value (large, bold)
- 2–3 additional stats for that state
- "Learn more" link (future: state-specific article)

#### National Stats Panel (alongside map)
- Animated count-up stats:
  - 26M+ tonnes produced/year
  - 75% recycled fibre input
  - ~27% overall paper recycling rate (rising)
  - 700+ active paper mills
  - 4th largest global producer
  - 5M+ people employed in paper industry
- Source citations under each stat
- Updated: "Data as of [year] — Sources: IPMA, Ministry of Environment"

#### Mobile
- Map fills screen, pinch-to-zoom enabled
- State popover slides up from bottom as a drawer
- Toggle buttons become a dropdown

---

### 4.7 INDIA SNAPSHOT
**Route:** `/india-snapshot`  
**Purpose:** Annual data report page — what gets Paper Foundation India cited in media, academia, and government

#### Page Header
- Title: "India Paper Industry — Annual Snapshot [Year]"
- Published date, next update date
- "Cite this page" button → formatted citation in APA/MLA/Chicago (copy to clipboard)
- "Download PDF" button → generates a PDF of the page

#### Data Sections (each with chart + prose)
1. **Production** — tonnes by year (2015–present), line chart, year-on-year delta
2. **Consumption per capita** — bar chart, India vs global average
3. **Recycled Fibre Input** — % over time (line chart showing upward trend)
4. **Recycling Rate** — collection rate vs processing rate
5. **Mill Count & Distribution** — map + number
6. **Employment** — total workers in paper sector
7. **Exports & Imports** — net trade position

#### Chart Library
- Recharts (React) for all charts
- Forest green primary colour, sage secondary
- Hover tooltips with exact values + source
- Accessible: colour-blind safe, ARIA labels

#### Sources Section
- Full bibliography of all data sources
- Each with: organisation, publication, year, URL
- Update log: "Last updated [date] — What changed"

#### Admin Controls
- Admin updates data annually via `/admin/settings` — JSON input for each dataset
- No hardcoding of data values — all from DB

---

### 4.8 CIRCULARITY EXPLAINER
**Route:** `/circularity`  
**Purpose:** Beautiful animated explainer of paper's circular lifecycle

#### Main Diagram
- SVG ring with 6 nodes:
  1. Forest / Farm (fibre source)
  2. Paper Mill (production)
  3. Product (paper in use)
  4. Consumer (use phase)
  5. Collection (post-use)
  6. Recycling Mill (back to fibre)
- Animated connecting arrows flow clockwise continuously
- Each node pulses softly when active
- Clicking a node expands a detail panel (slides in from right)

#### Node Detail Panel (on click)
- Node name + icon
- 2–3 key facts about that stage
- Stat callout
- Link to relevant article if available
- Close button / click elsewhere to close

#### Companion Text
- Left column: flowing prose explaining the circular economy concept
- Principles: reduce fibre loss, increase collection, close the loop
- India-specific context throughout

---

### 4.9 EVERYDAY PAPER
**Route:** `/everyday-paper`  
**Purpose:** Visual series — surprising places paper appears in daily Indian life

#### Page Header
- Title: *"Paper is Everywhere You Don't Expect"*
- Subtext: *"Paper fibres appear in places most people never notice."*

#### Card Grid
- Masonry-style grid (3 col desktop, 2 col tablet, 1 col mobile)
- Each card:
  - Image or illustrated icon
  - Item name (bold, serif)
  - 2-sentence surprise fact
  - "Made from paper because..." note
  - Share this card button
- Admin adds new cards via `/admin/settings` (title + fact + image)
- Examples: Railway tickets · Currency notes · Car air filters · Surgical gowns · Speaker cones · Egg cartons · Food-grade packaging · Teabags · Coffee filters · Medical bandages

#### "Did you know?" Hover State
- On hover: card flips to show extended fact + source citation

---

### 4.10 DISCOVER HUB (GAMES)
**Route:** `/discover`  
**Purpose:** Single destination for all interactive experiences

#### Page Header
- Bold heading: *"How well do you really know paper?"*
- Subtext: *"Games, quizzes, and interactives that reveal paper's real story."*

#### 4 Game Cards
- 2×2 grid desktop / stacked mobile
- Each card:
  - Game name + icon
  - One-line description
  - "X people have played" count (live from DB)
  - Difficulty indicator (Easy / Medium / Expert)
  - "Play now" CTA button (forest green)
  - Paper stack hover effect

#### Daily Fact Widget
- Today's paper fact (admin-set or auto-rotating from seed)
- "I knew this" / "New to me" buttons (tracked, shown as percentages)
- Streak counter if user has email subscription

#### Leaderboard Preview
- Top 5 quiz scorers this week
- Name/alias + score + badge tier
- "Join the leaderboard" CTA → take the quiz

#### Links to Other Interactives
- Paper Journey · India Map · Circularity Explainer
- Displayed as horizontal feature strip below games

---

### 4.11 GAME 1 — TEST YOUR ASSUMPTIONS
**Route:** `/discover/quiz`

#### Game Flow
1. Welcome screen: game name, description, "Start quiz" button, difficulty toggle (Normal / Expert)
2. Question screen (8 questions):
   - Progress bar at top (Q1 of 8)
   - Question text (large, serif)
   - Answer options (2–4 buttons, animated hover)
   - Timer optional (30s per question, toggle in settings)
3. Answer reveal:
   - Correct: green flash, checkmark animation, +10 points
   - Wrong: red flash, correct answer highlighted
   - Fact panel slides up: "Here's why…" + source citation
   - "X% of people got this wrong" shown
4. Final score screen:
   - Paper IQ score (0–100)
   - Badge tier: Curious (0–40) / Informed (41–70) / Paper Expert (71–100)
   - Shareable badge card auto-generated (OG-style image with score + foundation branding)
   - Share buttons: LinkedIn · Twitter/X · WhatsApp · Copy link
   - "Try again" + "See more facts" CTAs

#### Sample Questions (Seed Data)
1. What % of India's paper is made from recycled fibre? → 75% (most guess 20–30%)
2. How many times can a paper fibre be recycled? → 5–7 times
3. India is the ___ largest paper producer globally → 4th
4. Which crop residue is used to make paper in India? → Sugarcane bagasse / wheat straw / bamboo
5. Which was invented first — paper or the printing press? → Paper, by ~1400 years
6. True/False: Indian paper industry uses more water today than 1990 → FALSE (down 70%+)
7. Global recycling rate: paper vs plastic vs glass → Paper ~58%, Plastic ~9%, Glass ~33%
8. What is Indian currency made from? → Cotton — not wood pulp

#### Admin Controls
- Add / edit / delete questions in `/admin/games`
- Set difficulty tier per question
- Toggle questions active/inactive
- View: which question trips people most (aggregate wrong % per question)
- Schedule weekly question rotation (which 8 questions appear this week)

---

### 4.12 GAME 2 — SORT IT OUT
**Route:** `/discover/sort-it-out`

#### Game Flow
1. Intro screen: *"Sort these 10 items into Recyclable or Not Recyclable"*
2. 10 item cards displayed in a shuffled stack
3. Each card shows item name + small illustration
4. Drag to left bucket (Recyclable ♻) or right bucket (Not Recyclable ✗)
5. Touch-friendly: tap to select, tap bucket to place
6. Each drop: immediate animated feedback (green check or red X)
7. Fact card pops up: 1-sentence explanation of why
8. Score at end: X/10 + explanation of all wrong ones
9. Retry with new shuffled set

#### Item Examples (Seed Data — 20 items, 10 shown per round)
| Item | Recyclable? | Why (shown on reveal) |
|---|---|---|
| Newspaper | ✅ | Standard paper recycling |
| Thermal receipt | ❌ | BPA/BPS coating contaminates pulp |
| Clean cardboard | ✅ | OCC — most recycled material |
| Greasy pizza box | ❌ | Grease contaminates the pulp batch |
| Clean pizza box top | ✅ | Only the ungreased section |
| Shredded paper | ⚠️ | Recyclable but short fibres — best composted |
| Wax-coated cup | ❌ | Wax layer prevents fibre separation |
| Plain paper bag | ✅ | Standard recycling |
| Tissue/napkin | ❌ | Fibres too short, often contaminated |
| Glossy magazine | ✅ | Yes — coating is mineral, not plastic |
| Sticky note | ⚠️ | Remove adhesive strip first, then yes |
| Paper straw | ✅ | Food-grade paper, recyclable |
| Carbon copy paper | ❌ | Chemical coating, not recyclable |
| Egg carton | ✅ | Moulded pulp, highly recyclable |
| Laminated paper | ❌ | Plastic laminate cannot be separated |

---

### 4.13 GAME 3 — GUESS THE PAPER PRODUCT
**Route:** `/discover/guess-it`

#### Game Flow
1. Intro: *"Paper is in more places than you think. Can you guess what this is?"*
2. Blurred image of a paper-based product
3. Image progressively un-blurs over 8 seconds if no answer
4. 4 answer options below
5. First correct guess = full points, later guess = partial points
6. Reveal: full image + fact card *"This is [product]. It's made from paper because…"*
7. 8 rounds per session
8. End screen: streak + share

#### Products Seed Data (15 items, 8 per round)
- Car air filter (cellulose paper fibre)
- Surgical disposable gown (paper-based material)
- Speaker cone (moulded pulp)
- Tea bag (wet-strength tissue paper)
- Egg carton (moulded pulp)
- Coffee filter (filter paper)
- Medical bandage backing (crepe paper)
- Currency note (cotton-rag paper — trick answer)
- Building insulation (cellulose fibre)
- Sandpaper (paper substrate)
- Milk carton (paperboard)
- Match box (recycled board)

---

### 4.14 GAME 4 — PAPER TRAIL
**Route:** `/discover/paper-trail`

#### Game Flow
1. Intro: *"These 8 milestones shaped the story of paper. Can you put them in order?"*
2. 8 milestone cards displayed shuffled
3. Drag to reorder into correct chronological sequence
4. Submit: animated reveal of correct order
5. Score: points based on correct positions (partial credit for close guesses)
6. Beautiful animated timeline unrolls at the end showing all milestones
7. Each milestone expandable on the final timeline with detail

#### Milestone Seed Data
1. **105 AD** — Cai Lun refines papermaking in China (first recorded)
2. **7th Century** — Paper reaches the Arab world via Silk Road
3. **13th Century** — Paper mills appear in Europe (Spain, Italy)
4. **~1450** — Gutenberg printing press — paper demand explodes
5. **1798** — Fourdrinier paper machine invented (industrial production)
6. **1850s** — Wood pulp replaces rags as primary fibre source
7. **1947–1960s** — Independent India's paper industry expands rapidly
8. **1990s–present** — Recycled fibre becomes dominant input in India (now 75%)

---

### 4.15 RESOURCES LIBRARY
**Route:** `/resources`

#### Page Header
- Title: "Research, Reports & Reference Materials"
- Subtext: *"Primary sources, industry reports, and reference guides — curated and verified."*

#### Filter Bar
- Type: All · Research Reports · Guides · Datasets · Policy Documents · Industry Data
- Source: Government · IPMA · Academic · International

#### Resource Card Grid
- 3-column desktop / 2-column tablet / 1-column mobile
- Each card:
  - Type badge (pill)
  - Source organisation name
  - Title (serif)
  - Year
  - 2-line description
  - Action button: "Download PDF" or "View Source" (external link)
- Paper stack hover

#### Admin Controls
- Add resources via `/admin/resources`
- Fields: title, type, source org, year, URL or file upload, description, tags

---

### 4.16 GLOSSARY
**Route:** `/glossary`  
**Purpose:** A–Z of paper and recycling terms. SEO gold. Links from all articles and myths.

#### Page Header
- Title: "Paper & Recycling Glossary"
- Search input (filters terms instantly)

#### A–Z Navigation
- Alphabet row at top — click a letter to jump to that section
- Each letter section has a subtle `<TornEdge>` micro-divider above it

#### Term Entry
- Term name (bold, serif, H3)
- Pronunciation (optional)
- 2–4 sentence definition — plain English
- Related terms (linked pills)
- "Used in these articles" (up to 3 linked article titles)

#### Seed Terms (30+ to start)
OCC · ONP · Kraft · Pulp · Cellulose · Lignin · Fourdrinier · Bagasse · GSM · Caliper · Brightness · Opacity · Coated paper · Uncoated · Recycled content · Post-consumer waste · Pre-consumer waste · Closed-loop recycling · Circularity · Agro-residue · ECF bleaching · TCF bleaching · Wet strength · Sizing · Calendering · Reel · Sheeting · Broke · Sack kraft · Newsprint · Paperboard · Cartonboard · Tissue · Moulded pulp

#### Admin Controls
- Add / edit / delete terms via `/admin/glossary`
- Link terms to articles manually

---

### 4.17 SEARCH
**Route:** `/search`  
**Purpose:** Cross-content search across articles, myths, resources, and glossary

#### Search Bar
- Large, centred, full-width on page
- Autofocus on page load
- Suggested queries shown below before typing: "paper recycling India" · "myth about trees" · "what is OCC"

#### Results
- Tabbed: All / Articles / Myths / Resources / Glossary
- Each result: type badge + title + 1-line excerpt + link
- "No results" state: friendly message + suggested related terms
- URL: `/search?q=query` — shareable, bookmarkable

#### Implementation
- MongoDB text index on all content collections
- Client-side debounce: 300ms before API call
- Results rendered server-side on direct URL load (SSR), client-side on typing

---

### 4.18 ABOUT
**Route:** `/about`

#### Sections
1. **Mission & Vision** — what Paper Foundation India is, why it exists, what "evidence-based" means in practice
2. **What We Stand For** — the editorial principles (numbered list, beautifully typeset)
   - Every claim is primary-source referenced
   - Corrections are dated and public
   - We are pro-paper, never anti-anything
   - We do not represent industry commercial interests
   - We celebrate complexity — paper's story has nuance
3. **Our Story** — brief founding narrative, why this was needed in India
4. **Team / Advisors** — card grid with name, role, short bio
5. **Corrections Policy** — how corrections work, link to `/corrections`
6. **Contact** — brief + link to `/contact`

---

### 4.19 NEWSROOM
**Route:** `/newsroom`

#### Sections
1. **Press Releases** — most recent 3 featured large, older ones in a table list
2. **Media Coverage** — wall of logos/links to coverage from news outlets
3. **Spokesperson** — contact card for media inquiries
4. **Brand Kit Download** — ZIP: logo SVG/PNG variants, colour palette, font info, usage guide
5. **Media Contact Form** — pre-filled inquiry type "Media/Press"

#### Press Release Page
**Route:** `/newsroom/[slug]`
- Full press release with date, headline, body, quotes
- Download as PDF button
- Share buttons
- Admin creates/edits via `/admin/newsroom`

---

### 4.20 GET INVOLVED
**Route:** `/get-involved`

#### Multi-Step Form (unfold animation between steps)
- **Step 1 — Role selector:** Volunteer · Partner Organisation · Sponsor · Researcher · Educator
- **Step 2 — Details:** Name, email, organisation (if applicable), brief message
- **Step 3 — Confirmation:** Thank you screen, what happens next, timeline

#### Partner / Sponsor Section
- Logos of current partners (managed from admin settings)
- Short text: "Partner with us to advance evidence-based understanding of paper in India"

#### Share Toolkit
- Downloadable zip: social media cards, shareable myth/fact images, logo assets
- "Help us spread the word" prompt

---

### 4.21 CONTACT
**Route:** `/contact`

#### Form Fields
- Inquiry type (select): General · Media / Press · Research Collaboration · Myth Submission · Technical Issue · Other
- Name · Email · Organisation (optional) · Subject · Message
- On type = "Media / Press": shows "Expected response time: 24 hours" indicator
- On type = "Myth Submission": shows special guidance

#### After Submission
- Success: animated paper crane flies in, confirmation message
- Admin sees inquiry in `/admin/inquiries` immediately
- Auto-reply email sent via Resend

#### Contact Info
- Email address
- Social links
- Address (if applicable)
- Response time expectation: "We typically respond within 2–3 business days"

---

### 4.22 CORRECTIONS
**Route:** `/corrections`

#### Page Header
- Title: "Corrections"
- Subtext: *"We correct errors promptly, openly, and with full context. Corrections are never silent."*
- Corrections policy (3–4 sentences)

#### Corrections Log
- Reverse chronological list
- Each entry:
  - Date of correction
  - Article title (linked)
  - What the original said
  - What it was changed to
  - Why it was corrected
  - Who flagged it (if credited)
- Auto-populated when admin adds a correction in the article editor

---

## 5. SHARED COMPONENTS

### paper-ui/ Components (must be built first — Week 1)

#### `<TornEdge />`
**Props:** `direction: "up" | "down"`, `fromColour: string`, `toColour: string`, `intensity: "subtle" | "strong"`  
**Behaviour:** SVG torn paper edge. Slight parallax lift on scroll. Used between every section.

#### `<PaperCard />`
**Props:** `children`, `variant: "standard" | "kraft" | "white"`, `hover: "stack" | "lift" | "none"`  
**Behaviour:** Card with paper texture background, correct shadow, stack or lift hover effect.

#### `<PaperTexture />`
**Props:** `opacity: number`, `type: "smooth" | "grain" | "kraft"`  
**Behaviour:** Absolutely positioned overlay, pointer-events: none. Applied over section backgrounds.

#### `<FibreParticles />`
**Props:** `density: "low" | "medium"`, `colour: string`, `paused: boolean`  
**Behaviour:** Canvas-based particle system. Pauses when scrolled off-screen.

#### `<InkBleedText />`
**Props:** `children`, `as: "h1" | "h2" | "display"`, `trigger: "mount" | "inview"`  
**Behaviour:** Blur → sharp animation on trigger. Runs once only.

#### `<PaperBadge />`
**Props:** `label: string`, `variant: "forest" | "sage" | "copper" | "outlined"`  
**Behaviour:** Pill badge with correct typography and colour.

#### `<CountUp />`
**Props:** `to: number`, `duration: number`, `prefix?: string`, `suffix?: string`  
**Behaviour:** Animates number from 0 to target when scrolled into view. Uses IntersectionObserver.

---

## 6. ADMIN PANEL — DETAILED

### Layout
- Left sidebar: dark charcoal (`#1F2937`), logo at top, nav items with Lucide icons
- Active item: forest green background + white text
- Top bar: page title + admin email + sign out
- Content area: white background, `#F8F9FA` secondary surfaces

### 6.1 Dashboard (`/admin`)
- 5 stat cards: Total Articles · Published Myths · Resources · Open Inquiries · Subscribers
- Recent inquiries list (5 newest, status badge each)
- Quick actions: "Write Article" · "Add Myth" · "Add Resource"
- Top performing content this week (3 articles by page views)
- Subscriber growth mini-chart (last 30 days)

### 6.2 Analytics (`/admin/analytics`)
- Page views: daily line chart (last 30 days), selectable range
- Top 10 articles by views (table)
- Top 10 myths by reveal count (table)
- Game play counts per game
- Subscriber growth over time
- Traffic sources (direct / social / organic / referral)
- Device breakdown (mobile / desktop / tablet)
- India state map showing where visitors come from
- All data sourced from custom analytics stored in MongoDB (no third-party trackers)

### 6.3 Articles (`/admin/articles`)
- Data table: Title · Category · Status · Views · Date · Actions
- Status badges: Published (green) · Draft (amber) · Archived (grey)
- Column: Featured (star toggle)
- Checkbox selection + bulk action bar: Publish · Unpublish · Feature · Delete
- Filter: All / Published / Drafts / Featured
- Search by title

### 6.4 Article Editor (`/admin/articles/[id]`)
- Title field (large, auto-generates slug)
- Slug field (editable, auto-updates on title change)
- Category dropdown
- Author field
- Cover image: Cloudinary upload widget, shows preview
- Excerpt textarea (used in cards and meta description)
- Quick Read toggle (marks article as < 3 min read)
- Featured toggle (shows in homepage featured slot)
- Rich text editor (Tiptap):
  - Headings H2, H3
  - Bold, italic, underline
  - Blockquote
  - Ordered/unordered list
  - Image insert (Cloudinary)
  - Citation mark (custom extension — adds superscript [n] linked to references)
  - Shareable quote mark (custom extension — marks paragraph as pullquote)
- References section: repeatable fields (Title · Organisation · Year · URL · Note), drag to reorder
- Corrections log: add entry (date auto-filled, what changed, why)
- SEO section (collapsible): SEO title · Meta description · OG image upload · OG title
- Publishing controls: Status toggle (Draft/Published) · Schedule date picker · Featured checkbox
- Autosave: every 12 seconds, "Saved" indicator in top bar
- Delete button (with confirmation modal)

### 6.5 Myths Manager (`/admin/myths`)
- Data table: Myth text · Category · Reveal count · Status · Actions
- Add / edit myth form:
  - Myth statement field
  - Fact statement field
  - Explanation textarea (2–3 sentences)
  - Category dropdown
  - Tags (multi-select)
  - Source badges: repeatable (org name + URL)
  - "Myth of the Day" toggle
  - Status (Published / Draft)
  - Preview: shows flip card preview before saving
- Bulk actions: Publish · Unpublish · Delete

### 6.6 Quiz & Games Manager (`/admin/games`)
- Tabs: Quiz Questions · Sort It Out Items · Guess the Product · Timeline Milestones
- **Quiz Questions:**
  - Table: question text · difficulty · % wrong · status
  - Add/edit: question · options (4) · correct answer index · difficulty · explanation · source
  - Toggle active/inactive per question
  - "This week's questions" — drag to select 8 active questions
- **Sort It Out Items:** add/edit item name · illustration · recyclable (yes/no/maybe) · explanation
- **Guess the Product:** add/edit product name · image upload · options · explanation
- **Timeline Milestones:** add/edit year · event · description · India-relevant toggle

### 6.7 Resources Manager (`/admin/resources`)
- Table: title · type · source · year · status
- Add/edit form: title · type dropdown · source org · year · URL or file upload · description · tags
- Bulk: publish / unpublish / delete

### 6.8 Glossary Manager (`/admin/glossary`)
- Table: term · first letter · linked articles count
- Add/edit: term · definition · related terms (linked) · pronunciation (optional)
- Link to articles: multi-select from existing articles

### 6.9 Newsroom Manager (`/admin/newsroom`)
- Tabs: Press Releases · Media Coverage · Settings
- Press release editor (same Tiptap editor, simpler fields)
- Media coverage: add link + outlet name + date + headline
- Settings: spokesperson name/contact, brand kit file upload

### 6.10 Inquiries Inbox (`/admin/inquiries`)
- Table: name · type · subject · date · status
- Status badges: New (red dot) · Read · Archived
- Filter by type (all / media / research / myth submission / general)
- Click to open full inquiry in a side panel
- Status update buttons
- "Reply by email" link (opens mail client with pre-filled to/subject)
- Notes field (internal only)
- Bulk: mark read / archive / delete

### 6.11 Subscribers (`/admin/subscribers`)
- Table: email · signup source · date · status
- Signup source tag: homepage · article · get-involved · game
- Export CSV button
- Delete (single or bulk)
- Subscriber count total + 30-day growth stat

### 6.12 Media Library (`/admin/media`)
- Grid of all Cloudinary uploads
- Search by filename
- Filter by type (image / document)
- Each item: thumbnail + filename + dimensions + upload date
- "Copy URL" button per item
- Delete (with "Used in X articles" warning)

### 6.13 Site Settings (`/admin/settings`)
- **Campaign Banner:** toggle on/off · message text · CTA label · CTA URL
- **Homepage:** featured article picker (dropdown of published articles) · featured myth of day picker
- **Fact of the Week:** current fact text · link URL · next rotation date
- **Quiz of the Week:** which 8 questions are active this week
- **Contact Info:** email address · social links (LinkedIn, Twitter, Instagram)
- **Everyday Paper:** add/edit/delete items in the Everyday Paper series
- **Partner Logos:** upload + manage partner/sponsor logos
- **India Snapshot Data:** JSON input fields for each annual dataset

---

## 7. CONTENT & SEED DATA

All seed data lives in `/content/seed/` as JSON files. The seed script is idempotent (safe to re-run).

### Seed Files
- `articles.json` — 10–15 full articles with proper references
- `myths.json` — 30+ myths with facts, explanations, sources
- `resources.json` — 20+ curated resources
- `glossary.json` — 30+ term definitions
- `quiz.json` — 15+ quiz questions with explanations
- `sort-items.json` — 15+ sorting game items
- `guess-products.json` — 12+ guess game items with image paths
- `timeline.json` — 8 Paper Trail milestones
- `everyday-paper.json` — 10+ everyday paper items

### Seed Script
```bash
npm run seed
```
- Connects to MongoDB Atlas
- Checks for existing records (does not duplicate)
- Inserts all seed data
- Creates admin user with hashed password
- Logs: "Seeded X articles, Y myths, Z resources..."

---

## 8. ANIMATIONS & INTERACTIONS

### Framer Motion Usage

#### Scroll Reveal (sitewide)
```
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: "easeOut" }
```
Applied via `useInView` hook. Stagger children by 100ms.

#### Page Transitions
- Between pages: fade out (150ms) → fade in (300ms)
- Using `AnimatePresence` on the root layout

#### Hero Fibre Particles
- Canvas, not Framer Motion
- `requestAnimationFrame` loop
- Paused when `document.hidden` (Page Visibility API)

#### Myth Card Flip
```
rotateY: 0 → 180 (front face)
rotateY: 180 → 360 (back face)
transition: duration: 0.4, ease: [0.34, 1.56, 0.64, 1]
```

#### Count-Up Numbers
- `useInView` triggers animation
- Linear interpolation from 0 to target over 1.5s
- EaseOut timing

#### Torn Paper Parallax
```
y: useTransform(scrollYProgress, [0, 1], [0, -8])
```

### Reduced Motion
All animations check `prefers-reduced-motion`. If set:
- Remove translateY from reveals (opacity only)
- Remove parallax
- Remove particle animation
- Remove ink-bleed
- Flip cards still work but without the spring overshoot

---

## 9. SEO & PERFORMANCE

### SEO
- `generateMetadata()` on every page (Next.js 15)
- Article slugs: auto-generated, human-readable, unique
- OG images: auto-generated per article using `@vercel/og` or Satori
- Sitemap: `/sitemap.xml` — dynamic, includes all published articles/myths/resources
- `robots.txt` — allow all except `/admin`
- Canonical URLs on all pages
- JSON-LD structured data on articles (Article schema) and myths (FAQPage schema)
- Glossary pages linkable: `/glossary#occ`
- Corrections page indexed (trust signal for Google E-E-A-T)

### Performance
- Images: Next.js `<Image>` component throughout, Cloudinary CDN
- Fonts: `next/font` (self-hosted Google Fonts — no external request)
- Bundle splitting: dynamic imports for heavy components (canvas, Tiptap, charts)
- Particle canvas: only loaded when hero is in viewport
- Charts (Recharts): lazy loaded on India Snapshot page
- Core Web Vitals targets: LCP < 2.5s · CLS < 0.1 · FID < 100ms

---

## 10. BUILD ORDER — STEP BY STEP

### Phase 0 — Setup (Day 1)
- [ ] Initialise Next.js 15 with TypeScript + Tailwind
- [ ] Set up design tokens (CSS variables from brand palette)
- [ ] Install Framer Motion, Lucide icons, DM Sans + Libre Baskerville fonts via `next/font`
- [ ] Set up folder structure as defined in Section 3
- [ ] Create `.env.example` with all required variables
- [ ] Set up ESLint + Prettier config
- [ ] Push to GitHub, set up Vercel project

### Phase 1 — Paper UI Component Kit (Days 2–4)
*Nothing else is built until these exist.*
- [ ] `TornEdge` component (SVG, both directions, both colours)
- [ ] `PaperCard` component (all variants + hover states)
- [ ] `PaperTexture` overlay component
- [ ] `FibreParticles` canvas component
- [ ] `InkBleedText` component
- [ ] `PaperBadge` component (all variants)
- [ ] `CountUp` component
- [ ] `Button` component (all variants)
- [ ] `Badge` / `Pill` component
- [ ] Typography test page at `/test` to verify all fonts + scales

### Phase 2 — Shell & Navigation (Day 5)
- [ ] `Nav` component (transparent → solid scroll, desktop + mobile)
- [ ] `Footer` component (4-column + torn edge)
- [ ] `CampaignBanner` component (dismissible)
- [ ] Site layout wrapper `app/(site)/layout.tsx`
- [ ] Admin layout wrapper `app/admin/layout.tsx` (auth-gated, sidebar)

### Phase 3 — Landing Page (Days 6–9)
*Build all 14 sections in order.*
- [ ] Section 1: Campaign Banner integration
- [ ] Section 2: Nav in context
- [ ] Section 3: Hero — layout, ink-bleed headline, FibreParticles
- [ ] Section 4: First TornEdge
- [ ] Section 5: 75% shock stat section
- [ ] Section 6: Trust strip
- [ ] Section 7: Myth teaser (3 flip cards)
- [ ] Section 8: Paper Journey teaser
- [ ] Section 9: Featured articles
- [ ] Section 10: India in Numbers (CountUp)
- [ ] Section 11: Game quiz teaser
- [ ] Section 12: Circularity loop SVG
- [ ] Section 13: Newsletter signup
- [ ] Section 14: Footer
- [ ] Mobile responsiveness pass on all sections

### Phase 4 — Content Pages (Days 10–16, parallel)
- [ ] Myths vs Facts page (filter, grid, flip cards, FAQ)
- [ ] Knowledge Hub index (filter, article cards, pagination)
- [ ] Article Reader (progress bar, TOC, body, citations, share bar)
- [ ] Resources Library
- [ ] Glossary (A–Z, search)
- [ ] Search page

### Phase 5 — Interactive Pages (Days 12–18, parallel with Phase 4)
- [ ] Paper Journey (8-stage scroll experience)
- [ ] India Paper Map (SVG map, choropleth, state popovers)
- [ ] Circularity Explainer (animated SVG ring)
- [ ] India Snapshot (data charts)
- [ ] Everyday Paper (masonry grid)

### Phase 6 — Games (Days 16–21)
- [ ] Discover Hub page
- [ ] Game 1: Quiz (question flow, reveal, score card)
- [ ] Game 2: Sort It Out (drag-and-drop)
- [ ] Game 3: Guess the Product (image reveal)
- [ ] Game 4: Paper Trail (timeline ordering)

### Phase 7 — Brand Pages (Days 18–21, parallel with Games)
- [ ] About page
- [ ] Newsroom + Press Release reader
- [ ] Get Involved (multi-step form)
- [ ] Contact form
- [ ] Corrections page

### Phase 8 — Admin Panel (Days 22–28)
- [ ] Admin auth (NextAuth, login page)
- [ ] Dashboard overview
- [ ] Articles table + bulk actions
- [ ] Article editor (Tiptap + all fields)
- [ ] Myths manager
- [ ] Games manager (all 4 tabs)
- [ ] Resources manager
- [ ] Glossary manager
- [ ] Newsroom manager
- [ ] Inquiries inbox
- [ ] Subscribers list
- [ ] Media library
- [ ] Analytics dashboard
- [ ] Site settings

### Phase 9 — Backend / API (Days 28–35)
- [ ] MongoDB connection + all Mongoose models
- [ ] API routes for all content types (CRUD)
- [ ] Bulk actions API (publish/unpublish/delete)
- [ ] Analytics tracking middleware (page views, game plays, myth reveals)
- [ ] Newsletter subscribe API + Resend confirmation email
- [ ] Contact form submission + Resend notification
- [ ] Cloudinary upload API route
- [ ] NextAuth admin auth
- [ ] Seed script (all content types)

### Phase 10 — Polish & Launch (Days 35–40)
- [ ] Full mobile QA pass (every page, every breakpoint)
- [ ] Animation audit (reduced-motion, performance, jank check)
- [ ] SEO audit (metadata, OG images, sitemap, robots.txt)
- [ ] Lighthouse pass (target: 90+ performance, 100 accessibility)
- [ ] Content population (seed all real data)
- [ ] Admin hands-off walkthrough
- [ ] Domain setup, environment variables in Vercel
- [ ] Final deployment

---

## SUMMARY COUNTS

| Category | Count |
|---|---|
| Public pages | 23 |
| Admin sections | 13 |
| Shared paper-ui components | 8 |
| Site components | 20+ |
| API routes | 15+ |
| Seed content files | 9 |
| Games | 4 |
| Interactive experiences | 5 |
| Build phases | 10 |
| Estimated frontend days | ~28 |
| Estimated total days | ~40 |

---

*Paper Foundation India — Use Paper Without Hesitation*  
*Document version 1.0 — Complete site plan*
