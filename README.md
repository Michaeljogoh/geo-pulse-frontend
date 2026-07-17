# GeoPulse — Frontend

IP-personalized crypto intelligence dashboard. The browser talks to the GeoPulse API directly so the backend sees the **visitor's real IP** (currency, locale, regional news) — not a Next.js server egress address.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, TanStack Query, Zustand, Firebase Auth |
| **Backend** | Sibling API in `../backend` (Express + Firestore + Cloud Functions) |

## Architecture (short)

```text
Browser  ──TanStack Query──►  NEXT_PUBLIC_API_BASE_URL /api/*
   │                              ▲
   │  real client IP              │ CORS allowlist + rate limits
   └─ Firebase Auth ID token ─────┘ (Bearer on /api/me, watchlist)
```

- **Server Components** render the shell (layout, first paint).
- **Client Components** fetch all personalized data via the typed client in `lib/api/`.
- **TanStack Query** = server state (geo, market, news, status, me, watchlist).
- **Zustand** = UI prefs only (currency override, auto-refresh). Theme via `next-themes`.

ADRs: [`docs/adr/0001-client-side-fetching-for-ip-personalization.md`](docs/adr/0001-client-side-fetching-for-ip-personalization.md), [`docs/adr/0002-firebase-auth-client-token-provider.md`](docs/adr/0002-firebase-auth-client-token-provider.md).

## Prerequisites

- Node.js **22** (see `.nvmrc`)
- pnpm (`corepack enable && corepack prepare pnpm@latest --activate`)
- Running GeoPulse backend (`../backend`) **or** a deployed API URL
- Firebase Web app in the **same** project as the backend (`FIREBASE_PROJECT_ID`)

## Local setup (<10 minutes)

```bash
# 1. Backend (separate terminal)
cd ../backend/apps/api
cp .env.example .env   # fill FIREBASE_* + provider keys
npm install && npm run dev
# → http://localhost:8080/health
# → http://localhost:8080/docs

# 2. Frontend
cd ../../frontend
cp .env.example .env.local
# set NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
# set NEXT_PUBLIC_FIREBASE_* from Firebase console → Project settings → Your apps
pnpm install
pnpm dev
# → http://localhost:3000
# → http://localhost:3000/dashboard
```

Optional demo overrides: `?ip=8.8.8.8` and `?vs=ngn` on `/dashboard`.

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

\*Required for sign-in + watchlist. Anonymous dashboard sections work without Firebase.

When pointing the app at a remote backend, add your frontend origin to the API's `CORS_ALLOWED_ORIGINS`, and add the hostname to Firebase Auth → **Authorized domains**.

## Scripts

```bash
pnpm dev            # Next.js (webpack)
pnpm build          # production build
pnpm start          # serve production build
pnpm typecheck      # tsc --noEmit
pnpm lint
pnpm test           # vitest run (MSW, no real network)
pnpm test:coverage  # vitest + v8 coverage
pnpm test:watch
```

`npm run test` / `npm run test:coverage` work the same via the scripts in `package.json`.

## Testing

- **MSW** mocks every public + authed backend endpoint (`tests/msw/handlers.ts`).
- **RTL** component tests cover loading / success / error / empty / degraded / auth / watchlist optimistic UI.
- **Unit** tests cover the API client (incl. Bearer header + `UNAUTHENTICATED`), hooks (fake timers for refetch), formatters, and `uiStore`.
- Firebase Auth is mocked in `tests/setup.ts`; no real network or Firebase in CI.

Playwright smoke against MSW is optional and not required for the current DoD.

## Design decisions

1. **Client-side fetching for IP personalization** — Server-side data fetching would send the host egress IP to the API and break geo/currency/news personalization.
2. **Server vs client state** — TanStack Query owns remote data; Zustand owns UI prefs only. No duplicated caches.
3. **Firebase Auth token provider** — `AuthProvider` registers `setAuthTokenProvider(() => currentUser.getIdToken())`. Tokens are never stored in Zustand/localStorage.
4. **Degraded-but-usable** — One failing section never blanks the page; banners and per-section errors stay honest (`null` → "—" / "Unknown", never fabricated).
5. **Confidence / source signals** — Meta badges (live vs cache, latency, provider) surface trust instead of freshness theater.

## Project layout

```text
app/                 # routes (/, /dashboard, auth shells)
components/
  auth/              # AuthProvider, SignInButton, UserMenu
  dashboard/         # Visitor, Market, Trending, News, Health, Watchlist
  layout/            # AppShell, Header
  common/            # SectionCard, ErrorState, skeletons
hooks/               # TanStack Query hooks
lib/api/             # typed client + Zod schemas + endpoints
store/               # Zustand UI store
tests/               # unit + component + MSW
docs/                # plan + ADRs
```

## Docs

| Doc | Purpose |
|-----|---------|
| [`docs/geoip-crypto-intel-frontend-plan.md`](docs/geoip-crypto-intel-frontend-plan.md) | Implementation plan (Phases 0–17) |
| [`docs/adr/`](docs/adr/) | Architecture decisions |
| [`DESIGN.md`](DESIGN.md) | Visual / brand tokens |
