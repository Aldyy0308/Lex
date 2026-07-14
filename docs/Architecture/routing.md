# LexIQ — Routing (Expo Router)

**Status as of this document:** bottom tab shell established. Four tab
routes (`Home`, `Practice`, `Statistics`, `Profile`), each a placeholder
screen. No auth-gated routes or route groups beyond the `(tabs)` group
exist yet.

Supersedes the "explicitly deferred" note on `app/` in
[`project-structure.md`](./project-structure.md) — `app/` now exists.

---

## What exists

- `app/_layout.tsx` — root layout, renders a `<Stack />` containing a single
  `(tabs)` screen with `headerShown: false` (the tab navigator supplies its
  own per-screen headers).
- `app/(tabs)/_layout.tsx` — the tab navigator, renders `<Tabs />` (a thin
  `expo-router` wrapper over `@react-navigation/bottom-tabs`) with four
  `Tabs.Screen` entries: `index` (Home), `practice`, `statistics`, `profile`.
- `app/(tabs)/index.tsx`, `practice.tsx`, `statistics.tsx`, `profile.tsx` —
  the four tab routes. Each renders only a title and a placeholder subtitle;
  no styling beyond centering.
- Entry point: `package.json`'s `main` is `"expo-router/entry"`. There is no
  project-owned `App.tsx`/`index.ts` anymore — Router owns bootstrapping.
- `app.json`: `plugins: ["expo-router"]` (Metro route-awareness),
  `scheme: "lexiq"` (deep linking), `web.bundler: "metro"` (web target uses
  Metro, matching Router's requirements).

## Boundary rule

`app/` is a **routing/composition layer only** — it wires screens together
and owns navigation structure. It must not contain business logic, data
fetching, or design-system primitives. A route file's job is to import a
screen component from `src/domains/<domain>` (once domains exist) and render
it; the screen's actual implementation belongs in the domain, not in `app/`.
This preserves the rule from `project-structure.md` that routes can be
restructured without forcing domain logic to move.

## Deferred (not yet decided)

- Route groups (`app/(auth)/`, `app/(app)/`) for gating authenticated vs.
  public sections — waits on the Auth domain.
- `experiments.typedRoutes` — optional; worth enabling once there are enough
  routes for typo risk in route strings to matter.

Full migration rationale and tradeoffs: `.learning/T-001/` (local-only, not
part of this repo's tracked documentation). Tab shell rationale: `.learning/T-002/`.
