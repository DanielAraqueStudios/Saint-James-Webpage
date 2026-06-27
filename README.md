# Saints Productions | Official Web Platform

A cinematic web platform for **Saints Productions**, built with Next.js, TypeScript, and Tailwind CSS. The site presents the collective, services, sound portfolio, and contact paths for clients looking for music production, composition, mixing, mastering, and sonic identity work.

## Current Direction

The project is moving from an artist-portfolio prototype into a production-services brand site. The next implementation pass should align all pages, components, and documentation around the Saints Productions identity.

## Visual System

### Color Palette

| Token | Hex | Suggested Use |
| --- | --- | --- |
| Deep Blue | `#1A6189` | Primary brand color, headings, key UI accents |
| Teal | `#38A89C` | Secondary actions, highlights, hover states |
| Pale Cyan | `#ABDFEB` | Soft surfaces, supporting accents, light text moments |
| Purple | `#492264` | Premium accent, contrast details, selected states |

### Typography

| Role | Font |
| --- | --- |
| Titles | Avenir Next |
| Body Text | Gotu |
| Alternative Text | Baskervville |

Note: **Avenir Next** is commonly available as a licensed/system font, not a free Google Font. During implementation, the site should use a proper licensed/self-hosted copy if available, with a clean fallback stack. **Gotu** is the main body text font, and **Baskervville** is the alternate text font for editorial or contrast moments.

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Deployment Target:** Next.js production server on Railway

## Local Development

From the repository root:

```bash
python run_dev.py
```

To test the production server locally:

```bash
python run_dev.py --prod
```

Or with the standard Node workflow:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Production Build And Start

```bash
cd frontend
npm run build
npm run start
```

The project is now configured for production Next.js hosting rather than GitHub Pages static export. On Railway, configure the service with:

- **Root Directory:** `/frontend`
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`

This keeps Next.js running as a server, so the app can use normal production Next.js behavior instead of being limited to static files.

## Architecture Notes

- Brand content should be centralized before the next major UI pass.
- Placeholder links for WhatsApp, Calendly, email, and social platforms should be replaced before production.
- Legacy Santiago Leiva and artist-tour content should be removed or rewritten for Saints Productions.
- Lint should be added to CI before deployment so quality issues are caught automatically.
