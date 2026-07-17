# GeoPulse — Frontend

GeoPulse is an **IP-personalized crypto intelligence dashboard**. It shows live market data, trending coins, and news tuned to where the visitor is — currency, locale, and regional context come from their real IP, not a server egress address.

The browser talks to the GeoPulse API directly so personalization stays accurate.

## Related repositories

| Repo | Link |
|------|------|
| **Frontend** (this repo) | [github.com/Michaeljogoh/geo-pulse-frontend](https://github.com/Michaeljogoh/geo-pulse-frontend) |
| **Backend** (required API) | [github.com/Michaeljogoh/geo-pulse-backend](https://github.com/Michaeljogoh/geo-pulse-backend) |

This frontend does **not** include the API. Clone and run the [backend repo](https://github.com/Michaeljogoh/geo-pulse-backend), or point `NEXT_PUBLIC_API_BASE_URL` at a deployed API.

## What it does

- **Landing page** — product overview and live visitor-intel preview
- **Visitor intelligence** — location, currency, ISP, network type from geo lookup
- **Market overview** — prices in your currency (or a manual override), with optional watchlist stars when signed in
- **Trending & movers** — trending coins plus top gainers and losers
- **News** — searchable, paginated crypto headlines (images + sentiment when available)
- **Watchlist** — save coins across devices after Firebase sign-in
- **API health** — provider circuit state and cache stats
- **Degraded but usable** — one failing section never blanks the whole dashboard

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query, Zustand, Firebase Auth, Vitest + MSW.

## Architecture (short)

```text
Browser  ──TanStack Query──►  NEXT_PUBLIC_API_BASE_URL /api/*
   │                              ▲
   │  real client IP              │ CORS + rate limits
   └─ Firebase Auth ID token ─────┘ (Bearer on /api/me, watchlist)
```

- **Server Components** render the shell and first paint
- **Client Components** fetch personalized data via the typed client in `lib/api/`
- **TanStack Query** owns remote data (geo, market, news, status, me, watchlist)
- **Zustand** owns UI prefs only (currency override, auto-refresh); theme via `next-themes`

## Prerequisites

- Node.js **22** (see [`.nvmrc`](.nvmrc))
- **pnpm** recommended (`corepack enable && corepack prepare pnpm@latest --activate`) — or npm
- The [GeoPulse backend](https://github.com/Michaeljogoh/geo-pulse-backend) running locally **or** a deployed API URL
- Firebase Web app in the **same** project as the backend (`FIREBASE_PROJECT_ID`)

## Quick start

```bash
# 1. Backend (separate terminal / folder)
git clone https://github.com/Michaeljogoh/geo-pulse-backend.git
cd geo-pulse-backend/apps/api
cp .env.example .env
# fill FIREBASE_* + CRYPTOCOMPARE_API_KEY
# set CORS_ALLOWED_ORIGINS=http://localhost:3000
npm install && npm run dev
# → http://localhost:8080/health

# 2. Frontend (this repo)
git clone https://github.com/Michaeljogoh/geo-pulse-frontend.git
cd geo-pulse-frontend
cp .env.example .env.local
# set NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
# set NEXT_PUBLIC_FIREBASE_* from Firebase console → Project settings → Your apps

pnpm install   # or: npm install
pnpm dev       # or: npm run dev
# → http://localhost:3000
# → http://localhost:3000/dashboard
```

**Using a deployed API instead:** skip the local backend and set `NEXT_PUBLIC_API_BASE_URL` to that origin (no trailing slash). Add your frontend origin to the API’s `CORS_ALLOWED_ORIGINS`.

Optional demo query params on `/dashboard`: `?ip=8.8.8.8`, `?vs=ngn`.

## Environment variables

See [`.env.example`](.env.example). All `NEXT_PUBLIC_*` values are safe to expose in the browser.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | yes | Backend origin, **no trailing slash** |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | yes* | Firebase Web config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | yes* | e.g. `proj.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | yes* | Must match backend `FIREBASE_PROJECT_ID` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | yes* | Firebase Web app id |
| `NEXT_PUBLIC_APP_NAME` | no | Branding label |
| `NEXT_PUBLIC_API_TIMEOUT_MS` | no | Client abort timeout (default `10000`) |

\*Required for sign-in and watchlist. Anonymous dashboard sections work without Firebase.

When pointing at a remote API:

1. Add the frontend origin to the API’s `CORS_ALLOWED_ORIGINS`
2. Add the hostname under Firebase Auth → **Authorized domains**

## Scripts

```bash
pnpm dev            # Next.js (webpack) — or npm run dev
pnpm build          # production build
pnpm start          # serve production build
pnpm typecheck
pnpm lint
pnpm test           # Vitest + MSW (no real network)
pnpm test:coverage
pnpm test:watch
```

## Project layout

```text
app/                 # routes (/, /dashboard/*, /sign-in, /sign-up)
components/
  auth/              # AuthProvider, SignInButton, UserMenu
  dashboard/         # Overview, Visitor, Market, Trending, News, Health, Watchlist
  landing/           # Marketing / hero
  common/            # SectionCard, ErrorState, skeletons
hooks/               # TanStack Query hooks
lib/api/             # typed client + Zod schemas + endpoints
store/               # Zustand UI store
tests/               # unit + component + MSW
docs/                # plan + ADRs
```

## Core product routes

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/sign-in` / `/sign-up` | Firebase email or Google auth |
| `/dashboard` | Overview (KPIs, chart, visitor + market snapshot) |
| `/dashboard/visitor` | Full visitor intelligence |
| `/dashboard/market` | Market table |
| `/dashboard/trending` | Trending + movers |
| `/dashboard/news` | News feed |
| `/dashboard/watchlist` | Saved coins (auth) |
| `/dashboard/health` | API / provider health |

## Design notes

1. **Client-side fetching for IP personalization** — SSR data fetches would send the host egress IP and break geo/currency/news.
2. **Degraded-but-usable** — section errors stay local; values stay honest (`null` → "—" / "Unknown", never invented).
3. **Auth tokens** — Firebase ID tokens are read on demand; never stored in Zustand or localStorage.

## Further docs

| Doc | Purpose |
|-----|---------|
| [`docs/adr/`](docs/adr/) | Architecture decisions |
| [`DESIGN.md`](DESIGN.md) / [`DESIGN-slack.md`](DESIGN-slack.md) | Visual / brand direction |
| [`docs/geoip-crypto-intel-frontend-plan.md`](docs/geoip-crypto-intel-frontend-plan.md) | Historical implementation plan |
| [Backend README](https://github.com/Michaeljogoh/geo-pulse-backend#readme) | API setup, env vars, endpoints |
