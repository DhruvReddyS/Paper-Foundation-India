# Team Ownership

This split keeps related routes together and prevents several people editing the same files.

## You — Home, journey, discover, and games

- `/` — `HOME.md`
- `/journey` — `PAPER_JOURNEY.md`
- `/discover` and `/games` — `DISCOVER.md` and `GAMES.md`
- Four canonical games under `/discover/*`

## Member 1 — Editorial learning

- `/myths` — `MYTHS.md`
- `/knowledge` — `KNOWLEDGE_HUB.md`
- `/knowledge/[slug]` — `ARTICLE.md`
- `/glossary` — `GLOSSARY.md`

## Member 2 — India data and material systems

- `/india-map` — `INDIA_MAP.md`
- `/india-snapshot` — `INDIA_SNAPSHOT.md`
- `/circularity` — `CIRCULARITY.md`
- `/everyday-paper` — `EVERYDAY_PAPER.md`

## Member 3 — Access and organisation

- `/resources` — `RESOURCES.md`
- `/search` — `SEARCH.md`
- `/about` — `ABOUT.md`
- `/get-involved` — `GET_INVOLVED.md`
- `/contact` — `CONTACT.md`

## Shared-code rules

1. The latest navbar lives only in `components/site/Nav.tsx`; nobody should create another navbar.
2. Coordinate before editing `app/globals.css`, `app/(site)/layout.tsx`, `components/ui`, or `components/paper-ui`.
3. Keep page-specific work inside that page’s route folder or dedicated component folder.
4. Pull the latest branch before starting, create a personal feature branch, and open a PR instead of pushing directly to `main`.
5. Each page must meet the acceptance checklist in its brief and work at mobile, tablet, and desktop widths.
