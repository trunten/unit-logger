# Unit Logger

A small installable Next.js PWA for logging daily drinking units.

## Features

- Clerk authentication with passwordless/email sign-in and other methods enabled in the Clerk dashboard.
- Multiple user accounts with private drink histories.
- Existing email-linked Unit Logger records are matched to the same email on first Clerk sign-in, preserving their drink history.
- After the initial Clerk sign-in, Unit Logger creates its own long-lived, HttpOnly app session cookie for keeping the user signed in on their personal device.
- Logging out clears the Unit Logger app session and signs out of Clerk.
- Installable PWA with a mobile-first interface.
- Default drinks plus custom drink names.
- Add, review, and delete entries with date/time and units.
- Private Vercel Blob JSON storage.

## Deploy

1. Import this repository into Vercel.
2. Add a Vercel Blob store with **private** access available to the project.
3. Configure Clerk for the app and add these Vercel environment variables:
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. In Clerk, enable the sign-in methods you want to offer. For passwordless email, enable the email verification/sign-in option in the Clerk dashboard.
5. Deploy.

### Authentication

Unit Logger uses Clerk for the initial authentication flow. The old custom username/password and Resend magic-link endpoints have been removed.

After Clerk confirms a sign-in, Unit Logger creates a separate app session:

1. Clerk authenticates the user.
2. Unit Logger maps the Clerk user to its stored account.
3. The server creates a cryptographically random app session token.
4. Only a SHA-256 hash of that token is stored in the private Vercel Blob store.
5. The raw token is kept in an HttpOnly, Secure, SameSite cookie on the user's device.
6. Normal Unit Logger page and API requests authenticate using this app session rather than sending a Clerk token to the application.
7. Logging out removes the app session and signs out of Clerk.

The app session currently lasts up to five years and is intended for personal devices where the device itself is protected by its normal lock/biometric security.

### Storage

- Drink logs, account mapping, and app session hashes are stored in a private Vercel Blob JSON object.
- Clerk handles the initial identity verification and authentication flow.
- The Clerk secret key is server-side only and must never be exposed to the browser.
- App session tokens are never stored in plaintext in Vercel Blob.

This is intentionally lightweight. Vercel Blob is file storage rather than a transactional database, so this design is suited to a small number of users and modest write frequency.

### Development and Clerk

The project can use a Clerk Development instance for the free/development setup. Development and Production Clerk instances use different keys and configuration, so the appropriate Clerk keys must be supplied for the instance being used.

For a small personal deployment, keep the Clerk environment and Vercel environment variables consistent. Never commit Clerk secret keys to the repository.
