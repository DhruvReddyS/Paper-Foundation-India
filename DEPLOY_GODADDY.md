# Deploy Paper Foundation India on GoDaddy

This project targets **GoDaddy Node.js Hosting**, not legacy shared/cPanel hosting. It runs on Node.js 22, builds with `npm run build`, starts with `npm start`, and listens on the `PORT` supplied by GoDaddy.

## Fastest deployment

1. In GoDaddy, open **My Products → Node.js Hosting → Manage**.
2. Choose **Import from GitHub** and select `DhruvReddyS/Paper-Foundation-India`, branch `main`. You can instead upload `.release/paper-foundation-india-godaddy.zip` from this computer.
3. In the hosting **Settings**, add every variable from `.env.example`. Never upload `.env` or `.env.local`.
4. Set both `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the final HTTPS address, for example `https://paperfoundation.in`.
5. Deploy. The host installs packages, runs the build script, and starts `server.mjs` through `npm start`.
6. Connect the purchased domain in GoDaddy and wait for SSL/DNS to become active.

## Required production services

- MongoDB Atlas: `MONGODB_URI`
- Admin authentication: `NEXTAUTH_SECRET` (at least 32 random characters), bootstrap username and a strong bootstrap password
- Cloudinary: cloud name, API key, and API secret
- Gmail API: client ID, client secret, refresh token, and verified sender email
- Campaign worker: a separate random `CRON_SECRET` of at least 32 characters

The Node server calls the protected campaign delivery endpoint once per minute. Database locking prevents duplicate delivery if the host temporarily runs more than one process.

## Release checks

Run locally before uploading:

```bash
npm ci
npm run verify
npm audit --omit=dev
npm run bundle:godaddy
```

After deployment, check `/api/health`, sign in at `/admin`, enable two-factor authentication in **Security centre**, create a CMS backup, upload one image, submit each public form, confirm one newsletter subscription, and send a test campaign to a small internal list.

If the host cannot connect to MongoDB, add its outbound address to the Atlas network access list or temporarily allow access while confirming the exact address, then narrow the rule again.
