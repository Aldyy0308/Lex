# LexIQ — Routing (Expo Router)

**Status as of this document:** bottom tab shell (`(tabs)`) and an
auth-gated route group (`(auth)`) both exist. The root layout picks
between them at runtime with `Stack.Protected` based on session state.

Supersedes the "explicitly deferred" note on `app/` in
[`project-structure.md`](./project-structure.md) — `app/` now exists.

---

## What exists

- `app/_layout.tsx` — root layout. Wraps the tree in `ThemeProvider` and
  `AuthProvider` (from `src/domains/auth`), then renders a `RootNavigator`
  that shows a themed loading spinner while the session is being restored,
  and otherwise a `<Stack>` with two `Stack.Protected` branches:
  `(tabs)` when `isAuthenticated`, `(auth)` when not. Switching auth state
  flips which branch renders — no manual `router.replace` calls needed.
- `app/(tabs)/_layout.tsx` — the tab navigator, renders `<Tabs />` (a thin
  `expo-router` wrapper over `@react-navigation/bottom-tabs`) with four
  `Tabs.Screen` entries: `index` (Home), `practice`, `statistics`, `profile`.
- `app/(tabs)/index.tsx`, `practice.tsx`, `statistics.tsx` — placeholder tab
  routes. `profile.tsx` (T-007) additionally shows the signed-in user's
  email and a Sign Out button, via `useAuth()`.
- `app/(auth)/_layout.tsx` (T-007) — a `<Stack>` for the unauthenticated
  flow: `index` (Welcome, no header), `sign-in`, `sign-up` (both titled,
  themed headers).
- `app/(auth)/index.tsx`, `sign-in.tsx`, `sign-up.tsx` (T-007) — thin route
  files, each just rendering a screen component imported from
  `src/domains/auth`, per the boundary rule below.
- Entry point: `package.json`'s `main` is `"expo-router/entry"`. There is no
  project-owned `App.tsx`/`index.ts` anymore — Router owns bootstrapping.
- `app.json`: `plugins: ["expo-router"]` (Metro route-awareness),
  `scheme: "lexiq"` (deep linking), `web.bundler: "metro"` (web target uses
  Metro, matching Router's requirements).

## Boundary rule

`app/` is a **routing/composition layer only** — it wires screens together
and owns navigation structure. It must not contain business logic, data
fetching, or design-system primitives. A route file's job is to import a
screen component from `src/domains/<domain>` and render it; the screen's
actual implementation belongs in the domain, not in `app/`. `app/(auth)/*`
follows this literally: every route file is a one-line re-export of a
component from `src/domains/auth/components/`.

## Auth gating (T-007)

- Gating uses `Stack.Protected` (Expo Router's guard API), not manual
  redirects — each branch declares its own `guard` boolean and the router
  handles showing/hiding it.
- Session state comes from `useAuth()` (`src/domains/auth`), which wraps
  Supabase's `onAuthStateChange` listener — so navigation reacts to sign-in/
  sign-up/sign-out/session-restore uniformly, without each screen needing to
  call `router.replace` on success.
- While the initial session restore is in flight (`isLoading`), the root
  layout renders a themed spinner instead of either branch, so an
  already-signed-in user never flashes the Welcome screen on cold start.

## Deferred (not yet decided)

- `experiments.typedRoutes` — optional; worth enabling once there are enough
  routes for typo risk in route strings to matter.

Full migration rationale and tradeoffs: `.learning/T-001/` (local-only, not
part of this repo's tracked documentation). Tab shell rationale:
`.learning/T-002/`. Auth flow rationale: `.learning/T-007/`.
