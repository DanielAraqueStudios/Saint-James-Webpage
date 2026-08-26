# Saints Productions | Official Web Platform

A cinematic web platform for **Saints Productions**, built with Next.js, TypeScript, and Tailwind CSS, backed by an Express + PostgreSQL API. The site presents the producer roster, services, sound catalog, and contact paths for clients looking for music production, composition, mixing, mastering, and sonic identity work — all content-managed through a dedicated admin panel.

## Architecture

The repository is three apps sharing one database:

| App | Path | Role |
| --- | --- | --- |
| **frontend** | `/frontend` | Public marketing site (Next.js App Router, Server Components) |
| **admin** | `/admin` | Password-protected CMS for managing producers, tracks, categories, and the hero video (Next.js) |
| **backend** | `/backend` | REST API (Express + PostgreSQL) that both apps read/write against |

All three are orchestrated together via `docker-compose.yml` for local development, and deployed as separate services on Railway in production.

### Backend

- **Stack:** Express 4 + `pg` (no ORM — hand-written SQL), JWT auth for admin-mutating routes
- **Database:** PostgreSQL 16. Schema lives in `backend/src/db/migrations/*.sql`, run sequentially by filename at boot (`runMigrations()`), followed by an idempotent seed (`runSeed()`)
- **File uploads:** `multer` disk storage for producer images, audio tracks, and the homepage hero video, served back out under `/uploads`
- **Key resources:** `producers` (roster, bio, image, WhatsApp number, calendar/scheduling link), `tracks` (audio catalog, tagged to a producer and an optional category), `categories`, `hero_video`, `admin_users`

### Frontend (public site)

- Roster (`/about`, `/about/[slug]`) — pulls producers and their tagged tracks from the API
- Sound catalog (`/sounds`) — the full track catalog with genre/category and producer filters, admin-configurable
- Services (`/services`) — multi-step project intake form; the WhatsApp and "Schedule Interview" calendar CTA route to whichever producer the client selected, using that producer's own contact info from the database
- Contact (`/contact`) — WhatsApp and email contact paths

### Admin (CMS)

- Manage producers: add/remove as artists join or leave, edit bio/role/image, set WhatsApp number (with country selector + validation) and calendar link (with URL validation)
- Upload/manage tracks per producer with genre/category tagging (including an "Other" fallback for uncategorized tracks)
- Manage categories
- Replace the homepage hero video

## Tech Stack

- **Framework:** Next.js App Router (both `frontend` and `admin`)
- **Language:** TypeScript throughout, including the backend
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **API:** Express + PostgreSQL
- **Deployment Target:** Railway (separate service per app, Postgres as a managed Railway service)

## Local Development

The full stack (Postgres + backend + frontend + admin) can be run together with Docker Compose:

```bash
cp .env.example .env   # fill in POSTGRES_*, JWT_SECRET, ADMIN_USERNAME/PASSWORD, NEXT_PUBLIC_API_URL
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Backend API: `http://localhost:4000`

Alternatively, run each app directly with Node (requires a local or remote Postgres instance and a `.env` in `backend`):

```bash
cd backend && npm install && npm run dev     # http://localhost:4000
cd frontend && npm install && npm run dev    # http://localhost:3000
cd admin && npm install && npm run dev       # http://localhost:3001
```

There are also `run_dev.py` / `close_dev_ports.py` convenience scripts at the repo root for local process management.

## Production Build

Each app builds independently:

```bash
cd backend && npm run build && npm run start
cd frontend && npm run build && npm run start
cd admin && npm run build && npm run start
```

On Railway, each app is deployed as its own service with its **Root Directory** set to `/backend`, `/frontend`, or `/admin` respectively, plus a managed Postgres service that `backend` connects to via `DATABASE_URL`.

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

## Architecture Notes

- Producer contact info (WhatsApp, calendar link) is fully admin-managed — adding, removing, or editing a producer in the admin panel is reflected on the public site automatically, no code changes required.
- Large file uploads (hero video especially) are guarded with client-side size checks, server-side size limits, and crash-safety nets around `multer`/Express so a bad upload can't take the whole backend down.
- Lint should be added to CI before deployment so quality issues are caught automatically.
