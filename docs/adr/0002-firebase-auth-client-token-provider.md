# ADR 0002: Firebase Auth client token provider

## Status

Accepted

## Context

Protected GeoPulse endpoints (`GET /api/me`, watchlist mutations) require a Firebase ID token in
`Authorization: Bearer <token>`. Firebase refreshes ID tokens automatically; storing a token in
Zustand or `localStorage` would risk using expired credentials and duplicating source of truth.

The typed API client already supports `auth: true` requests and throws `UNAUTHENTICATED` when no
token provider returns a token — callers must never silently omit auth.

## Decision

1. **`AuthProvider` owns the Firebase session.** It subscribes to `onAuthStateChanged` and exposes
   `{ user, status, signInWithGoogle, signInWithEmail, signOut }` via React context (`useAuth`).
2. **Token provider injection.** On mount, register:
   `setAuthTokenProvider(() => auth.currentUser?.getIdToken() ?? null)`.
   Each authed request asks Firebase for a fresh token; never cache the JWT in app state.
3. **`useMe` is gated.** TanStack Query `['me']` calls `getMe()` only when `status === 'authed'`.
4. **Header UX.** Anonymous → `SignInButton` (dialog: Google + email/password). Authed → `UserMenu`
   (avatar from `AuthUser.picture` / Firebase photo, sign-out).

```text
Browser
  AuthProvider ──onAuthStateChanged──► status + session user
       │
       └─ setAuthTokenProvider(() => currentUser.getIdToken())
              │
              ▼
         apiRequest({ auth: true })
              │  Authorization: Bearer <fresh ID token>
              ▼
         Backend verifies Firebase ID token
```

## Consequences

- Authed calls without a live Firebase user fail fast with `UNAUTHENTICATED` (no anonymous leak).
- Sign-out clears the Firebase session; the token provider returns `null` thereafter.
- Frontend Firebase Web config remains public client identifiers; secrets stay on the backend.
- Tests mock Firebase Auth + the token provider; MSW asserts the Bearer header on `/api/me`.
