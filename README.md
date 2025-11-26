# Healthy Tips Video Platform

Healthy Tips is a two-sided video platform focused on healthy food topics. It combines a lightweight admin panel for uploading curated content with a user-facing experience that mirrors the familiarity of YouTube.

## Core Features

- Admins upload video assets directly to MinIO (S3-compatible) storage through the admin panel.
- Users browse a catalog of healthy food videos with search, watch and comment functionality.
- Simple role-based auth: `admin` users manage content, `basic` users consume it.

## Architecture

- **Frontend**: SvelteKit deployed via the Node adapter for flexibility in server-rendered routes and API endpoints.
- **Storage**: MinIO provides S3-compatible object storage for video files and thumbnails.
- **Database**: PostgreSQL with Drizzle ORM handles relational data (users, videos, comments, etc.).

## Application Structure

1. **Admin Panel**
   - Authenticated admin-only area.
   - Upload form for pushing videos and metadata to MinIO + PostgreSQL.
   - Basic management views (draft/published status).
2. **User Experience**
   - Public video browsing, searching, and playback UI similar to YouTube.
   - Interaction features: add/edit/delete comments.

## Authentication & Authorization

- Email/password auth.
- Role enforcement in both frontend routes and backend endpoints.
- Guards around admin tools plus per-request role checks in the API layer.

---

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start the postres and minio services with `pnpm services:start`.

To push the defined schema to the localy running Postgres run

```bash
pnpm db:push
```

Then you can start the dev server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
