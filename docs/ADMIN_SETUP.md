# Paper Foundation India admin setup

The admin portal uses a user ID and password. Accounts are stored in MongoDB and passwords are hashed with bcrypt before storage. Google Sign-In is not used.

## First owner account

Add these values to `.env.local` for local development and to Vercel Project Settings for deployment:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_BOOTSTRAP_USERNAME=
ADMIN_BOOTSTRAP_PASSWORD=
ADMIN_PREVIEW_MODE=false
```

Use a long, unique password of at least 10 characters. The first successful login creates the owner account in MongoDB only when the `admin_users` collection is empty. After that, changing the bootstrap variables does not alter existing accounts.

Open `/admin/login`, sign in with the bootstrap credentials, then use `/admin/users` to add, disable, remove or reset other administrator accounts.

## Production safety

Set `ADMIN_PREVIEW_MODE=false` in Vercel. Production never permits preview bypass, even if this value is accidentally set to true.

Use the exact production address for both URL values:

```env
NEXTAUTH_URL=https://your-domain.example
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## Content storage

MongoDB stores administrator accounts, articles, myths, game settings, resources, glossary entries, inquiries, subscribers, campaigns, analytics and public website settings.

Cloudinary stores uploaded images, PDFs and membership forms. MongoDB stores each asset URL, public ID, resource type, dimensions and editorial metadata.

## Optional integrations

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_SENDER_EMAIL=

NEXT_PUBLIC_GA_ID=
```

Gmail API credentials are used only for sending subscriber campaigns. They are unrelated to admin sign-in.
