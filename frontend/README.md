# BookEcommerce — Frontend

Vite + React + TypeScript storefront. See `../backend` for the auth/payments API.

## Local development

```
npm install
cp .env.example .env.local   # set VITE_API_URL and VITE_RAZORPAY_KEY_ID
npm run dev
```

## Production build (Hostinger shared hosting)

```
npm run build
```

This outputs static files to `dist/`. Upload the contents of `dist/` to your Hostinger
`public_html` (or a subdomain's document root). Before building, set `VITE_API_URL` in
`.env.local` (or your CI environment) to your deployed backend's public URL — Vite bakes
`VITE_*` values into the build at build time, so this must be set before running `build`,
not after.
