# Unit Logger

A small installable Next.js PWA for logging daily drinking units.

## Features

- Multiple user accounts with private drink histories.
- Traditional username/password accounts with salted scrypt password hashes.
- Passwordless email magic-link sign-in.
- New users can create an account simply by entering their email and requesting a sign-in link.
- Existing users can add or change their email from the dashboard for passwordless sign-in.
- Magic links expire after 15 minutes and can only be used once.
- Installable PWA with a mobile-first interface.
- Default drinks plus custom drink names.
- Add, review, and delete entries with date/time and units.

## Deploy

1. Import this repository into Vercel.
2. Add a Vercel Blob store with **private** access available to the project.
3. Add **AUTH_SECRET** as an encrypted Vercel environment variable. Use a long random value (32+ characters).
4. Connect/configure Resend for email delivery so **RESEND_API_KEY** is available to the deployment.
5. Optionally set **RESEND_FROM_EMAIL** to a verified sender address. Without it, the app uses Resend's `onboarding@resend.dev` sender.
6. Deploy.

### Sign-in options

**Username/password:** On the login screen, **Create a new account** generates a unique username and complex password. Store the generated credentials safely; the app intentionally does not provide password recovery.

**Email magic link:** Choose **Sign in with email link** and enter an email address. If the email is new, Unit Logger creates the account automatically and emails a 15-minute sign-in link. If the email belongs to an existing account, the link signs into that account.

Existing username/password users can add an email from the dashboard under **Email sign-in**.

### Storage and security

- Drink logs and account data are stored in a private Vercel Blob JSON object.
- Passwords are salted scrypt hashes, never plaintext.
- Sessions use signed HTTP-only cookies.
- Magic-link tokens are stored only as SHA-256 hashes and are single-use.
- No raw Blob URL is exposed to the browser.

This is intentionally lightweight. Vercel Blob is file storage rather than a transactional database, so this design is suited to a small number of users and modest write frequency.