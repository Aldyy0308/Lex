# LexIQ — Routing (Expo Router)

**Status as of this document:** routing foundation only. One route (`/`)
rendering a placeholder. No auth-gated routes, tab structure, or route groups
exist yet.

Supersedes the "explicitly deferred" note on `app/` in
[`project-structure.md`](./project-structure.md) — `app/` now exists.

---

## What exists

- `app/_layout.tsx` — root layout, renders `<Stack />` (a thin
  `expo-router` wrapper over `@react-navigation/native-stack`). Every route
  under `app/` renders inside this.
- `app/index.tsx` — the `/` route. Placeholder content only (`"LexIQ"` text).
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
- Tab or drawer navigation at the root — waits on the app's real navigation
  requirements being designed.
- `experiments.typedRoutes` — optional; worth enabling once there are enough
  routes for typo risk in route strings to matter.

Full migration rationale and tradeoffs: `.learning/T-001/` (local-only, not
part of this repo's tracked documentation).
