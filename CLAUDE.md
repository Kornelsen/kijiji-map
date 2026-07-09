# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js 14 (App Router) single-page app that displays scraped Kijiji rental listings on an interactive Mapbox map with filters. Listing data is scraped by a separate repo ([kijiji-map-scraper](https://github.com/Kornelsen/kijiji-map-scraper)) into MongoDB; this app only reads (and archives) that data. Deployed on Vercel.

## Commands

```bash
pnpm dev        # dev server on http://localhost:3000
pnpm build      # production build (also the de facto type check)
pnpm lint       # biome lint app/
pnpm format     # biome format --write app/
```

- Uses **pnpm** and **Biome** (not npm/ESLint/Prettier). There is no test suite.
- Requires `.env.local` with: `DB_USER`, `DB_PASSWORD`, `DB_URI`, `DB_NAME` (MongoDB Atlas), `NEXT_PUBLIC_API_URI` (e.g. `http://localhost:3000/api/`, trailing slash required — hooks concatenate paths onto it), `NEXT_PUBLIC_MAPBOX_TOKEN`.

## Architecture

Data flows one way: **Zustand stores → React Query hooks → API routes → MongoDB**.

- **Stores** (`app/store/`): `filters.store.ts` holds the active `TFilters` (price/beds/baths/sqft/misc attributes + map `bounds` + `limit`/`skip` pagination); `global.store.ts` holds map↔card interaction state (focused/selected listings, hover coordinates).
- **Hooks** (`app/hooks/*.query.ts`): React Query wrappers that serialize the filters store into a `filters` query param. Filter state changes automatically refetch because the serialized filters are part of the query key.
- **API routes** (`app/api/`): parse the `filters` param, convert it to a MongoDB query via `getFilters()` in `app/api/listings/listings.utils.ts` (the single place filter semantics live — geo `$geoWithin` box from map bounds, ranges, `$or` for beds/baths, attribute existence for misc), and query the `listing-features` collection.

Two parallel fetch paths serve the two panes of the UI (`app/_components/listings/listings.tsx` is the top-level layout):

1. **Map pins** — `useFeatures` → `GET /api/features`: all matching listings but projected down to geometry + `listingId` only, with bounds widened to the full region (`initialFilterBounds`) so pins exist outside the viewport. Rendered as clustered Mapbox layers in `app/_components/map/listings-map.tsx`.
2. **Card list** — `usePaginatedListings` → `GET /api/listings`: paginated (10/page via `skip`/`limit` in the filters store), sorted by date desc, projected to exclude heavy fields (`images`, `attributes`). Full listing detail (all images, attributes) is lazy-loaded per listing via `useListingById` → `GET /api/listings/[id]`.

Other things worth knowing before digging in:

- **Documents are GeoJSON Features** (`ListingFeature` in `app/_types/listings.type.ts`): geometry + `properties.*`. Mongo queries filter on `properties.<field>` paths.
- **SSR**: `app/page.tsx` prefetches the features query server-side (calling `getFeaturesData` directly, not over HTTP) and hydrates it into React Query.
- **Cron** (`app/api/cron/archive/route.ts`): QStash-triggered (signature-verified) job that moves listings older than 2 months to a `listings-archive` collection with a slimmed projection.
- **Components** (`app/_components/`): `ui/` is shadcn-generated primitives (config in `components.json`); `shared/`, `form/`, `listings/`, `map/` are app components. Barrel `index.ts` files re-export each folder.
- Path alias `@/*` maps to the repo root. The Mongo client singleton is `lib/mongodb.js` (plain JS, credentials from env).
- Filter option values in `app/constants/filters.constants.ts` (e.g. `airconditioning`, `laundryinunit`) must match attribute keys produced by the scraper; `4` is a sentinel meaning "4+" for beds/baths.
