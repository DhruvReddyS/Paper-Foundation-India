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

## CMS operations

- Local and production configuration: [`docs/ADMIN_SETUP.md`](docs/ADMIN_SETUP.md)
- Production release and recovery: [`docs/CMS_PRODUCTION_RUNBOOK.md`](docs/CMS_PRODUCTION_RUNBOOK.md)

```bash
npm run verify
npm run cms:check
npm run seed
npm run bundle:godaddy
```

GoDaddy deployment instructions: [`DEPLOY_GODADDY.md`](DEPLOY_GODADDY.md)
