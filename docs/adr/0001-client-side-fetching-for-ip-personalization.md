# ADR 0001: Client-side fetching for IP personalization

## Status

Accepted

## Context

The GeoPulse dashboard is personalized by the visitor's IP. The backend resolves the caller from
`X-Forwarded-For` (then `req.socket.remoteAddress`) and uses that IP for geo, currency, locale, and
regional news (`GET /api/geo`, `GET /api/dashboard`).

If personalized data were fetched in Next.js Server Components / Route Handlers, the backend would
see the **Vercel/server egress IP**, not the visitor's IP. That would break personalization and
produce incorrect currency and news for every user behind the same deployment.

The backend URL is public (`NEXT_PUBLIC_API_BASE_URL`). CORS allowlisting and rate limiting are
enforced on the API. No secrets belong in the frontend.

## Decision

1. **Browser → backend directly.** All personalized API calls run in the browser via TanStack Query
   and the typed API client (`lib/api/`), so the backend receives the real visitor IP.
2. **Server Components** render only the static shell (layout, headings, skeletons) for first paint
   and SEO.
3. **Client Components** (under `QueryClientProvider`) own all personalized data fetching.
4. **State ownership:**
   - Server state → TanStack Query only (geo, market, trending, news, status, dashboard, me, watchlist)
   - Client (UI) state → Zustand only (currency override, auto-refresh toggle; theme via `next-themes`)
   - URL state → Next.js `searchParams` (optional `?ip=` demo override, `?vs=` currency)

```text
┌───────────────────────── Next.js App (Vercel) ─────────────────────────┐
│  app/layout.tsx (Server)                                                 │
│    └─ Providers (Client): QueryClientProvider + ThemeProvider            │
│         └─ app shell (Server) → <Dashboard/> (Client)                    │
│              ├─ VisitorIntelligenceCard   ─┐                             │
│              ├─ MarketOverview            │  TanStack Query hooks        │
│              ├─ TrendingPanel             │  → typed API client         │
│              ├─ NewsFeed                  │  → GET {NEXT_PUBLIC_API_BASE}│
│              └─ ApiHealthPanel           ─┘     /api/*                   │
│  Zustand: currency override, auto-refresh                                │
└─────────────────────────────────────────────────────────────────────────┘
                                   │  (browser → backend, real client IP)
                                   ▼
                        Backend REST API (separate service)
```

## Consequences

- Personalization works correctly for every visitor without a geo-IP proxy on the Next.js edge.
- The API base URL is public by design; Firebase Web config values are also public client identifiers.
- CORS must include the Vercel origin on the backend; rate limits apply per visitor IP.
- No Server Component may call personalized backend endpoints on behalf of the user.
- Demo overrides (`?ip=`) remain optional client query params forwarded to the API when present.
