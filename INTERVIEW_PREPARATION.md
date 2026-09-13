# Paper Foundation India: Interview Preparation Guide

## How to use this guide

This guide is based on the code in this repository. Learn the **simple explanation** first, then use the technical detail to answer follow-up questions. Do not claim that the project uses Express or PostgreSQL: it currently uses **Next.js route handlers** and **MongoDB with Mongoose**. The Express and PostgreSQL sections explain how to discuss those interview topics honestly and how they would map to this project.

## 1. Project understanding

### One-minute project explanation

**Simple version:** Paper Foundation India is an educational website about paper, recycling, sustainability, and India's paper ecosystem. Visitors can read articles, explore facts and myths, use learning tools, play educational games, subscribe to updates, and contact the organisation. Administrators get a secure dashboard to manage the content, users, media, campaigns, and analytics.

**Technical version:** It is a full-stack Next.js 15 application built with React 19 and TypeScript. Public pages are rendered from a combination of local editorial content and MongoDB-backed CMS data. Client components call REST-style Next.js route handlers under `app/api`. Mongoose handles MongoDB persistence; NextAuth credentials authentication protects the admin area; Cloudinary stores uploaded media; Gmail OAuth sends subscriber campaigns.

### Problem statement and users

The product solves a communication problem: reliable information about paper, fibre, recycling, forestry, and Indian industry is fragmented and often oversimplified. It creates an approachable public learning experience while allowing a small editorial team to operate the content without editing source code.

| User | Need | Project feature |
| --- | --- | --- |
| Public reader/student | Learn credible information quickly | Articles, glossary, myths, resources, India data pages |
| Educator/partner | Find material and contact the foundation | Resources, membership/join form, correspondence form |
| Game player | Learn through interaction | Five browser games and score tracking |
| Editor | Publish and revise content | Admin CMS for articles, myths, glossary, resources, games, settings |
| Analyst | Understand usage | Event tracking, game statistics, dashboard aggregations |
| Owner | Manage access and operations | Admin user management and system-status page |

### Major modules

1. **Public content experience:** Home, knowledge library, article pages, myths, glossary, resources, circularity, India data and map pages.
2. **Educational games:** Grow or Shred, Truth Press, Mill Master, Hidden Paper, and Paper Word Search.
3. **Correspondence and membership:** Contact/report/join submissions; membership PDF upload.
4. **Newsletter and campaigns:** Public subscriber signup, one-click unsubscribe, admin campaign drafting/testing/sending.
5. **Admin CMS:** CRUD for articles, myths, glossary entries, resources, game configuration, media, website settings, and administrators.
6. **Analytics:** Browser events, article completion measurement, dashboard statistics, and game-result aggregation.
7. **Media:** Cloudinary upload plus a MongoDB media catalog and usage protection before deletion.

### Important business rules

- Public readers can view only published CMS content. Admin users can request `status=all` or non-published content.
- If `MONGODB_URI` is absent, public content endpoints return local editorial manifests so the site remains useful; CMS writes return `503 Service Unavailable`.
- Admins must authenticate; only an `owner` can create, change, disable, or delete admin accounts.
- Password failures are counted. After five failures, an account is locked for 15 minutes.
- The last active owner cannot be demoted or deleted, and an owner cannot disable or delete their own account.
- A game result is idempotent by `sessionId`: submitting the same result twice does not create duplicate records.
- Subscriber email is unique and is normalized to lowercase. Re-subscribing uses an upsert rather than adding a duplicate.
- Campaigns can be edited only in `draft` or `paused`; sends operate in batches of 25 and record successes/failures.
- An uploaded media record cannot be deleted while its `usage` array says content still references it.

## 2. Architecture

### Overall architecture

```text
Browser / React client components
        |
        | fetch JSON or FormData
        v
Next.js App Router
  public pages + app/api route handlers + middleware
        |
        +-------------------+--------------------+
        |                   |                    |
        v                   v                    v
 MongoDB/Mongoose      Cloudinary           Gmail API OAuth
 CMS/content data      media/PDF assets     subscriber campaigns
        |
        v
 Admin dashboard and public UI responses
```

This is a **monolithic full-stack web application**: the React frontend and HTTP API are deployed together in Next.js. There is no separate Express server or separate backend repository.

### Folder map

| Location | Responsibility |
| --- | --- |
| `app/(site)` | Public pages and page-specific sections; parentheses create a route group without adding `/site` to URLs |
| `app/admin` | Admin pages and admin-only layout |
| `app/api` | Route handlers: the backend HTTP endpoints |
| `components/site`, `components/home`, `components/editorial` | Reusable public UI and interactive content experiences |
| `components/admin` | Dashboard UI, managers, forms and tables |
| `components/games` | Game shells, configuration loading, local score history, game implementations |
| `components/ui`, `components/paper-ui` | Small reusable primitives and visual effects |
| `lib` | Cross-cutting server code: database, auth, API authorization, Gmail, Cloudinary, validation |
| `lib/models` | Mongoose schemas/models |
| `lib/validators` | Zod request validation schemas |
| `content` | Local editorial fallback data, Markdown articles, JSON seed data |
| `scripts/seed.ts` | Database seeding utility |

### Frontend architecture

Next.js Server Components are the default. Files that need browser APIs, state, event handlers, animations, `localStorage`, or `fetch` after page load use the `'use client'` directive. Examples:

- `components/site/NewsletterSignup.tsx` uses controlled form state with `useState`.
- `components/site/SiteAnalytics.tsx` uses `useEffect`, `usePathname`, `sessionStorage`, scrolling, and `sendBeacon`.
- `components/games/GameShared.tsx` stores local game progress and sends results asynchronously.
- Admin managers such as `components/admin/ArticleManager.tsx` load and mutate CMS records through `fetch`.

Styling is intentionally mixed: Tailwind utility classes for fast responsive UI, CSS Modules for component-scoped complex styles, and global/editorial CSS for visual experiences. Framer Motion supplies animation; Three.js/React Three Fiber supply the interactive 3D scenes.

### Backend architecture

**Simple version:** A request goes to a file in `app/api`, which checks the request, talks to MongoDB or an external service, and returns JSON.

**Technical version:** Next.js Route Handlers export functions such as `GET`, `POST`, `PATCH`, `PUT`, and `DELETE`. They use `NextRequest` to read query parameters, JSON, or multipart `FormData`, and `NextResponse.json()` to return an HTTP response. The repository does not use separate controller/service/repository folders; the route handler plays the controller role, while reusable infrastructure is extracted to `lib`.

```text
Route Handler (controller-like)
  -> requireAdmin() where needed
  -> Zod safeParse() where defined
  -> connectDB()
  -> Mongoose Model operation or external integration
  -> NextResponse.json(data, status)
```

Examples: `app/api/articles/route.ts`, `app/api/games/route.ts`, and `app/api/campaigns/send/route.ts`.

### Authentication and authorization architecture

```text
Admin submits username + password
  -> NextAuth CredentialsProvider
  -> Zod validates input
  -> MongoDB finds AdminUser with passwordHash selected
  -> bcrypt.compare(password, hash)
  -> JWT session contains adminId and role
  -> middleware.ts protects /admin/*
  -> requireEditor() protects API mutations
  -> ownerSession() additionally protects /api/admin/users
```

`middleware.ts` runs before admin routes. It redirects unauthenticated users to `/admin/login`. The API has a second protection layer: `requireAdmin()` protects authenticated reads, while `requireEditor()` blocks analyst accounts from mutations. Both use `currentAdmin()`, which re-checks the active account and current role in MongoDB. This is important because UI route protection alone is insufficient; somebody could call an API endpoint directly.

Roles are `owner`, `editor`, and `analyst`. Owners manage users and all CMS modules, editors manage content and operations, and analysts have read-only access. A next improvement would be granular permission scopes within those roles for larger teams.

### Request-response lifecycle: article list example

```text
KnowledgeExperience client component
  -> GET /api/articles?status=published
  -> articles route handler
  -> if no MongoDB: return content/articleCatalog fallback
     else connectDB -> Article.find({ status: "published" }).sort(...).lean()
  -> JSON { items, source: "cms" | "editorial-manifest" }
  -> React stores items in state and renders cards
```

`lean()` returns plain JavaScript objects instead of full Mongoose document instances. That is efficient for read-only API responses.

## 3. Database design: what the project actually uses

### MongoDB collections

MongoDB does not have SQL tables or foreign keys. It stores JSON-like documents in collections. Mongoose models define document shape, required fields, defaults, enums, and indexes.

| Collection/model | Key fields and purpose |
| --- | --- |
| `admin_users` / `AdminUser` | username (unique), password hash, role, active status, lockout metadata |
| `articles` / `Article` | title, unique slug, category, body, sources array, status, feature/order metadata |
| `myths` / `Myth` | claim, verdict, correction, sources, category, status, editorial metadata |
| `resources` / `Resource` | resource metadata and public URL |
| `glossaries` / `Glossary` | unique term, definition, letter, publication status |
| `subscribers` / `Subscriber` | unique email, status, tags, subscription timestamps |
| `inquiries` / `Inquiry` | public correspondence, attachment metadata, workflow status, internal notes |
| `media` / `Media` | Cloudinary identifiers/URLs, metadata, tags, content usage records |
| `campaigns` / `Campaign` | email content, recipient filter, delivery counts/failures, lifecycle status |
| `gameconfigs` / `GameConfig` | per-game editable presentation/content settings and revisions |
| `gameresults` / `GameResult` | unique client session ID, score, duration, metrics |
| `analytics` / `Analytics` | event name, path, optional content identity, duration, session identity |
| `sitesettings` / `SiteSetting` | key-value settings, including `public.*` settings exposed to the site |

### Relationships

The project mostly uses **embedding and logical references**, which is normal in MongoDB:

```text
Article -- embeds --> sources[], tags[], media[]
Campaign -- logically targets --> Subscriber documents by status/tag
Media.usage[] -- logically references --> a content type + content ID
Analytics.contentId -- logically references --> an article, myth, or game
GameResult.gameId -- logically references --> gameCatalog/GameConfig.gameId
```

There are no Mongoose `populate()` relationships or database-enforced foreign keys in the code. This is a design trade-off: embedded arrays make a single content record easy to read, while logical references require the application to preserve integrity. The media deletion check is an example of application-level integrity enforcement.

### Indexes and why they matter

The schemas index common lookup/filter fields: article `slug`, category/status/order; subscriber email/status; analytics event/path/time; game `sessionId` and `gameId`; and admin username/role/active state. Indexes speed reads but make writes slightly more expensive because the index must also be maintained.

The compound Analytics index on `(event, contentType, contentId, occurredAt desc)` supports event/content/time analysis. The dashboard also uses aggregation pipelines to group data by status, content, day, and game.

### MongoDB operations in the project

- Create: `Article.create(parsed.data)`, `Inquiry.create(parsed.data)`, `Analytics.create(...)`.
- Read: `find()`, `findById()`, `findOne()`, `countDocuments()`, `aggregate()`.
- Update: `findByIdAndUpdate(..., { new: true, runValidators: true })`; `findOneAndUpdate(..., { upsert: true })`.
- Delete: `findByIdAndDelete()` or `deleteOne()` after safety checks.
- Aggregation: `GameResult.aggregate()` calculates plays, average score percentage, and fastest time; `Analytics.aggregate()` creates daily and top-content dashboard summaries.

### Connection pooling

`lib/db.ts` caches a Mongoose connection in `global.mongooseConnection`. In Next.js development and serverless-like execution, modules can reload or handlers can run repeatedly; caching prevents opening a new connection on every request. The connection settings include a maximum pool size of 10 and timeouts.

## 4. PostgreSQL and SQL: interview-ready mapping

### Honest project answer

"This project currently uses MongoDB because much of its content is document-shaped: articles have arrays of sources, tags, and media; game configuration and event metadata can vary. For a PostgreSQL interview, I can map the same domain to a normalized relational design. I would choose PostgreSQL if reporting, joins, strict relationships, and multi-record transactional consistency became more central."

### Conceptual PostgreSQL schema (not current production code)

```text
admin_users(id PK, username UNIQUE, password_hash, role, active, ...)
articles(id PK, slug UNIQUE, category_id FK, title, body, status, ...)
article_sources(id PK, article_id FK -> articles.id, label, url)
article_tags(article_id FK, tag_id FK, PRIMARY KEY(article_id, tag_id))
tags(id PK, name UNIQUE)
subscribers(id PK, email UNIQUE, status, subscribed_at, ...)
campaigns(id PK, name, subject, body, status, ...)
campaign_deliveries(id PK, campaign_id FK, subscriber_id FK, status, error, ...)
inquiries(id PK, name, email, type, status, ...)
analytics_events(id PK, event, path, content_type, content_id, occurred_at, ...)
game_results(id PK, session_id UUID UNIQUE, game_id, score, out_of, ...)
media(id PK, cloudinary_public_id UNIQUE, secure_url, ...)
```

### SQL examples you can explain

```sql
-- Read published articles in a category
SELECT id, title, slug, excerpt, published_at
FROM articles
WHERE status = 'published' AND category_id = $1
ORDER BY display_order, featured DESC, published_at DESC;

-- JOIN articles with their sources
SELECT a.title, s.label, s.url
FROM articles a
LEFT JOIN article_sources s ON s.article_id = a.id
WHERE a.slug = $1;

-- Daily analytics count
SELECT occurred_at::date AS day,
       COUNT(*) FILTER (WHERE event = 'page_view') AS views,
       COUNT(*) FILTER (WHERE event <> 'page_view') AS interactions
FROM analytics_events
WHERE occurred_at >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;
```

### PostgreSQL essentials

- A **primary key** uniquely identifies a row. A **foreign key** ensures a child row refers to a valid parent.
- A **JOIN** combines related tables. Use `INNER JOIN` when a matching child is required and `LEFT JOIN` when the parent should remain even without a child.
- **Normalization** reduces duplicate data: campaign deliveries should be separate from campaigns/subscribers instead of duplicating all email details in one row.
- **Constraints** enforce rules close to the data: `NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`.
- A **transaction** groups related statements: either all succeed or all roll back. ACID means atomicity, consistency, isolation, durability.
- Use parameterized queries (`$1`, `$2`) to prevent SQL injection; never build SQL by concatenating user input.
- Node commonly uses `pg` and a `Pool`. Acquire a client for a multi-query transaction, then `BEGIN`, queries, `COMMIT` or `ROLLBACK`, and release it in `finally`.

### MongoDB versus PostgreSQL

| Topic | MongoDB | PostgreSQL |
| --- | --- | --- |
| Data model | Flexible documents | Structured rows/tables |
| Relationships | Embed or reference in application | Foreign keys and joins |
| Schema | Flexible but Mongoose can validate | Strong database-enforced schema |
| Best fit | Variable content documents, JSON-like metadata | Financial data, complex reporting, strict relational integrity |
| Transactions | Supported, but not central in this codebase | Mature, common for multi-table workflows |
| Project fit | Good for articles, media metadata, varied game metrics | Strong alternative for subscribers/campaign deliveries/reporting |

## 5. Major feature implementation flows

### A. Public articles and knowledge library

**Files:** `components/editorial/KnowledgeExperience.tsx`, `app/(site)/knowledge/page.tsx`, `app/api/articles/route.ts`, `lib/models/Article.ts`, `lib/validators/article.ts`, `content/articleCatalog.ts`.

1. The public knowledge UI mounts a client component and requests `GET /api/articles?status=published`.
2. The route returns local `articleCatalog` data if MongoDB is unavailable. Otherwise it connects through `connectDB()` and queries `Article` with filters/sorting.
3. The client receives `{ items, source }`, saves items in React state, and displays filters/cards.
4. Admin article screens use `ArticleManager` and `ArticleEditor` to create or edit items with `POST` or `PATCH`.
5. The API checks `requireAdmin()`, validates with Zod, writes through Mongoose, and returns the record or a meaningful HTTP error.

Interview point: the fallback separates public availability from editorial infrastructure. It is useful during local design work or a temporary database outage, but production should still monitor the database instead of silently relying on fallback data forever.

### B. Myths, glossary, and resources CMS

**Files:** `components/editorial/MythsExperience.tsx`, `app/(site)/glossary/sections/GlossaryTermList.tsx`, `app/(site)/resources/sections/ResourceGrid.tsx`, `app/api/myths/route.ts`, `app/api/glossary/route.ts`, `app/api/resources/route.ts`, related models.

The pattern is deliberately consistent: public `GET` defaults to published data; local editorial data is used if MongoDB is not configured; authenticated admins use `POST`, `PATCH`, and `DELETE`. Mongoose sorting uses human-controlled `order` so editors can influence display sequence. The admin manager components refetch after mutations to keep the UI aligned with persisted data.

### C. Newsletter subscription and unsubscribe

**Files:** `components/site/NewsletterSignup.tsx`, `app/api/subscribers/route.ts`, `lib/models/Subscriber.ts`, `components/site/UnsubscribePanel.tsx`, `app/api/unsubscribe/route.ts`, `lib/gmail.ts`.

```text
Email field -> POST /api/subscribers -> Zod email validation
-> Subscriber.findOneAndUpdate(email, { status: active }, { upsert: true })
-> 201 JSON -> success UI

Campaign email -> HMAC unsubscribe token + email in URL
-> unsubscribe page -> POST /api/unsubscribe
-> timing-safe token comparison -> subscriber status = unsubscribed
```

`findOneAndUpdate` with `upsert: true` is important: it updates an existing subscriber or creates a new one atomically, avoiding basic duplicate-subscription races. The unsubscribe endpoint uses an HMAC based on `NEXTAUTH_SECRET` and `crypto.timingSafeEqual` to reduce timing-attack risk during comparison.

### D. Correspondence and membership applications

**Files:** `components/site/CorrespondencePage.tsx`, `components/site/ContactForm.tsx`, `components/home/sections/initiative-form/InitiativeForm.tsx`, `app/api/inquiries/route.ts`, `app/api/membership-upload/route.ts`, `lib/validators/inquiry.ts`, `lib/models/Inquiry.ts`.

The contact/join UI collects form data. The API validates correspondence with Zod, creates an `Inquiry` document, and returns `201` with its ID. Admins can view and update its status/notes through authenticated `GET` and `PATCH` routes.

Membership submission first posts a PDF as `FormData`. The endpoint verifies there is a file, checks the 8 MB limit, MIME type and `.pdf` extension, then reads the first five bytes to check `%PDF-`. It uploads the file to Cloudinary and returns metadata. The form then associates the returned URL/name with an inquiry. This is a good interview example of validating files on the server, not merely trusting browser validation.

### E. Games, local progress, and persistence

**Files:** `components/games/GameHub.tsx`, `components/games/GameShared.tsx`, individual game components, `app/api/game-config/route.ts`, `app/api/games/route.ts`, `lib/models/Game.ts`, `lib/models/GameConfig.ts`.

1. Game pages render a game-specific React component inside `GameFrame`.
2. `useGameConfiguration(gameId)` requests public configuration to allow the CMS to change text, order, enablement, and some game content.
3. When a game ends, `ResultPanel` calculates percentage, saves best score/history to browser `localStorage`, creates a UUID session ID, and posts the result to `/api/games` without blocking the UI.
4. The route validates score, maximum, duration, UUID, and allowed game ID with Zod. It upserts using `sessionId` to make retries safe.
5. Admin `GET /api/games` runs a MongoDB aggregation to calculate plays, average percent, and fastest time.

The project intentionally needs no player login. Local storage gives a quick personal-progress experience; the server stores anonymous aggregate results.

### F. Analytics and dashboard

**Files:** `components/site/SiteAnalytics.tsx`, `app/api/analytics/route.ts`, `lib/models/Analytics.ts`, `app/api/admin/overview/route.ts`, `components/admin/AdminDashboard.tsx`, `components/admin/AdminAnalytics.tsx`.

The analytics client creates a session UUID in `sessionStorage`, posts page/article/game events, detects article completion after 82% scroll, and sends a final beacon on pagehide. The API validates an allow-list of event names with Zod before inserting documents. Admin-only aggregation pipelines then calculate daily views/interactions, top content, article completion metrics, and game performance.

Why `sendBeacon`? Normal fetch requests can be cancelled as a page unloads. Beacon is designed for small, non-blocking telemetry payloads.

### G. Media library

**Files:** `components/admin/AdminMedia.tsx`, `app/api/upload/route.ts`, `app/api/media/route.ts`, `lib/cloudinary.ts`, `lib/models/Media.ts`.

An authenticated admin sends multipart `FormData`. The server checks configuration and a 20 MB limit, generates a signed Cloudinary upload request using server-only credentials, then upserts metadata in MongoDB. The media listing supports basic search by filename, alt text, or tags. On deletion, it blocks removal when `usage` is non-empty; otherwise it deletes from Cloudinary first and MongoDB second.

### H. Campaign sending

**Files:** `components/admin/AdminCampaigns.tsx`, `app/api/campaigns/route.ts`, `app/api/campaigns/send/route.ts`, `lib/gmail.ts`, `lib/models/Campaign.ts`, `lib/models/Subscriber.ts`.

Admins draft campaigns in MongoDB. Sending requires an authenticated admin, Gmail configuration, and a campaign ID. A test path emails a supplied address. The real path selects active subscribers, optionally by tag, excluding already attempted recipients. It processes 25 recipients at a time, writes successes/failures to the campaign document, and sets status to `sent` only after all recipients are handled. The delivery log makes retries and admin visibility possible.

### I. Admin accounts and RBAC

**Files:** `lib/auth.ts`, `middleware.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/api/admin/users/route.ts`, `lib/models/AdminUser.ts`.

Credentials are validated by Zod and compared to a bcrypt hash. The NextAuth JWT callback stores the user ID and role; the session callback exposes them to server-side authorization. The owner-only user endpoint hashes newly created passwords with bcrypt cost factor 12 and protects the last remaining owner.

## 6. Frontend concepts used in the project

- **Components and props:** Reusable components receive inputs such as `gameId`, `title`, `children`, or `variant`. `GameFrame` is a strong composition example: it provides common game layout and accepts individual game UI as `children`.
- **State:** `useState` stores form fields, request status, fetched records, editing state, and game progress. State changes trigger React rerenders.
- **Effects:** `useEffect` handles browser-side fetches, event listeners, configuration loading, analytics, and local-storage work. Cleanup functions remove listeners.
- **Controlled forms:** Inputs use `value` plus `onChange`. The submit handler calls `preventDefault()`, sets loading state, calls `fetch`, and updates success/error state.
- **Routing:** File-system routes come from `app`. Dynamic segments such as `knowledge/[slug]` represent a parameterized URL. `next/link` gives client-side navigation.
- **Protected UI:** `middleware.ts` protects `/admin/:path*`; server/API authorization still checks sessions to secure data.
- **Client storage:** Games use `localStorage` for persistent browser score history; analytics uses `sessionStorage` for a browser-session UUID.
- **Loading/error:** Forms commonly represent `idle`, `loading/sending`, `success/sent`, and `error` states. API code returns correct HTTP status codes for the UI to inspect.
- **JavaScript details:** `async/await`, object spread (`{ ...form, field: value }`), array mapping/filtering/sorting, optional chaining, destructuring, promises with `Promise.all`, and event handling are used heavily.

## 7. Backend, Node.js, and Express interview mapping

### What Node.js contributes here

Node.js runs JavaScript on the server. It is well suited to this app because most work is I/O: database calls, Cloudinary/Gmail HTTP calls, and returning JSON. `await` pauses only the current async function; it does not block the entire Node process while an I/O operation is pending.

### Event loop answer

JavaScript executes application code on one main thread. Network/database operations are delegated by the runtime; when they finish, their callbacks/promises are queued and the event loop continues them. Avoid CPU-heavy work in a route handler because it can delay other requests. In this project, database/network work is asynchronous; expensive reporting is done by MongoDB aggregation rather than manual JavaScript loops.

### Express versus this project

Express is **not used**. Its conceptual equivalent looks like this:

```ts
// Express equivalent, not repository code
router.post('/articles', requireAdmin, validate(articleSchema), createArticle);
```

In this project the equivalent is a `POST` export in `app/api/articles/route.ts`. `requireAdmin()` is analogous to Express middleware, Zod validation is performed in the route, and `Article.create()` is the persistence call. If asked why Next route handlers: they reduce infrastructure and let frontend and backend share TypeScript types, routing, build tooling, and deployment.

### REST and HTTP status codes used

- `GET`: retrieve a resource/list.
- `POST`: create a resource or perform an action such as send a campaign.
- `PATCH`: partially update a record.
- `PUT`: replace/upsert a game configuration or setting.
- `DELETE`: remove a record.
- `200`: successful read/update; `201`: created; `202`: accepted but not persisted in fallback mode; `400`: invalid request; `401`: not authenticated; `403`: authenticated but not owner; `404`: missing resource; `409`: conflict/business-rule violation; `413`: file too large; `502`: Cloudinary/Gmail upstream failure; `503`: missing dependency/configuration.

## 8. Security, validation, and reliability

### What is implemented

- Password hashes, never plain passwords, via bcrypt.
- Credentials and data shapes validated with Zod.
- JWT-based NextAuth sessions plus middleware and API authorization.
- Environment secrets accessed only on the server: Mongo URI, NextAuth secret, Cloudinary secret, Gmail OAuth credentials.
- Cloudinary uploads are signed on the server.
- Unsubscribe tokens use HMAC and timing-safe comparison.
- File type, size, extension, and PDF signature validation for membership uploads.
- Unique indexes for usernames, article slugs, subscriber emails, media public IDs, game sessions, and settings keys.
- `runValidators: true` on many update paths.
- No database credentials are sent to client components.

### Important limitations to mention proactively

The code is a solid portfolio foundation, but production hardening should add rate limiting to login, public forms, analytics, and uploads; centralized structured logging/error monitoring; CSRF review for credential/session flows; stronger upload content scanning; pagination for growing admin collections; and granular RBAC permissions. CORS is not explicitly configured because same-origin browser calls target the Next.js app; a separate frontend/API deployment would need a restrictive CORS policy.

## 9. Complete end-to-end workflows to rehearse

### Admin login

```text
1. User opens /admin -> middleware checks JWT.
2. If absent, redirect to /admin/login.
3. Login form calls NextAuth credentials endpoint.
4. auth.ts validates username/password, connects to MongoDB, checks lock state.
5. bcrypt.compare verifies the password hash.
6. NextAuth creates an 8-hour JWT session with admin ID and role.
7. Redirected admin can load protected dashboard/API routes.
```

### Publish an article

```text
1. Editor opens ArticleManager and loads /api/articles?status=all.
2. Editor fills ArticleEditor and clicks save.
3. Client POSTs or PATCHes JSON to /api/articles.
4. Route checks NextAuth session with requireAdmin().
5. Zod validates fields; Mongoose creates/updates Article.
6. JSON item returns; manager reloads list and UI shows confirmation.
7. Public library later requests published articles and renders it when status is published.
```

### Anonymous game completion

```text
1. Player completes game interactions in React state.
2. ResultPanel computes score, saves browser best/history.
3. It creates crypto.randomUUID() sessionId and POSTs /api/games.
4. API validates score/outOf/duration/gameId/session UUID.
5. Mongoose upserts GameResult keyed by sessionId.
6. Response is accepted; UI already shows the result immediately.
7. Admin dashboard uses aggregation to see total plays and average score.
```

### Campaign send

```text
1. Admin creates a draft campaign.
2. Admin optionally sends a test email.
3. Send endpoint fetches active subscribers, filtered by tag, excluding delivered addresses.
4. It sends a batch of 25 using Gmail OAuth access token refresh.
5. Campaign document records delivered addresses, sent/failed counts and errors.
6. Client receives progress; repeated requests continue remaining recipients.
7. Email's unsubscribe link uses HMAC validation before changing subscriber status.
```

## 10. Interview questions with concise answers

### Project and architecture

**Why did you use Next.js instead of a separate React + Express application?**  Next.js gave this content-focused project file-based routing, SEO-friendly page rendering, React UI, and server endpoints in one TypeScript deployment. Route handlers cover the API needs without operating a separate Express service. If independent scaling or multiple client applications became necessary, I could extract the API into Express/NestJS.

**Why MongoDB?**  The core CMS records are naturally document-shaped and contain variable arrays/metadata, such as article sources/tags/media and game metrics. Mongoose adds structure and validation. I would consider PostgreSQL for stricter relational reporting, campaign-delivery relations, and transactions.

**How does the app remain available if MongoDB is unavailable?**  Public content endpoints use committed editorial manifests as a read fallback. Admin writes fail explicitly with `503`, which prevents pretending changes were saved.

**Where are controllers and services?**  The code uses a lightweight Next.js architecture. Route handlers act as controllers; `lib/auth.ts`, `lib/db.ts`, `lib/gmail.ts`, and `lib/cloudinary.ts` act as reusable services; Mongoose models are the data-access layer. A larger codebase could split each route into controller/service/repository modules.

### React and JavaScript

**What is the difference between props and state?** Props are inputs from a parent and should not be mutated by the child. State belongs to a component and changes over time, such as form input or loading status.

**Why use `useEffect`?** For side effects outside rendering: fetching CMS data, registering scroll listeners, and writing to browser storage. The analytics effect cleans up listeners when route changes.

**Why not store all state globally?** Most state is local to one component or feature. Keeping it local reduces complexity. A global store is useful only for genuinely shared client state such as a complex authenticated user/session cache across many unrelated components.

**What is a controlled form?** React state is the source of truth for each input. This enables validation, reset, disabled submit states, and predictable submissions.

### Node/API/security

**Authentication versus authorization?** Authentication proves who the user is; NextAuth verifies credentials and creates a JWT session. Authorization decides what they may do; middleware and `requireAdmin()` protect admin content, and `ownerSession()` protects user management.

**Why bcrypt?** It is deliberately slow and salted, making stolen password hashes harder to crack than plain hashing algorithms. The project hashes with cost 12.

**Why validate on server if the browser already marks fields required?** Client validation is for user experience and can be bypassed. Server validation protects the database and every API consumer.

**Why use `Promise.all`?** Independent operations such as campaign/subscriber loads or dashboard aggregates can run concurrently, reducing total wait time. Do not use it when later work depends on earlier work.

**What is idempotency?** Repeating a request has the same final effect. Game-result upsert by unique session ID prevents a browser retry from creating duplicate scores.

### PostgreSQL/MongoDB questions

**When would you choose PostgreSQL over MongoDB here?** If subscription campaign reporting needed guaranteed referential integrity across deliveries, analytics needed complex cross-entity SQL reporting, or several records had to update atomically. PostgreSQL foreign keys and transactions are especially valuable then.

**What is an index?** A data structure that speeds lookups/sorts on selected columns or document fields. The trade-off is additional storage and slower writes.

**What is normalization?** Designing relational tables to reduce duplicated facts and update anomalies. For example, subscribers and campaign deliveries would be separate tables linked by IDs.

**What is a MongoDB aggregation pipeline?** A sequence of database stages such as `$match`, `$group`, `$sort`, and `$project`. The project uses it for game and analytics dashboard summaries.

## 11. Improvements and challenges

### Strong improvement answers

1. Add a shared API error wrapper and structured logs with request IDs; send errors to monitoring.
2. Add rate limiting/CAPTCHA to public forms, login, analytics, and upload endpoints.
3. Add pagination, cursor-based pagination for analytics, and text indexes/search for large content libraries.
4. Add a role-permission matrix so analysts are read-only and editors cannot manage users/settings.
5. Move large campaign sending to a background queue (BullMQ/SQS) with retries, provider rate limits, and delivery webhooks.
6. Use transactions where multi-record consistency matters, especially if campaign deliveries are normalized in PostgreSQL.
7. Add automated unit tests for validators/services, integration tests for API routes, and Playwright tests for login, publishing, signup, upload, and unsubscribe flows.
8. Add database backup/restore testing, CI lint/typecheck/test/build gates, and environment-specific secret management.

### Common challenge story

"A core challenge was making the public site useful before the CMS was configured. I separated editorial fallback content from MongoDB CMS content. Public GET endpoints can return a consistent fallback shape, while protected writes fail clearly with 503. That improved the development experience without making a false claim that a CMS update was saved. The trade-off is that operational monitoring is still required in production."

## 12. Final revision cheat sheet

### Most important facts

- Project: Paper Foundation India, public education + editorial CMS + games + admin operations.
- Actual stack: Next.js 15, React 19, TypeScript, Tailwind/CSS Modules, MongoDB/Mongoose, NextAuth, Zod, bcrypt, Cloudinary, Gmail API, Framer Motion, Three.js.
- Not actual stack: Express and PostgreSQL. Discuss them as interview knowledge and potential alternative architecture.
- Backend entry points: `app/api/**/route.ts`.
- Database connection: `lib/db.ts`; models: `lib/models/*.ts`.
- Authentication: `lib/auth.ts`, `middleware.ts`, NextAuth credentials, JWT strategy.
- Authorization: `requireAdmin()` for admin API operations; `ownerSession()` for user administration.
- Public resilience: local content fallback when MongoDB is absent.
- Analytics: client event capture -> `/api/analytics` -> Mongo aggregation -> admin dashboard.
- Game persistence: anonymous UUID session + Mongo upsert, with localStorage for user-visible local history.

### Definitions to memorize

| Term | Short definition |
| --- | --- |
| REST API | HTTP endpoints organized around resources/actions using methods such as GET, POST, PATCH, DELETE |
| JWT | Signed token containing session claims; this project stores admin ID and role in it |
| Middleware | Code that runs before a route handler; here it redirects unauthenticated admin requests |
| Mongoose | ODM that maps MongoDB documents to validated JavaScript/TypeScript models |
| Upsert | Update if found, otherwise insert |
| RBAC | Role-based access control: permissions based on roles such as owner/editor/analyst |
| SQL JOIN | Combines related rows from tables |
| ACID | Transaction guarantees: atomicity, consistency, isolation, durability |
| CORS | Browser rule controlling which origins may call an API |

### Best final project talking points

1. I built a full-stack content platform, not just static pages.
2. I designed public and admin paths differently: public readers see published content; editors manage lifecycle states.
3. I used server-side validation, auth, indexes, unique constraints, and explicit HTTP errors to protect data.
4. I used local editorial fallback data so public learning pages can still render without a configured CMS database.
5. I used aggregation rather than loading every analytics/game row into JavaScript for dashboard calculations.
6. I understand the trade-off: MongoDB fit flexible content, while PostgreSQL would be stronger for normalized relational workflows and complex transactional reporting.

### Last-minute interview checklist

- Explain the project in 60 seconds without listing every library.
- Draw the browser -> route handler -> MongoDB/external service -> JSON -> React flow.
- Explain one CRUD flow, one authentication flow, one game flow, and one campaign flow.
- State clearly that Next.js route handlers replace Express in this codebase.
- State clearly that MongoDB is used today; describe PostgreSQL as a legitimate alternative with an example schema and JOIN.
- Mention one completed trade-off and two realistic next improvements.
