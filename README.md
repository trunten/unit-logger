# Unit Logger

A small installable Next.js PWA for logging daily drinking units.

## Features

- Clerk authentication with passwordless/email sign-in and other methods enabled in the Clerk dashboard.
- Multiple user accounts with private drink histories.
- Existing email-linked Unit Logger records are matched to the same email on first Clerk sign-in, preserving their drink history.
- Installable PWA with a mobile-first interface.
- Default drinks plus custom drink names.
- Add, review, and delete entries with date/time and units.
- Private Vercel Blob JSON storage.

## Deploy

1. Import this repository into Vercel.
2. Add a Vercel Blob store with **private** access available to the project.
3. Configure Clerk for the app and add these Vercel environment variables:
   - \`CLERK_SECRET_KEY\`
   - \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\`
4. In Clerk, enable the sign-in methods you want to offer. For passwordless email, enable the email verification/sign-in option in the Clerk dashboard.
5. Deploy.

### Authentication

Unit Logger now uses Clerk for authentication. The old custom username/password, Resend magic-link, and signed-cookie endpoints have been removed.

Drink histories remain in the private Vercel Blob store. When a Clerk user signs in for the first time, Unit Logger links them to an existing stored account with the same email address when one exists; otherwise it creates a new Clerk-backed store record.

### Storage

- Drink logs and account mapping are stored in a private Vercel Blob JSON object.
- Clerk handles passwords, email verification, sessions, and authentication security.
- The Clerk secret key is server-side only and must never be exposed to the browser.

This is intentionally lightweight. Vercel Blob is file storage rather than a transactional database, so this design is suited to a small number of users and modest write frequency.
