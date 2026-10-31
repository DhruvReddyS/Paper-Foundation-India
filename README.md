# Paper Foundation India

Production website and multi-user content management system for public education about paper, circularity, and India’s paper ecosystem.

## Start here

- Team ownership and branch rules: [`PLAN/TEAM_OWNERSHIP.md`](PLAN/TEAM_OWNERSHIP.md)
- Current route list: [`PLAN/PLAN.md`](PLAN/PLAN.md)
- Page briefs: [`PLAN/PAGES/`](PLAN/PAGES/)

```bash
npm install
npm run dev
```

## Production capabilities

- Role-based CMS for owners, editors and analysts
- Draft, review, scheduling, publishing, immutable history and one-click rollback
- Media, articles, myths, resources, glossary, games and public-site controls
- Inquiry, membership and subscriber management with audit history
- Double-opt-in newsletter, tagged audiences, test sends, scheduled campaigns, retries and unsubscribe suppression
- Two-factor admin authentication, recovery codes, login lockout, rate limits and file-content validation
- Owner backup export, health/status checks, SEO sitemap/robots/manifest, privacy notice and terms

## Before deploying

Read [`docs/DEPLOYMENT_READINESS.md`](docs/DEPLOYMENT_READINESS.md) first. It
records what has been verified by running it, what is still open, and the two
configuration blockers that must be cleared before a public domain is pointed
at this build.

```bash
npm run verify:deploy
```

That runs lint, types, tests and the build, then checks the deployment
configuration and the live services. `npm run preflight` on its own catches the
localhost URLs that would otherwise end up in canonical tags, Open Graph data
and the sitemap.

## CMS operations

- Local and production configuration: [`docs/ADMIN_SETUP.md`](docs/ADMIN_SETUP.md)
- Production release and recovery: [`docs/CMS_PRODUCTION_RUNBOOK.md`](docs/CMS_PRODUCTION_RUNBOOK.md)

```bash
npm run verify          # lint, types, unit tests, build
npm run test:e2e        # browser tests at 375, 768 and 1440 px
npm run preflight       # deployment configuration safety
npm run cms:check       # database and integration status
npm run seed            # idempotent content seed
npm run bundle:godaddy
node scripts/optimise-images.mjs --dry   # image weight report
```

GoDaddy deployment instructions: [`DEPLOY_GODADDY.md`](DEPLOY_GODADDY.md)
