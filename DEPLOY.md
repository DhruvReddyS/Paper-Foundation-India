# Deploying paperfoundation.in

Everything in the repository is ready. What remains is one credential, a
hosting choice, and the steps below.

Run `npm run preflight` at any point. It reads `.env`, the file that actually
gets deployed, and will tell you what is still wrong.

---

## 1. The one thing blocking launch

**The Gmail refresh token is dead.** Google rejects it with `invalid_grant`.

This is not theoretical. A visitor who submits the newsletter form today gets:

```
HTTP 502  "We saved your request but could not send the confirmation yet."
```

Fix it in the Google Cloud console:

1. Re-run the OAuth consent flow for the project that owns `GMAIL_CLIENT_ID`
2. Put the new value in `GMAIL_REFRESH_TOKEN` in `.env`
3. Set the OAuth app to **Published**, not Testing

That last step matters. In Testing, Google expires refresh tokens after seven
days and you will be doing this again next week.

Confirm with `npm run preflight`. The blocker disappears when the token works.

Nothing else on the site depends on this. Signup confirmations send inline, and
campaigns are the only feature that waits on the scheduler.

---

## 2. Where to host it

**Recommended: Vercel, with GoDaddy staying the registrar.** You keep the
domain where it is and point DNS. Nothing is transferred.

Vercel's free Hobby tier genuinely fits this site:

- Custom domain, automatic HTTPS, deploy on push, instant rollback
- Cron runs **once a day**, which only delays unattended dispatch of
  *scheduled* campaigns. Signup confirmations send immediately, and you can
  send an approved campaign yourself from the admin.
- Hobby is for non-commercial use. A foundation taking memberships is a grey
  area, so read the current terms rather than taking this file's word for it.

**If you prefer GoDaddy**, their free tier cannot publish a public site; it
only hosts private preview apps. Publishing needs a Web Hosting plan from about
$6/month. Its real advantage is that `server.mjs` runs as written, so the
60-second campaign worker keeps ticking with no changes.

Before paying for GoDaddy, settle one question: **can it reach MongoDB Atlas on
TCP 27017?** GoDaddy documents outbound traffic as limited to ports 80 and 443
plus its own MySQL. If that applies, this site cannot run there at all.

`tools/godaddy-probe/` answers it. Upload it as a free preview app, set
`MONGODB_HOST` to one shard hostname, and open it. It prints a plain verdict.
A 403 or 404 beside an HTTPS service still counts as reachable; only "BLOCKED"
is a failure.

Do not test by loading the site itself. `publishedBody()` falls back to the
repository copy when the database is unreachable, so the pages will look
healthy while everything behind them is dead.

---

## 3. Deploying on Vercel

1. **Atlas → Network Access → add `0.0.0.0/0`.** Vercel's functions have no
   fixed IPs, so an address allowlist cannot work. The database is still
   protected by its username, password and TLS.

2. **Add New → Project → Import** `DhruvReddyS/Paper-Foundation-India`,
   branch `main`. No build configuration is needed.

3. **Add the environment variables** (Project → Settings → Environment
   Variables). Take the values from your `.env`:

   | Variable | Notes |
   |---|---|
   | `MONGODB_URI` | must include the database name, `/paperfoundation` |
   | `NEXTAUTH_SECRET` | 32+ random characters |
   | `NEXTAUTH_URL` | `https://paperfoundation.in` |
   | `NEXT_PUBLIC_SITE_URL` | `https://paperfoundation.in` |
   | `ADMIN_BOOTSTRAP_USERNAME` | your admin user ID |
   | `ADMIN_BOOTSTRAP_PASSWORD` | |
   | `ADMIN_PREVIEW_MODE` | `false` |
   | `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | media uploads |
   | `GMAIL_CLIENT_ID` / `_CLIENT_SECRET` / `_REFRESH_TOKEN` / `_SENDER_EMAIL` | newsletter |
   | `CRON_SECRET` | 32+ random characters |

   Leave `NEXT_PUBLIC_GA_ID` unset. The admin already reports readership from
   the site's own cookieless pipeline, and Google Analytics would add cookies,
   a consent banner and behavioural profiling of visitors who may be minors,
   whom India's DPDP rules protect.

   **Never upload `.env.local`.** It points at localhost and would override the
   live values.

4. **Set the function region to Mumbai (`bom1`).** Your audience is Indian and
   the default region is in the United States, which adds a round trip to every
   server-rendered page.

5. **Add the cron job.** Vercel ignores `server.mjs`, so the campaign worker
   will not run unless you declare it. Create `vercel.json`:

   ```json
   { "crons": [{ "path": "/api/cron/campaigns", "schedule": "0 3 * * *" }] }
   ```

   On Hobby, once a day is the maximum and a more frequent expression fails at
   deploy time. On Pro you can go down to once a minute.

6. **Connect the domain**: Vercel → Settings → Domains → add
   `paperfoundation.in`, then add the records it gives you in GoDaddy's DNS
   panel. HTTPS is issued automatically.

---

## 4. After it is live

Check these in order. Each one has failed at some point in development, so
none is ceremonial.

- [ ] `https://paperfoundation.in` loads over HTTPS. The production CSP sends
      `upgrade-insecure-requests`, so a broken certificate breaks every
      stylesheet and script, not just the padlock.
- [ ] Sign in at `/admin/login`. If it fails, `NEXTAUTH_URL` does not match the
      address being served.
- [ ] The dashboard shows **35 published articles**, not zero.
- [ ] Submit the newsletter form with a real address and confirm the email
      arrives. This is the one that depends on step 1.
- [ ] Submit the contact form and confirm it appears in the admin inbox.
- [ ] Upload an image in admin → Media, to prove Cloudinary works from the host.
- [ ] Play one game to the end and save the share card.
- [ ] Open the site on a phone.

Then two pieces of housekeeping:

- **Deactivate the second owner account.** `admin@paperfoundation.in` from the
  original seed still has full owner rights alongside yours.
- **Turn on two-factor** for your account in the Security centre. The admin
  supports it and neither account uses it.

---

## 5. Known, and not fixable in code

- **The logo artwork misspells its own caption**: `paper-foundation-logo.png`
  reads "Hesitaion". It is shown on the About page at up to 430px and is the
  PWA icon. The share cards spell it correctly because that text is drawn, not
  taken from the image.
- **Hidden Paper has seven objects**, and two of them are the same idea: a
  speaker cone and a paper cone tweeter, citing the same source. The round
  draws four, so variety is thin. Fixing it means another photograph, not code.
- **Firefox is unverified.** It will not launch in the development environment
  here. Chromium and WebKit, which stands in for Safari, both pass.
- **The articles have not been read by anyone at the Foundation.** Every claim
  traces to a cited source, but the prose is the Foundation's public voice and
  nobody there has signed it off.

---

## Verification as it stands

```
lint, types                clean
unit tests                 28 / 28
browser tests              200 / 200   Chromium + WebKit
admin screens              23 / 23     signed in, against the production build
public routes              27 / 27     HTTP 200
production build           exit 0, and needs no network
preflight                  1 blocker (Gmail), 2 local-only warnings
```
