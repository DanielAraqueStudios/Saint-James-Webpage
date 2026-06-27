# Deployment Guide

This project is configured for a production Next.js server deployment, with Railway as the current target.

## Current Production Mode: Railway

Railway can run a long-lived Node service, so this project does not need the GitHub Pages static-export limitations.

Use these Railway service settings:

- **Root Directory:** `/frontend`
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`

The production start command runs `next start`, which serves the compiled `.next` application.

## Local Production Test

```bash
npm install
npm run build
npm run start
```

Then open:

```text
http://localhost:3000
```

## Why This Is Different From GitHub Pages

GitHub Pages only serves static files, so it required:

- `output: "export"`
- `basePath: "/Saint-James-Webpage"`
- `images.unoptimized: true`

Those settings have been removed because Railway can run the Next.js server directly.

## Capabilities Enabled By Railway

With this approach, the app can use normal production Next.js features, including:

- Server-rendered pages
- API routes
- Middleware
- Optimized `next/image`
- Production routing at the root domain

## GitHub Actions

The GitHub workflow now validates the app only:

```bash
npm ci
npm run lint
npm run build
```

Deployment should be handled by Railway through its connected GitHub service.
