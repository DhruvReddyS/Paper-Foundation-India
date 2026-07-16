# Code Directory Guide

Use this file to jump from something visible on the website to the exact code that controls it.

## Protected project material

- `PLAN/` contains team briefs and ownership notes. Do not reorganise it during page work.
- `stuff/` contains source documents, photos and reference material. Do not rename, move or delete it.
- Shared files such as `app/globals.css`, `app/(site)/layout.tsx`, `components/site/`, `components/ui/` and `components/paper-ui/` affect multiple team members. Change them only when the task is explicitly shared.

## How to find a page section

Follow this path:

1. Start at the route entry: `app/(site)/<route>/page.tsx`.
2. Open the page composer imported by that file.
3. Find the section component in the page's `sections/` directory.
4. Open the colocated `.module.css` file for that section's visual design.
5. Open the colocated data file when the section renders repeated cards, facts or steps.

Example for the current landing page:

```text
app/(site)/page.tsx
  -> components/home/HomePage.tsx
    -> components/home/sections/playable-edition/PlayableEdition.tsx
       -> PlayableEdition.module.css
       -> games.ts
```

## Landing page section registry

The landing page is composed as a sequence of isolated sections. `HomePage.tsx` controls their order; each section owns its component and responsive CSS module.

| Order | Section | Component | Styles | Content/data | Browser anchor |
| --- | --- | --- | --- | --- | --- |
| 01 | Paper Has More Than One Life | `components/home/sections/living-cover/LivingCover.tsx` | `components/home/sections/living-cover/LivingCover.module.css` | Four life states inside component | `/` |
| 02 | Paper Understood Fairly | `components/home/sections/myths-fairly/MythsFairly.tsx` | `components/home/sections/myths-fairly/MythsFairly.module.css` | Claim files inside component | `/#understand-fairly` |
| 03 | Knowledge Hub | `components/home/sections/knowledge-hub/KnowledgeHub.tsx` | `components/home/sections/knowledge-hub/KnowledgeHub.module.css` | Featured and latest articles inside component | Landing page section 03 |
| 04 | Paper Journey | `components/home/sections/journey-preview/JourneyPreview.tsx` | `components/home/sections/journey-preview/JourneyPreview.module.css` | Journey chapter preview inside component | Landing page section 04 |
| 05 | The Playable Edition | `components/home/sections/playable-edition/PlayableEdition.tsx` | `components/home/sections/playable-edition/PlayableEdition.module.css` | `components/home/sections/playable-edition/games.ts` | `/#playable-edition` |
| 06 | Compact India Preview | `components/home/sections/india-ledger/IndiaLedger.tsx` | `components/home/sections/india-ledger/IndiaLedger.module.css` | Demo pins and numbers inside component | Landing page section 06 |
| 07 | Join + Correspondence Desk | `components/home/sections/community-desk/CommunityDesk.tsx` | `components/home/sections/community-desk/CommunityDesk.module.css` | Join CTA and misinformation/contact form | Landing page section 07 |

To move, remove or add a landing section, edit the import and render order in `components/home/HomePage.tsx`. Keep each new section in its own directory under `components/home/sections/` and register it in this table.

## Shared public shell

| Visible area | Code |
| --- | --- |
| Public layout wrapper | `app/(site)/layout.tsx` |
| Navbar and all dropdowns | `components/site/Nav.tsx` |
| Footer | `components/site/Footer.tsx` and `components/site/Footer.module.css` |
| Global tokens and truly shared styles | `app/globals.css` |
| Foundation brand images | `public/images/brand/` |

## Public page locations

Most public routes keep their section code directly beside their page entry.

| Route | Entry | Section code |
| --- | --- | --- |
| `/` | `app/(site)/page.tsx` | `components/home/sections/` |
| `/myths` | `app/(site)/myths/page.tsx` | `app/(site)/myths/sections/` and `components/editorial/MythsExperience.tsx` |
| `/knowledge` | `app/(site)/knowledge/page.tsx` | `app/(site)/knowledge/sections/` and `components/editorial/KnowledgeExperience.tsx` |
| `/knowledge/[slug]` | `app/(site)/knowledge/[slug]/page.tsx` | `app/(site)/knowledge/[slug]/sections/` |
| `/journey` | `app/(site)/journey/page.tsx` | `components/journey/` |
| `/discover` and `/games` | Their route `page.tsx` files | `components/games/` |
| `/discover/paper-word-search` | `app/(site)/discover/paper-word-search/page.tsx` | `components/games/PaperWordSearchGame.tsx` and its CSS module |
| `/join` | `app/(site)/join/page.tsx` | `components/home/sections/initiative-form/InitiativeForm.tsx` and its CSS module |
| `/india-map` | `app/(site)/india-map/page.tsx` | `app/(site)/india-map/sections/` |
| `/india-snapshot` | `app/(site)/india-snapshot/page.tsx` | `app/(site)/india-snapshot/sections/` |
| `/circularity` | `app/(site)/circularity/page.tsx` | `app/(site)/circularity/sections/` |
| `/everyday-paper` | `app/(site)/everyday-paper/page.tsx` | `app/(site)/everyday-paper/sections/` |
| `/resources` | `app/(site)/resources/page.tsx` | `app/(site)/resources/sections/` |
| `/glossary` | `app/(site)/glossary/page.tsx` | `app/(site)/glossary/sections/` |
| `/search` | `app/(site)/search/page.tsx` | `app/(site)/search/sections/` and `components/editorial/SearchExperience.tsx` |
| `/about` | `app/(site)/about/page.tsx` | `app/(site)/about/sections/` and `components/editorial/AboutExperience.tsx` |
| `/get-involved` | `app/(site)/get-involved/page.tsx` | `app/(site)/get-involved/sections/` |
| `/contact` | `app/(site)/contact/page.tsx` | `app/(site)/contact/sections/` |

## Useful searches

```bash
# Find where a section is rendered
rg -n "PlayableEdition" app components

# Find every reference to a CSS class or component
rg -n "name-you-see-in-code" app components

# List one page and all of its sections
rg --files 'app/(site)/about'
```

## Landing-page organisation rule

Each future section should have one clear responsibility and this shape:

```text
components/home/sections/section-name/
  SectionName.tsx
  SectionName.module.css
  data.ts                 # only when the section needs repeated content
```

Do not place new landing sections back into `app/globals.css`, and do not recreate a single large homepage component.
