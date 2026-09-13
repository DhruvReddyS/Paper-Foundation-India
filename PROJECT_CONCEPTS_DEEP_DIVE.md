# Paper Foundation India: Deep-Dive Concepts Guide

## Purpose

Use this document to explain **how this codebase works** in an interview. Every section starts simply, then moves to implementation detail. The project is a Next.js full-stack application with MongoDB, not a separate Express + PostgreSQL application.

## 1. Authentication

### Simple explanation

Authentication answers: **"Who are you?"**

For this project, authentication is only needed for the admin dashboard. An administrator enters a username and password. The server checks the credentials safely. If they are correct, it creates a signed login session so the administrator does not need to enter the password again on every page.

### What this project uses

- **NextAuth v4** with `CredentialsProvider`
- **MongoDB** to store administrator accounts
- **bcrypt** to hash passwords
- **JWT session strategy** with an 8-hour lifetime
- **Next.js middleware** to protect the `/admin` route area

Important files:

- `lib/auth.ts`: login validation, password comparison, JWT/session claims.
- `app/api/auth/[...nextauth]/route.ts`: exposes NextAuth `GET` and `POST` handlers.
- `middleware.ts`: checks a token before allowing an admin page request.
- `lib/models/AdminUser.ts`: administrator document schema.
- `components/admin/AdminLoginAction.tsx`: login UI action.

### Login flow in this codebase

```text
1. Admin visits /admin.
2. middleware.ts checks whether a valid JWT exists.
3. If absent, Next.js redirects to /admin/login.
4. Admin submits username and password through NextAuth.
5. CredentialsProvider.authorize() validates shape using Zod.
6. Server connects to MongoDB and finds AdminUser by username.
7. bcrypt.compare(enteredPassword, storedPasswordHash) verifies credentials.
8. NextAuth signs a JWT containing admin ID and role.
9. Browser sends the session token on later requests.
10. Middleware/API authorization accepts or rejects the request.
```

### Step-by-step code logic

#### A. Validate input first

`loginSchema` in `lib/auth.ts` requires a trimmed, lowercase username with 3-80 characters and a password with 8-160 characters.

Why: browser input rules are helpful but can be bypassed. Server-side validation protects the database and avoids processing malformed requests.

#### B. Find the admin record

```ts
let admin = await AdminUser
  .findOne({ username })
  .select("+passwordHash +failedAttempts +lockedUntil");
```

The password hash has `select: false` in the schema, so normal queries and JSON responses do not accidentally expose it. Authentication explicitly requests it only for credential comparison.

#### C. Compare a hash, never a plain password

The database stores `passwordHash`, not a password. `bcrypt.compare()` hashes the submitted password using the stored bcrypt information and determines whether it matches.

```text
Entered password -> bcrypt.compare -> matches stored bcrypt hash?
                                  -> yes: authenticate
                                  -> no: record failure and reject
```

**Why bcrypt instead of SHA-256?** SHA-256 is fast, which is desirable for file integrity but bad for passwords. Bcrypt is intentionally slow and includes a salt, making offline password guessing more expensive after a database leak.

The project hashes new passwords using `bcrypt.hash(password, 12)`. `12` is the work factor: higher is more resistant to guessing but consumes more CPU per login.

#### D. Login lockout

The `AdminUser` model contains `failedAttempts` and `lockedUntil` fields. The flow is:

```text
Wrong password
  -> increment failedAttempts
  -> on fifth failure: reset count and set lockedUntil = now + 15 minutes
  -> while lockedUntil is still in the future: reject login
Correct password
  -> reset failedAttempts, clear lockedUntil, update lastLoginAt
```

This makes repeated password guessing harder. It is a basic protection, not a complete anti-brute-force system; rate limiting by IP/account should be added for production.

#### E. JWT/session creation

On a successful login, the provider returns `{ id, name, email, role }`. The NextAuth `jwt` callback copies `adminId` and `role` into the token. The `session` callback exposes ID/role on `session.user`.

The session is configured as:

```ts
session: { strategy: "jwt", maxAge: 8 * 60 * 60 }
```

A JWT is a signed token with claims. It lets the server verify that claims have not been tampered with. It is not automatically encrypted, so do not place secrets such as a password in it.

### Bootstrap owner

The code supports a first-run owner account through environment variables:

- `ADMIN_BOOTSTRAP_USERNAME`
- `ADMIN_BOOTSTRAP_PASSWORD`

If no `AdminUser` exists and those credentials match, `bootstrapOwner()` creates an `owner` record with a bcrypt hash. This avoids manually inserting the first account into MongoDB. After an account exists, the bootstrap credentials no longer create users.

### Interview-ready answer

"For admin authentication I used NextAuth CredentialsProvider. The login handler validates the username/password payload with Zod, retrieves the admin record from MongoDB, and compares the submitted password against a bcrypt hash. On success, NextAuth creates an 8-hour JWT session containing the user ID and role. I protect admin page requests in middleware and also authorize protected API routes server-side, because hiding an admin page alone does not secure the API."

## 2. Authorization and RBAC

### Simple explanation

Authorization answers: **"What are you allowed to do?"**

Being logged in does not automatically mean a user can do everything. This project has three role names: `owner`, `editor`, and `analyst`.

### What is enforced today

| Action | Current rule |
| --- | --- |
| Open an admin page | Must have a valid JWT, except local preview mode |
| Create/edit/delete articles, myths, resources, media, campaigns, settings | Must pass `requireAdmin()` |
| Read admin lists/statistics | Must pass `requireAdmin()` |
| Manage administrator accounts | Must be an `owner` |
| Remove/demote the final active owner | Rejected |
| Disable/delete your own owner account | Rejected |

### Two authorization layers

```text
Layer 1: middleware.ts
  Stops unauthenticated browser navigation to /admin/*.

Layer 2: requireAdmin() / ownerSession()
  Stops direct API calls, even if someone bypasses the UI.
```

#### Route middleware

`middleware.ts` matches `/admin/:path*`. It calls `getToken()` with `NEXTAUTH_SECRET`. If the JWT has a subject, the user can continue; otherwise they are redirected to `/admin/login` with a `callbackUrl`.

Why use middleware? It gives a fast user experience and prevents rendering protected pages for logged-out users.

Why is middleware alone insufficient? A malicious user can call `/api/articles` directly with curl/Postman. Each mutation route therefore also calls `requireAdmin()`.

#### API authorization helper

```ts
export async function requireAdmin() {
  return await canManageContent()
    ? null
    : NextResponse.json({ error: "Admin access required" }, { status: 401 });
}
```

Route handlers use it as:

```ts
const denied = await requireAdmin();
if (denied) return denied;
```

This avoids copying the same session logic into every endpoint.

#### Owner-only management

`app/api/admin/users/route.ts` has its own `ownerSession()` helper. It reads the server session and returns a user only if `role === "owner"`; otherwise it returns `403 Forbidden`.

The route enforces important invariants:

- The current owner cannot disable or delete themselves.
- A role change cannot demote the final active owner.
- Deleting an owner is blocked if only one active owner remains.

### Important current limitation

The schema contains `owner`, `editor`, and `analyst`, but most content API routes only check **is this person an authenticated admin?** They do not yet block analysts from editing content. In an interview, do not overclaim full role-based permissions.

### Better RBAC design

```ts
const permissions = {
  owner: ["content:read", "content:write", "users:manage", "settings:manage"],
  editor: ["content:read", "content:write"],
  analyst: ["content:read", "analytics:read"],
};
```

Then use `requirePermission("content:write")` in mutation routes. This scales better than placing role comparisons throughout every handler.

### Authentication vs authorization

| Question | Concept | Project example |
| --- | --- | --- |
| Who are you? | Authentication | Password checked with bcrypt and session created |
| Can you edit an article? | Authorization | `requireAdmin()` checks authenticated admin session |
| Can you create another admin? | Role-based authorization | `ownerSession()` requires role `owner` |

## 3. Backend architecture

### Simple explanation

The frontend and backend live in one Next.js project. The React interface sends HTTP requests to routes under `/api`. A route checks access and data, calls the database or an external service, then returns JSON.

### Actual architecture

```text
Client component/page
  -> fetch("/api/...", options)
  -> app/api/<feature>/route.ts
  -> authorization helper (if protected)
  -> Zod validator (if input is accepted)
  -> connectDB() or integration helper
  -> Mongoose query / Cloudinary / Gmail
  -> NextResponse.json(...)
  -> client updates React state/UI
```

### Layers in this repository

| Layer | Code location | Job |
| --- | --- | --- |
| Presentation | `app`, `components` | Pages, forms, cards, dashboard views |
| Route/controller-like layer | `app/api/**/route.ts` | HTTP method handling, status codes, orchestration |
| Auth/infrastructure services | `lib/auth.ts`, `lib/api-auth.ts`, `lib/db.ts` | Sessions, authorization, database connection |
| Integrations | `lib/cloudinary.ts`, `lib/gmail.ts` | External API communication |
| Validation | `lib/validators` and inline Zod schemas | Trusted input shape and business limits |
| Persistence | `lib/models` | MongoDB document schemas, indexes, queries |
| Fallback data | `content` | Local editorial data when CMS database is unavailable |

This is a pragmatic small-to-medium project architecture. It does not have separate `controllers/`, `services/`, and `repositories/` folders. The route handler takes the controller role, while reusable cross-cutting logic is moved into `lib`.

### Route handler example: create article

`app/api/articles/route.ts` follows this sequence:

```text
POST /api/articles
  -> requireAdmin()
  -> verify MONGODB_URI exists
  -> request.json()
  -> articleSchema.safeParse(payload)
  -> connectDB()
  -> Article.create(parsed.data)
  -> return { item } with HTTP 201
```

On an invalid payload, it returns `400` with `parsed.error.flatten()`. If MongoDB is not configured, it returns `503` rather than pretending an article was saved.

### Why not Express?

Express is not used. Next.js route handlers replace the usual Express route/controller layer for this application.

| Express idea | Next.js equivalent here |
| --- | --- |
| `app.use()` middleware | `middleware.ts`, plus helper checks inside route handlers |
| `router.post('/articles')` | `export async function POST()` in `app/api/articles/route.ts` |
| `req.body` | `await request.json()` |
| `res.status(201).json(data)` | `NextResponse.json(data, { status: 201 })` |
| Express middleware function | `requireAdmin()` helper / Zod parsing function |

### Request lifecycle examples

#### Public read request

```text
Knowledge page -> GET /api/articles?status=published
  -> if database missing, return local articleCatalog
  -> else Article.find({ status: "published" }).sort(...).lean()
  -> JSON { items, source }
  -> React renders article cards
```

#### Protected mutation request

```text
Admin form -> PATCH /api/myths
  -> verify session with requireAdmin()
  -> validate partial payload with mythSchema.partial()
  -> Myth.findByIdAndUpdate(id, fields, { new: true, runValidators: true })
  -> JSON updated item or 404
  -> admin UI refetches current list
```

### Async programming and the event loop

Database and third-party HTTP calls are asynchronous. `await connectDB()`, `await Article.create()`, and `await fetch()` wait for their result without making Node wait idly for I/O.

`Promise.all()` is used when work is independent. For example, campaign recipient fetch/count or dashboard aggregate queries can run in parallel. Do not use it where operations must happen in order, such as upload a membership PDF first, then save the resulting URL with the inquiry.

### Error handling approach

The code uses explicit HTTP errors near each failure point:

| Status | Example meaning |
| --- | --- |
| `400` | Invalid JSON/input, missing ID, invalid file |
| `401` | No authenticated admin session |
| `403` | Logged-in user is not an owner |
| `404` | Requested record does not exist |
| `409` | Conflict, e.g. campaign cannot be edited after sending begins |
| `413` | Uploaded file is too large |
| `502` | External provider action failed |
| `503` | Required configuration/service is unavailable |

Improvement: create a centralized error wrapper with structured logs, error codes, request IDs, and consistent response shapes.

## 4. Database handling and storage

### Simple explanation

The project uses MongoDB as the main application database. MongoDB stores documents that look like JavaScript objects. Mongoose defines what each document should contain and how it should be indexed.

Cloudinary stores the actual uploaded images/PDFs. MongoDB stores their metadata and URLs, not the file bytes themselves.

### Connection handling

`lib/db.ts` creates a cached Mongoose connection:

```text
First request -> connect with MONGODB_URI -> store promise/connection globally
Later requests -> reuse existing connection
Connection error -> clear cached promise so later request can retry
```

This matters in Next.js development and serverless-style execution: without caching, every route call could open unnecessary database connections. Configuration includes `maxPoolSize: 10`, `maxIdleTimeMS: 60000`, and a 10-second server-selection timeout.

### What Mongoose does

Mongoose is an ODM, an Object Data Mapper. It turns JavaScript methods into MongoDB operations while adding schema rules.

Examples from the project:

- `Article.create(data)` inserts a new article document.
- `Article.find(filter).sort(...).lean()` reads lightweight plain objects.
- `Subscriber.findOneAndUpdate(..., { upsert: true })` updates or creates a subscriber.
- `GameResult.aggregate([...])` calculates game totals in the database.

### Data models and storage decisions

#### Content documents

Article and myth documents embed related small values:

```text
Article
  title, slug, category, body
  sources: [{ label, url }]
  tags: [string]
  media: [{ url, publicId, type, alt }]
  status, featured, order, timestamps
```

Embedding is sensible because one article is normally loaded as one unit with its sources/tags/media. It avoids extra joins/queries for a page render.

#### Subscriber documents

Each email appears once because `email` is unique. Re-subscription uses an upsert:

```ts
Subscriber.findOneAndUpdate(
  { email: normalizedEmail },
  { ...data, status: "active", subscribedAt: new Date() },
  { upsert: true, new: true, setDefaultsOnInsert: true }
)
```

This reduces duplicate records and lets an unsubscribed person subscribe again.

#### Analytics documents

Events are intentionally append-oriented: each page view, article completion, game open, etc. becomes a document with event/path/content/session/time metadata. The admin UI uses aggregation pipelines for summaries instead of storing a manually updated counter that might become inaccurate.

#### Game results

The unique `sessionId` is an idempotency key. If the frontend retries because of a network problem, the server upsert preserves one result for that UUID.

#### Media and files

```text
Browser sends FormData
  -> server validates file
  -> server signs and sends upload to Cloudinary
  -> Cloudinary returns public ID, URL, dimensions, type, etc.
  -> MongoDB Media document stores metadata and usage information
```

For a membership PDF, the server checks file size, MIME type, `.pdf` suffix, and `%PDF-` signature before Cloudinary upload. The stored inquiry keeps `attachmentUrl` and `attachmentName`.

### Indexes

Indexes are like a book index: they help find a value without reading every page/document. This project indexes fields frequently used for lookups/filtering:

- Administrator username, role, active status.
- Article slug, category, status, featured/order.
- Subscriber email/status.
- Analytics event/path/content/session/time.
- Game result sessionId/gameId/completed time.

Trade-off: indexes speed reads but add storage and slow writes slightly because MongoDB updates the index on each insert/update.

### Aggregation pipeline

The project uses MongoDB aggregation for analytics and games:

```text
$match: keep only relevant time period/documents
$group: calculate count, average, minimum, etc.
$project: shape output fields
$sort: order results
$limit: keep top records
```

Example: `/api/games` groups results by `gameId`, calculates number of plays, average percentage, and fastest completion time. This is more efficient than fetching all game results into Node and calculating there.

### Database consistency rules

MongoDB does not provide SQL-style foreign keys in this project. The application enforces relevant rules itself:

- Unique indexes prevent duplicate usernames/emails/slugs/session IDs.
- Schema enums restrict values such as article status and role.
- Media deletion checks its `usage` array before deleting the asset.
- Campaign state prevents editing after it is moving beyond draft/paused states.
- Owner protection prevents accidentally removing all owners.

## 5. Normalization and denormalization

### Simple explanation

Normalization means organizing data so the same fact is not repeated unnecessarily. It is mainly associated with relational databases such as PostgreSQL.

Denormalization means intentionally keeping related data together or duplicating a small amount of data so reads become simpler/faster. MongoDB often uses denormalization because documents are read as a whole.

### Normalization example for this project

If this were PostgreSQL, a normalized article design could be:

```text
articles(id, title, slug, category_id, body, status)
sources(id, label, url)
article_sources(article_id, source_id)
tags(id, name)
article_tags(article_id, tag_id)
```

This avoids duplicating the same source or tag text across articles. To display the full article, SQL uses joins.

### What this project does instead

Article documents embed `sources`, `tags`, and `media` arrays. This is a deliberate denormalized/document-oriented design.

```json
{
  "title": "Example article",
  "sources": [{ "label": "FAO", "url": "https://example.org" }],
  "tags": ["recycling", "fibre"]
}
```

### Why it makes sense here

- Articles are normally fetched/displayed as one whole record.
- Sources and tags are small arrays owned by one article.
- The CMS needs flexible editorial fields.
- It avoids extra lookups for a public article page.

### Trade-off to explain

If a source label/URL is used by 100 articles and needs correction, embedded copies must each be updated. A normalized SQL source table would update one source record. The right choice depends on access patterns and data ownership.

### Normal forms, simply

- **1NF:** every field holds one value, no repeating table groups.
- **2NF:** non-key fields depend on the full key.
- **3NF:** non-key fields depend only on the key, not another non-key field.

For most interviews, explain the purpose rather than reciting definitions: normalization reduces duplication, prevents update anomalies, and clarifies relationships.

## 6. Scraping and content extraction

### What this project actually does

The project does **not** contain a web scraper, crawler, Cheerio, Puppeteer, Playwright, or browser automation system.

It contains a one-off local document extraction script: `scripts/extract_myth_handbook.py`. It reads an editorial `.docx` handbook using `python-docx`, extracts structured cards from table cells, validates the expected shape, and writes CMS-ready JSON.

### Actual extraction flow

```text
Local Word handbook (.docx)
  -> python-docx Document(source)
  -> iterate document.tables
  -> read first cell in each table
  -> regex split around known labels
  -> normalize whitespace and remove review suffix
  -> create myth JSON object
  -> verify exactly 60 complete cards
  -> write UTF-8 JSON file
```

The labels are explicitly known: `MYTH`, `EVIDENCE-BASED REALITY`, `EXPLANATION`, `INDIA CONTEXT`, `EVIDENCE TO VERIFY`, and `EDITORIAL CAUTION`.

The script fails fast when it does not find exactly 60 complete cards. That guard matters because a changed document template could otherwise create incomplete or incorrectly mapped CMS data silently.

### Extraction versus scraping

| Term | Meaning | Project status |
| --- | --- | --- |
| Document extraction | Read structured data from a local file | Implemented for a Word handbook |
| Web scraping | Download and parse web pages | Not implemented |
| Crawling | Discover/follow many URLs automatically | Not implemented |
| API integration | Call a documented third-party HTTP API | Implemented for Cloudinary and Gmail, not source research |

### How to answer if asked "did you use scraping?"

"I did not build a production web scraper in this project. I built a controlled content-ingestion script that extracts structured myth cards from a local editorial Word handbook into JSON. It validates the expected 60-card structure before writing output. If I added web research ingestion, I would respect source terms/robots rules, rate limit requests, retain source URLs/dates, deduplicate results, queue jobs, and require editorial review before publishing."

### Safe production scraping architecture (hypothetical)

```text
Approved seed URLs
  -> queue worker with rate limits and retries
  -> fetch only permitted pages / documented APIs
  -> parse/extract title, date, body, canonical URL
  -> validate and deduplicate
  -> store as unreviewed source material
  -> human editorial review
  -> publish approved content only
```

Key concerns: follow website terms and robots.txt where applicable, do not bypass access controls, set a descriptive user agent, avoid aggressive request rates, preserve provenance, and never automatically treat scraped claims as verified facts.

## 7. Validation, security, APIs, and external services

### Zod validation

Zod validates untrusted API input at runtime. TypeScript helps developers while coding, but TypeScript types disappear at runtime; a malicious or buggy client can still send any JSON. Zod is therefore essential at the API boundary.

Examples:

- Article slug accepts lowercase hyphen-separated text only.
- Article reading time is coerced to an integer between 1 and 90.
- Inquiry email must be a valid email and message is capped at 8,000 characters.
- Game score cannot be negative or exceed `outOf`.
- Campaign body has a 50,000-character maximum.

`safeParse()` returns success/failure instead of throwing. The route can reply with `400 Bad Request` and useful error details.

### File upload security

Membership PDF upload validates:

1. a file exists;
2. size is between 1 byte and 8 MB;
3. MIME type and filename say PDF;
4. first five bytes equal `%PDF-`;
5. Cloudinary is configured.

This is defense in depth. Client-side `accept="application/pdf"` is only a UI hint and cannot be trusted. Further production improvements are malware scanning, content-disposition controls, private storage/expiring signed URLs for membership documents, and rate limiting.

### Cloudinary integration

`lib/cloudinary.ts` keeps `CLOUDINARY_API_SECRET` server-side. It generates a SHA-1 signature from upload parameters plus the secret. The browser sends its file to the project endpoint; the server talks to Cloudinary. This prevents exposing an API secret in frontend code.

MongoDB stores the Cloudinary public ID and URLs. On deletion, the app deletes the Cloudinary asset and then deletes the MongoDB metadata record, after checking no known content uses it.

### Gmail OAuth integration

Campaign email uses a Gmail refresh token. `lib/gmail.ts` exchanges it for a short-lived access token, builds MIME plain-text and HTML content, Base64URL-encodes it, then posts it to Gmail's message-send endpoint.

Security details:

- `safeHeader()` removes CR/LF characters to reduce email header injection risk.
- `escapeHtml()` escapes user/editor supplied campaign text before inserting it into HTML.
- Unsubscribe tokens are HMACs derived from the email and server secret.

### CORS

CORS controls which browser origins may call an API. This project uses same-origin calls such as `fetch('/api/articles')`, so explicit CORS configuration is not required for normal use. If the frontend were deployed separately from the API, configure a strict allow-list of allowed origins and methods. CORS is a browser policy, not an authentication system.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Signs/authenticates NextAuth JWTs and unsubscribe HMACs |
| `ADMIN_BOOTSTRAP_USERNAME/PASSWORD` | First-owner creation only |
| `CLOUDINARY_*` | Server-side Cloudinary access |
| `GMAIL_*` | Gmail sender/OAuth configuration |
| `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL` | Public origin/callback URLs |
| `NEXT_PUBLIC_GA_ID` | Optional GA script identifier |

Never expose secret values in a `NEXT_PUBLIC_*` variable. Those values are bundled for the browser.

## 8. Data flow examples

### Newsletter signup

```text
Email input React state
  -> POST /api/subscribers JSON
  -> Zod validates email
  -> lowercase email
  -> MongoDB upsert creates/updates active subscriber
  -> 201 response
  -> success UI and clear input
```

### Protected media upload

```text
Admin FormData
  -> POST /api/upload
  -> requireAdmin()
  -> verify Cloudinary configuration + 20 MB size limit
  -> signed Cloudinary upload
  -> Media.findOneAndUpdate(..., upsert: true)
  -> response with stored media metadata
  -> admin library refreshes list
```

### Anonymous game result

```text
Game React state
  -> ResultPanel creates browser UUID
  -> localStorage best/history immediately
  -> POST /api/games asynchronously
  -> Zod checks score/duration/game ID/session UUID
  -> GameResult upsert by sessionId
  -> admin aggregation reports statistics
```

## 9. Best interview answers to practice

### "How do you store data?"

"I store CMS and operational data in MongoDB through Mongoose models. Mongoose schemas define required fields, enums, defaults, indexes, and uniqueness. I reuse a cached connection pool in `lib/db.ts`. Binary assets are stored in Cloudinary; MongoDB stores their metadata and URLs. For reporting, I use MongoDB aggregation pipelines rather than processing all records in Node."

### "How did you secure the admin dashboard?"

"I use NextAuth credentials authentication, bcrypt password hashes, JWT sessions, route middleware for `/admin`, and server-side API checks. User administration is restricted to an owner role. I also added failed-login lockout logic and prevent the final active owner from being deleted or demoted."

### "How did you handle data relationships without foreign keys?"

"The content model is document-oriented, so small article-owned data such as sources, tags, and media is embedded in the article. Some links are logical references, such as analytics content IDs and media usage. Since MongoDB does not enforce foreign keys here, I add application-level checks, for example preventing deletion of media marked as in use."

### "What would you improve?"

"I would add granular permissions for editor versus analyst roles, centralized logging/error monitoring, rate limiting, stronger private document storage and scanning, pagination, automated integration tests, and a background queue for larger email sends. If relational reporting and delivery audit requirements grew, I would consider PostgreSQL for those modules."

### "What is the difference between scraping and your extraction script?"

"Scraping fetches and parses web pages; my repository does not do that. The script reads a local editorial `.docx`, extracts labeled content cards, validates the expected count and required fields, and produces JSON for CMS use. It is controlled content ingestion rather than web scraping."

## 10. Final memory checklist

- Authentication: prove identity with username/password, bcrypt, and JWT session.
- Authorization: control actions using middleware, `requireAdmin`, and owner-only checks.
- Backend: Next.js route handlers act like lightweight controllers; `lib` holds shared services.
- Database: MongoDB/Mongoose with cached connection pool, schemas, indexes, upserts, and aggregations.
- Storage: Cloudinary holds files; MongoDB holds URLs and metadata.
- Normalization: SQL strategy to reduce duplication; this Mongo project intentionally embeds article-owned data.
- Scraping: not implemented. Local `.docx` extraction is implemented and validated.
- Validation: Zod validates input on the server; browser validation alone is not security.
- Security: bcrypt, JWT, environment secrets, signed uploads, HMAC unsubscribe tokens, file checks, status codes.

## 11. Difficult tasks in this project: what was hard and why

This is the most useful section for project interviews. Interviewers often care less about a list of features and more about the engineering judgment behind difficult work.

### A. Building authentication safely

**Why it was difficult:** A login form looks simple, but a secure implementation must handle password storage, invalid inputs, inactive users, repeated failed attempts, session lifetime, direct API access, and the first administrator account.

**What was implemented:**

1. Zod validates credentials before a database query.
2. Passwords are stored as bcrypt hashes, not plain text.
3. Login uses `bcrypt.compare()`.
4. Five failed attempts lock the account for 15 minutes.
5. NextAuth creates JWT sessions for eight hours.
6. `middleware.ts` redirects unauthenticated users away from admin pages.
7. `requireAdmin()` protects server APIs too.
8. `ownerSession()` protects user management and preserves at least one owner.

**Why both middleware and API checks are needed:** Middleware improves navigation security and user experience, but it does not replace server-side API authorization. A user can bypass the browser page and send an HTTP request directly to `/api/articles`. The route itself must reject that request.

**Interview answer:**

"Authentication was one of the more security-sensitive parts. I treated it as two problems: verifying identity with NextAuth, bcrypt, and JWT sessions, then authorizing each protected API action. I also included login lockout and last-owner protection so operational mistakes cannot lock the team out of the CMS."

### B. Supporting public fallback content and a real CMS

**Why it was difficult:** The public site should still render in development or when the CMS database is not configured, but content editors must not be given a false success message for a change that was never stored.

**What was implemented:** Public read routes such as articles, myths, glossary, resources, and game configuration return a local editorial manifest/catalog when MongoDB is missing. Administrative create/update/delete routes return `503 Service Unavailable` when the database is unavailable.

```text
Public GET request
  -> database configured? yes -> MongoDB content
  -> database configured? no  -> local fallback content

Admin write request
  -> database configured? yes -> validate and store
  -> database configured? no  -> 503 error, no fake save
```

**Why this design:** It separates **availability** from **persistence**. Visitors can still learn from approved local content, but editors understand that a CMS operation requires a configured database.

**Trade-off:** Fallback content can become stale compared with CMS content. Production should use monitoring and alerts so a missing database does not quietly become the normal state.

### C. Designing an anonymous game system without login

**Why it was difficult:** The project needs a smooth game experience for public visitors without forcing account creation, while still collecting reliable aggregate score data and avoiding duplicate result submissions.

**What was implemented:**

- Game state/progress lives in React state in the browser.
- Personal best/history is saved in `localStorage` for the current browser.
- `ResultPanel` creates `crypto.randomUUID()` for each completed session.
- The result posts to `/api/games` asynchronously using `keepalive: true`.
- The server validates the game ID, score, maximum score, duration, and UUID with Zod.
- MongoDB upserts by the unique session ID.
- The admin route uses aggregation to calculate plays, average percentage, and fastest completion time.

**Why localStorage and MongoDB are both used:** They serve different purposes. Local storage gives immediate personal history with no account. MongoDB provides anonymous aggregate product data for administrators. The UI does not wait for the network before showing a score, so a weak connection does not ruin the game experience.

**Difficult detail: idempotency.** If the user double-clicks, refreshes, or the network retries, the same UUID is sent again. `findOneAndUpdate` with `upsert: true` creates only one stored result for that session. This is an example of idempotent API design.

### D. Uploading files securely to Cloudinary

**Why it was difficult:** File upload crosses security boundaries. The browser controls the initial filename and MIME type, the server must not expose Cloudinary credentials, and the database must stay consistent with the storage provider.

**What was implemented:**

```text
Admin/member browser
  -> FormData file to project API
  -> endpoint validates size/type/signature as appropriate
  -> server creates signed Cloudinary request
  -> Cloudinary stores the asset
  -> server stores metadata/URL in MongoDB
  -> UI receives safe response metadata
```

There are two different flows:

| Endpoint | Audience | Rules |
| --- | --- | --- |
| `/api/upload` | Authenticated admin media library | Admin check, 20 MB maximum, Cloudinary metadata stored in `Media` |
| `/api/membership-upload` | Public membership application | PDF only, 8 MB maximum, type/extension/header check |

**Why a server-side signed upload:** The Cloudinary API secret stays in environment variables on the server. The server generates a SHA-1 signature using safe request parameters plus that secret. Sending the secret to client JavaScript would allow anyone to upload/delete through the Cloudinary account.

**Difficult detail: cleanup and consistency.** The current delete flow checks that `Media.usage` is empty, calls Cloudinary deletion, then removes the MongoDB record. A stronger future implementation would use a retry/outbox process to handle the rare case where one external operation succeeds but the later one fails.

### E. Sending email campaigns reliably

**Why it was difficult:** Email campaigns need recipient selection, personalization, unsubscribe links, delivery progress, error capture, provider authentication, and retries. Sending every email in a single HTTP request would risk timeouts for a larger subscriber base.

**What was implemented:**

1. Admin creates a campaign with status `draft`.
2. API validates name, subject, preview text, body, and recipient tag with Zod.
3. A test email path sends only to the provided test address.
4. A real send selects active subscribers, optionally matching a tag, excluding already-attempted recipient emails.
5. It processes at most 25 recipients in one request.
6. It records delivery and failure data in the campaign document.
7. When all intended recipients have been attempted, it marks the campaign `sent`.

**Why batching matters:** Sending all recipients at once can exceed host timeout limits or Gmail API rate limits. Batches reduce risk and make interrupted sends resumable using `deliveredTo`.

**Why both plain text and HTML email:** `lib/gmail.ts` constructs a MIME multipart email. Clients that support HTML get a branded template; clients that do not get readable plain text.

**Important limitation to admit:** A production-grade campaign system should run in a background job queue, handle provider webhooks/bounces, use transactional delivery records, rate-limit sends, and avoid storing a growing `deliveredTo` array in one document for very large lists.

### F. Measuring analytics without degrading the user experience

**Why it was difficult:** Analytics needs useful events but should not block page rendering or cause duplicate/noisy data. Browser navigation and page unloading make tracking harder.

**What was implemented:**

- `SiteAnalytics.tsx` derives context from `usePathname()`.
- It generates/stores a session ID in `sessionStorage`.
- It posts page, article, game, and myth interaction events with `keepalive: true`.
- It marks an article complete after about 82% scroll.
- It uses `navigator.sendBeacon()` on `pagehide` so a final duration event is more likely to survive navigation.
- `/api/analytics` allow-lists event names using a Zod enum.
- MongoDB aggregation produces dashboard totals/daily/top-content data.

**Why use `sendBeacon`:** A standard fetch may be cancelled when the browser unloads the page. Beacon is specifically designed for small telemetry messages sent during unload.

**Potential issue to understand:** Analytics can be approximate. A scroll threshold is an engagement signal, not proof the user read every word. Track only useful events and be transparent about privacy requirements.

### G. Converting editorial documents into structured CMS data

**Why it was difficult:** A Word document is designed for humans, not a stable database. Manual copying of 60 myth cards is slow and can introduce transcription mistakes.

**What was implemented:** `scripts/extract_myth_handbook.py` reads the known handbook table structure, splits each card using fixed labels, normalizes text, validates that all 60 cards contain myth/reality values, and writes JSON.

**Why validation matters:** If the Word template changes, an extraction script can produce wrong mappings. The script exits with an error rather than silently emitting bad CMS content.

**Correct terminology:** This is **structured document extraction/content ingestion**, not web scraping. No website is crawled or fetched.

### H. Protecting data integrity without relational foreign keys

**Why it was difficult:** MongoDB permits flexible document shapes and does not use PostgreSQL foreign keys in this project. That creates responsibility for integrity checks in schemas and application logic.

**What was implemented:**

- Unique indexes for usernames, subscriber emails, article slugs, media IDs, game sessions, and setting keys.
- Enums for roles and publication/workflow statuses.
- Zod validation at the HTTP boundary.
- `runValidators: true` on important updates.
- Media usage check before deletion.
- Campaign state rules and last-owner protection.

**Trade-off:** MongoDB flexibility is good for editorial documents and varying game metrics. But when relationship complexity grows, relational tables and foreign keys can make data rules easier to enforce.

## 12. How APIs are called in this project

### Two meanings of API call

1. **Internal API calls:** React browser code calls this application's own Next.js endpoints under `/api`.
2. **External API calls:** Server code calls Cloudinary, Google OAuth, and Gmail APIs using `fetch`.

The important security rule is: client code can call internal endpoints, but **external secrets remain on the server**.

### Internal API calls from React

The code uses the browser's built-in `fetch` API. Examples:

```ts
// JSON request: newsletter
await fetch("/api/subscribers", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, source: "newsletter" }),
});

// FormData request: file upload. Do NOT manually set Content-Type here.
const body = new FormData();
body.set("file", file);
await fetch("/api/membership-upload", { method: "POST", body });
```

Why no `Content-Type` with `FormData`? The browser must add a multipart boundary. Manually setting only `multipart/form-data` can break the upload.

### How the server reads those requests

| Client request body | Server code |
| --- | --- |
| JSON | `await request.json()` |
| Multipart file upload | `await request.formData()` |
| URL query parameter | `request.nextUrl.searchParams.get("status")` |

Routes return JSON with `NextResponse.json()`. The client checks `response.ok` where the failure outcome matters, then calls `await response.json()` for response data/error detail.

### API call lifecycle: correspondence form

```text
1. User fills CorrespondencePage form.
2. submit() prevents normal browser form navigation.
3. It builds a JSON object from FormData.
4. fetch('/api/inquiries', POST) sends JSON.
5. Route validates using inquirySchema.
6. Route calls Inquiry.create() in MongoDB.
7. API sends HTTP 201 and inquiry ID.
8. UI reads response.ok, sets "sent" state, resets form.
9. On an error, UI sets "error" and shows a retry message.
```

### External API calls: Cloudinary

`lib/cloudinary.ts` uses server-side `fetch`:

```text
Internal /api/upload handler
  -> uploadAsset(file)
  -> build FormData with API key, timestamp, folder, server-generated signature
  -> fetch(Cloudinary upload URL, POST)
  -> parse provider JSON
  -> store returned metadata in MongoDB
```

The external response is checked using `response.ok`; provider-specific error messages are converted into application errors.

### External API calls: Gmail OAuth and Gmail send

```text
Campaign send route
  -> sendGmail(...)
  -> accessToken()
  -> POST refresh token to Google OAuth endpoint
  -> receive short-lived access token
  -> build RFC/MIME message (text + HTML)
  -> Base64URL encode raw message
  -> POST to Gmail users/me/messages/send
  -> record success/failure in Campaign document
```

The Gmail client ID, client secret, refresh token, and sender email come from environment variables, not the browser.

### API error-handling pattern to say in interview

"I use `try/catch` around external operations and explicit checks for `response.ok`. Internal routes validate input before database work and return meaningful HTTP statuses. On the client, state models distinguish loading, success, and error, so the user sees feedback instead of a silent failure."

## 13. Libraries used: what each one does and how it is called

| Library/platform | Why it is used | Example code area |
| --- | --- | --- |
| Next.js | React framework, routing, server route handlers | `app`, `app/api`, `middleware.ts` |
| React | Component rendering and UI state | client components with `useState`, `useEffect` |
| TypeScript | Static checking and safer refactoring | all `.ts` and `.tsx` files |
| Mongoose | MongoDB schemas, models, queries, aggregations | `lib/models`, `lib/db.ts` |
| NextAuth | Credentials login and JWT session handling | `lib/auth.ts`, auth route |
| bcryptjs | Secure password hashing/comparison | login and admin-user creation |
| Zod | Runtime API validation | `lib/validators`, route schemas |
| Framer Motion | UI animation and reduced-motion support | games/editorial/public components |
| Three.js | 3D rendering primitives | editorial/journey scenes |
| React Three Fiber | React renderer for Three.js scenes | `Canvas`, `useFrame` components |
| Cloudinary API | Remote image/PDF asset storage | `lib/cloudinary.ts` |
| Gmail API | Send subscriber campaigns using OAuth | `lib/gmail.ts` |
| Lucide React | Icon components | public/admin interfaces |
| Recharts | Chart components for visual data | included dependency for dashboards/charts |
| TipTap | Rich-text editing support | included dependency for content editing |
| Tailwind CSS | Utility-first styling | class names in UI components |

### How imports work

```ts
import { z } from "zod";                 // named package export
import mongoose from "mongoose";         // default package export
import { connectDB } from "@/lib/db";    // internal alias from tsconfig paths
import { Article } from "@/lib/models/Article";
```

The `@/` alias points to the project root, so imports are easier to read than long relative paths like `../../../lib/db`.

### Why use a library instead of writing it ourselves?

- Authentication and password handling are security-sensitive; use mature, reviewed libraries.
- Mongoose reduces repeated database boilerplate and provides schema/index support.
- Zod provides reliable runtime validation instead of hand-written `if` checks everywhere.
- Framer Motion and React Three Fiber provide tested abstractions for complex UI/3D behavior.
- External APIs solve specialized storage/email problems without building a file server or SMTP delivery system.

### Good interview answer

"I used libraries where they reduced risk or repetitive infrastructure, not simply to add dependencies. For example, NextAuth handles session mechanics, bcrypt handles password hashing safely, Zod validates untrusted input, and Mongoose structures MongoDB access. I kept project-specific business rules, such as campaign state and last-owner protection, in my own application code."

## 14. More important concepts and how they appear here

### RESTful API design

The project uses resource-oriented endpoints:

| Resource | Endpoint | Methods |
| --- | --- | --- |
| Articles | `/api/articles` | GET, POST, PATCH, DELETE |
| Myths | `/api/myths` | GET, POST, PATCH, DELETE |
| Subscribers | `/api/subscribers` | GET, POST, PATCH, DELETE |
| Media | `/api/media`, `/api/upload` | GET/PATCH/DELETE and POST upload |
| Games | `/api/games`, `/api/game-config` | results/statistics and configuration |
| Analytics | `/api/analytics` | POST events, GET reports |
| Campaigns | `/api/campaigns`, `/api/campaigns/send` | draft CRUD and explicit send action |

`/api/campaigns/send` is an action endpoint rather than a pure CRUD resource because sending has an operational side effect. That is a reasonable REST pragmatism.

### `POST` vs `PUT` vs `PATCH`

- `POST`: create a new record or invoke an action. Example: create an article or send a campaign batch.
- `PUT`: set/upsert a whole game configuration or setting by logical key. Example: `PUT /api/game-config`.
- `PATCH`: change selected fields on an existing record. Example: change an article status/order.

### Status lifecycle / state machine

Several documents have finite status values:

```text
Article/Myth: draft -> review -> published -> archived
Inquiry: new -> reviewing -> resolved -> archived
Subscriber: active -> unsubscribed or bounced
Campaign: draft -> sending -> sent; draft/paused can be edited
```

An enum limits allowed values. Business rules then limit allowed transitions. This project partially enforces transitions, especially campaigns. A stronger next step is a dedicated state-transition function so every allowed transition is explicit and tested.

### Idempotency

An idempotent request has the same final effect if repeated. The game-results endpoint uses client-generated UUID `sessionId` and database upsert. This is useful when a browser retries after a network problem.

### Optimistic vs pessimistic UI updates

- **Pessimistic:** wait for API success before considering the operation finished. Most admin form flows do this, then refetch data.
- **Optimistic:** update UI immediately, then send API request. Games save local results/display a result before the server persistence call completes.

The right choice depends on risk. CMS writes should confirm persistence; a game score should feel instant.

### Caching

Database connection caching is implemented. Content HTTP-response caching is not a major explicit strategy in these route handlers; several dynamic/admin endpoints set `force-dynamic`. Potential improvements include cache headers for stable public content and revalidation after publishing.

### Logging

There is minimal current logging, such as `console.error` for membership upload failures. A production application should add structured logs containing request ID, route, sanitized error code, timing, and user/action context. Never log passwords, tokens, raw secrets, or full sensitive membership documents.

### Testing

There is no visible automated test suite in the repository. A practical testing plan:

1. Unit-test Zod validators, HMAC token generation, login lockout rules, and campaign recipient selection.
2. Integration-test route handlers with a test MongoDB database.
3. End-to-end-test login, article publishing, newsletter signup, unsubscribe, membership upload, and admin authorization boundaries.
4. Test negative cases: bad file signatures, unauthorized API calls, duplicate game session ID, last-owner deletion attempt.

## 15. Difficult follow-up questions and strong answers

**Why use JWT instead of database sessions?**

"NextAuth JWT sessions let middleware verify an admin session without looking up a session record on every request. It is convenient in a Next.js deployment. The trade-off is token invalidation/revocation needs thought; for stricter immediate session revocation, database-backed sessions can be a better choice."

**How do you prevent MongoDB injection?**

"I validate expected input shapes with Zod and use Mongoose query APIs instead of accepting arbitrary query objects from the client. I would additionally sanitize filter inputs, restrict query parameters to a fixed allow-list, and avoid passing raw client objects directly into MongoDB operators."

**What happens if Cloudinary upload succeeds but MongoDB save fails?**

"The file could become orphaned in Cloudinary. The current implementation handles the normal flow but does not have a durable cross-service transaction. I would improve it with cleanup/retry logic or an outbox/job pattern that reconciles provider assets and database metadata."

**What happens if a campaign request times out halfway?**

"The campaign persists `deliveredTo`, counts, and failures after each batch. A later request excludes already attempted recipients and continues. For a larger system I would move sending to a background queue with per-recipient delivery records and idempotency keys."

**Why use MongoDB aggregation rather than JavaScript loops?**

"Grouping/filtering close to the data reduces network transfer and server memory use. MongoDB can compute count, average, min, and grouped daily analytics before returning a compact result."

**How would you migrate from MongoDB to PostgreSQL?**

"I would first identify documents with real relationships: subscribers, campaigns, deliveries, users, and analytics. I would define tables, primary/foreign keys, indexes, migrations, and repository interfaces. I would migrate data in batches, verify counts/checksums, dual-read or stage cutover, then switch writes. Article-owned arrays could become related tables or JSONB columns depending on query needs."

**How do you protect user privacy in analytics?**

"The implementation uses anonymous browser session IDs, content identifiers, and duration; it does not need account identity for public analytics. I would define retention periods, minimize collected fields, publish a privacy notice, and obtain consent where legally required."

## 16. Final interview script

Use this when asked to explain the project end to end:

"Paper Foundation India is a full-stack educational and CMS platform. The public side provides articles, myths, resources, interactive data experiences, and games. The admin side lets a small team manage content, media, subscribers, campaigns, analytics, and users.

I built it with Next.js and React, using Next.js route handlers as the backend rather than a separate Express server. Client components call same-origin REST-style endpoints with fetch. Each protected route checks authentication and authorization, validates input with Zod, then uses Mongoose to read or write MongoDB. The database connection is cached for efficient reuse. I use MongoDB because the content is document-shaped, while I understand PostgreSQL would be preferable for deeply relational workflows and transactional reporting.

For security, administrator passwords are bcrypt hashes, NextAuth creates JWT sessions, middleware protects admin pages, API routes enforce access again, and owner-only checks protect account management. Files go through validated server endpoints to Cloudinary, and MongoDB stores their metadata. Gmail OAuth handles campaign sending in batches with unsubscribe links and delivery tracking.

The hardest parts were balancing a public fallback content experience with truthful CMS writes, building anonymous but idempotent game score tracking, handling secure file uploads, and making email sending resumable. My next improvements would be granular RBAC, rate limiting, background jobs, automated tests, structured logging, and stronger cross-service consistency handling."
