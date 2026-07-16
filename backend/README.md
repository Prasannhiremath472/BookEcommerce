# BookEcommerce — Backend

Express + MySQL API for email/OTP auth and Razorpay payments. See `../frontend` for the storefront.

## Local development

```
npm install
cp .env.example .env   # fill in real DB/Mailjet/Razorpay credentials
npm run migrate        # creates tables from src/db/schema.sql
npm run dev
```

## Deploying on Hostinger

1. **Database**: create a MySQL database in hPanel → Databases → MySQL Databases. Use the
   generated host/user/password/db name for `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` in `.env`.
   Run `npm run migrate` once against that database (either locally with the Hostinger DB
   credentials, or via SSH on the Hostinger server) to create the `users`, `otp_codes`, and
   `sessions` tables.
2. **Node app**: Hostinger's Node.js hosting (hPanel → Advanced → Node.js) lets you point at
   this folder, set the startup file to `dist/index.js`, and set environment variables directly
   in the Node.js app panel instead of committing a `.env` file. Run `npm run build` to produce
   `dist/`, then `npm run start` (or let Hostinger's app manager run it).
3. **CORS_ORIGIN**: set this to the exact origin the frontend is served from in production
   (e.g. `https://yourdomain.com`), not `localhost`. A mismatch here is the most common cause of
   "Failed to fetch" / CORS errors after deploying.
4. **VITE_API_URL** (in the frontend's `.env.local`/build environment): point it at this
   backend's public URL before running the frontend's `npm run build`.
