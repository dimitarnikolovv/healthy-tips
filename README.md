# Healthy Tips Video Platform

Healthy Tips is a two-sided video platform focused on healthy food topics. It combines a lightweight admin panel for uploading curated content with a user-facing experience that mirrors the familiarity of YouTube.

## Core Features

- Admins upload video assets directly to MinIO (S3-compatible) storage through the admin panel.
- Users browse a catalog of healthy food videos with search, watch, like, and comment functionality.
- Each video tracks watch counts, like counts, and comment counts in real time.
- Simple role-based auth: `admin` users manage content, `basic` users consume it.

## Architecture

- **Frontend**: SvelteKit deployed via the Node adapter for flexibility in server-rendered routes and API endpoints.
- **Storage**: MinIO provides S3-compatible object storage for video files and thumbnails.
- **Database**: PostgreSQL with Drizzle ORM handles relational data (users, videos, comments, likes, counters).

## Application Structure

1. **Admin Panel**
   - Authenticated admin-only area.
   - Upload form for pushing videos and metadata to MinIO + PostgreSQL.
   - Basic management views (draft/published status, counter insights).
2. **User Experience**
   - Public video browsing, searching, and playback UI similar to YouTube.
   - Interaction features: like/unlike, add comments, view counters.
   - Watch counter increments on playback; comment counter updates on new posts.

## Authentication & Authorization

- Email/password auth.
- Role enforcement in both frontend routes and backend endpoints.
- Guards around admin tools plus per-request role checks in the API layer.
