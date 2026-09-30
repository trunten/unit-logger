# Unit Logger

A small installable Next.js PWA for logging daily drinks units.

## Deploy

1. Import this repository into Vercel.
2. Add a Vercel Blob store with **private** access available to the project.
3. Add **AUTH_SECRET** as an encrypted Vercel environment variable. Use a long random value (32+ characters).
4. Deploy.

On the login screen, **Create a new account** generates a unique username and complex password. Each account has its own entries. Store the generated credentials safely; the app intentionally does not provide password recovery.

### Storage and security

- Drink logs are stored in a private Vercel Blob JSON object.
- Passwords are salted scrypt hashes, never plaintext.
- Sessions use signed HTTP-only cookies.
- No raw Blob URL is exposed to the browser.

This is intentionally lightweight. Vercel Blob is file storage rather than a transactional database, so this design is suited to a small number of users and modest write frequency.