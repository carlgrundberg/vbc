# Vittsjö Beer Club (VBC)

Website and admin for **Vittsjö Beer Club**: a small club that meets to share and taste beer. The project gives members a public schedule of upcoming and past meetings and a **Payload CMS** admin where organizers record each meeting—hosts, attendees, optional cover art, and **beer flights** (ordered tastings) with links to [Untappd](https://untappd.com/). When you save a meeting, beer metadata (name, brewery, style, ABV, IBU) is **fetched from the linked page** when possible, so listings stay consistent without manual copy-paste.

## Stack

- **App**: [Next.js](https://nextjs.org/) (App Router) + React, with a dark/light theme
- **CMS**: [Payload 3](https://payloadcms.com/) with Lexical rich text, GraphQL API, and admin at `/admin`
- **Database**: PostgreSQL (via `@payloadcms/db-postgres`)
- **Media**: S3-compatible storage (`@payloadcms/storage-s3`), e.g. Supabase Storage
- **Localization**: English and Swedish in the admin; public site metadata targets the club name

## Prerequisites

- **Node.js** `^24.10.9` (see `package.json` `engines`)
- A PostgreSQL database and S3-compatible bucket for uploads

## Environment

Create a `.env` in the project root (do not commit secrets). Typical variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Payload encryption/session secret |
| `SUPABASE_S3_BUCKET` | Media bucket name |
| `SUPABASE_S3_REGION` | Object storage region |
| `SUPABASE_S3_ENDPOINT` | S3 API endpoint URL |
| `SUPABASE_S3_ACCESS_KEY_ID` | S3 access key |
| `SUPABASE_S3_SECRET_ACCESS_KEY` | S3 secret key |

Names match `src/payload.config.ts`; you can point the same adapter at any S3-compatible provider if you adjust endpoint and credentials.

## Scripts

```bash
npm install
npm run dev          # Next.js dev server (Turbopack)
npm run build        # Production build
npm run start        # Run production server
npm run generate:types   # Regenerate Payload TS types
npm run lint         # ESLint
```

Open the admin UI after `npm run dev`, usually at `http://localhost:3000/admin`, and create the first user when prompted.

## License

MIT (see `package.json`).
