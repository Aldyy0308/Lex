# Components

The shared design system — reusable, presentation-only UI (buttons, cards, layout
primitives). Will eventually split into `ui/` (atoms) and `layout/` (structural
primitives) as the design system grows.

Components here must never contain business logic and must never know about a
specific domain, puzzle type, or Supabase.

## Status
`ui/` implemented (T-003): `Screen`, `Button`, `Card`, `AppText` — all
theme-driven via `src/theme`'s `useTheme()`, no inline hardcoded colors/sizes.
`TextField` added (T-007) for the auth forms, same theme-driven approach.
`layout/` not yet created — will be added once a structural (non-atomic) need
arises. See `docs/Architecture/design-system.md` for the full rationale.
