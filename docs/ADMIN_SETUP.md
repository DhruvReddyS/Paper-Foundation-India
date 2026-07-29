# Admin setup

## Storage

MongoDB Atlas is the source of truth for articles, myths and facts, game configuration, glossary entries, resources, correspondence, subscribers, settings, media metadata and interaction events.

Cloudinary stores the actual images, PDFs and other uploaded files. MongoDB stores each asset URL, public ID, dimensions, type, alternative text, tags and usage references. This keeps application deployments stateless and makes asset replacement and delivery easier to maintain.

## Login

The admin uses Google OAuth through NextAuth. Only email addresses in `ADMIN_EMAILS` are accepted.

1. Create a Google OAuth web application.
2. Add `http://localhost:3000/api/auth/callback/google` as a local authorized redirect URI.
3. Add `https://your-domain.com/api/auth/callback/google` as the production redirect URI.
4. Copy `.env.example` to `.env.local`.
5. Add the Google client ID and secret.
6. Add one or more approved email addresses to `ADMIN_EMAILS`, separated by commas.
7. Generate a strong `NEXTAUTH_SECRET`.

The middleware protects every `/admin` page. Every private read and every database mutation also checks the server session. Hiding the dashboard alone is not treated as security.

## Required environment variables

```text
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAILS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_SENDER_EMAIL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
```

For production, set `NEXTAUTH_URL` to the public HTTPS origin.

## Admin workflow

The dashboard provides:

* Article drafts, publishing states, featured placement, cover media, reading time, revision notes and manual display order
* Myth and fact records with sources, categories, publishing states, media and manual order
* Full game copy, rules, content data, visibility and display order for all five games
* Game plays, average scores, completion timing, article opens, completions, average engagement and most read content
* Cloudinary uploads with searchable metadata and guarded deletion
* Glossary, resources, inquiries, subscribers and site settings
* Local editor draft recovery, unsaved page warnings, search and keyboard navigation
* Official Gmail subscriber campaigns with test sends, tag-based audiences, delivery tracking and unsubscribe handling
* Global website identity, navigation, footer copy and homepage order or visibility controls

## Official Gmail sending

Enable the Gmail API in the same Google Cloud project or a dedicated project. Authorize the official mailbox with the `gmail.send` scope and offline access, then store its refresh token in `GMAIL_REFRESH_TOKEN`. The website exchanges that refresh token for short-lived access tokens and sends each subscriber a separate message through Gmail. The Gmail password is never stored.

## Game content shapes

The game editor accepts JSON so each game can be changed without a code deployment.

```json
{
  "grow-or-shred": { "questions": [] },
  "truth-press": { "claims": [] },
  "mill-master": { "steps": ["Sort fibre", "Make pulp", "Clean pulp"] },
  "hidden-paper": { "products": [] },
  "paper-word-search": {
    "wordBank": ["PAPER", "FIBRE", "RECYCLE"],
    "wordCount": 10,
    "timeLimit": 300
  }
}
```

Keep each object compatible with the sample data already used by its game. Invalid or incomplete remote content falls back to the curated built-in content.
