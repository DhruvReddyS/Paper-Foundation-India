# CMS production runbook

## Release gate

Run these commands before every deployment:

```bash
npm ci
npm run verify
npm run cms:check
npm run seed
```

`npm run seed` is idempotent: it creates missing baseline records and the first owner, but does not overwrite editorial changes already stored in MongoDB.

## Required production services

1. Create or select the MongoDB Atlas cluster, allow the deployment network, create a least-privilege database user, and copy the current connection string into `MONGODB_URI`.
2. Generate a random `NEXTAUTH_SECRET` of at least 32 characters.
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the exact HTTPS production origin.
4. Set `ADMIN_BOOTSTRAP_USERNAME` and a unique password of at least 10 characters for the first seed/login. Rotate or remove the bootstrap password after the owner exists.
5. Configure Cloudinary and Gmail OAuth with the variables listed in `.env.example`.
6. Keep `ADMIN_PREVIEW_MODE=false` in production.

## First launch

1. Run `npm run cms:check` in the production environment.
2. Run `npm run seed` once to create baseline content and the first owner.
3. Sign in at `/admin/login` and create named accounts under Administrators.
4. Verify article draft/publish, myth publish, resource and glossary updates, media upload/delete protection, inquiry notes, subscriber tagging, a campaign test email, and public website controls.
5. Check `/api/health`; it returns HTTP 200 only when database, authentication, media and campaign configuration are present.

## Roles

- Owner: all CMS work and administrator management.
- Editor: content, website, media, audience and campaign changes.
- Analyst: read-only CMS and analytics access.

Disabling an account takes effect on its next protected API request. Production mutations re-check the current MongoDB account rather than trusting only the existing JWT.

## Backup and recovery

- Enable Atlas continuous backups or scheduled snapshots.
- Retain Cloudinary originals and restrict destructive access to named maintainers.
- Export subscriber, inquiry and editorial collections before a large migration.
- Test a database restore in a non-production environment at least quarterly.
