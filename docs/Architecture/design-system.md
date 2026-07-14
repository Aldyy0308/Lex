# LexIQ — Design System

**Status as of this document:** foundation only. Tokens and four UI
primitives (`Screen`, `Button`, `Card`, `AppText`) exist. No domain-specific
components, no icon set, no animated transitions.

---

## What exists

### `src/theme/` — tokens (data, not components)

- `tokens/colors.ts` — `lightColors` / `darkColors`, both implementing the
  same `ColorPalette` shape (`background`, `surface`, `surfaceAlt`, `border`,
  `textPrimary`, `textSecondary`, `textMuted`, `accent`, `onAccent`,
  `danger`, `success`).
- `tokens/typography.ts` — `typeScale` (`display`, `title`, `heading`,
  `body`, `bodySmall`, `caption`, `overline`), each a complete
  `fontFamily`/`fontSize`/`lineHeight`/`fontWeight` style object. Headings
  use a serif (`Georgia`/`serif` via `Platform.select`), body text uses the
  platform system sans — both are system fonts, no font assets to load.
- `tokens/spacing.ts` — 4px-base scale (`xs`…`xxxl`).
- `tokens/radius.ts` — border radius scale (`sm`…`full`).
- `tokens/elevation.ts` — `lightElevation` / `darkElevation` shadow tokens
  (`none`/`low`/`medium`/`high`), each a complete `shadow*` + Android
  `elevation` style object.
- `tokens/motion.ts` — `motionDuration` (`fast`/`base`/`slow`, in ms).
  **Durations only** — no easing curves, no `Animated` usage. Nothing in
  this codebase currently plays an animation with these; they exist so a
  future animated transition has a duration to reach for instead of an
  inline magic number.
- `ThemeProvider` / `useTheme()` — a React Context (not a state management
  library) that reads `useColorScheme()` and resolves the correct token set
  into a single `Theme` object (`{ scheme, colors, typography, spacing,
  radius, elevation, motion }`). No manual light/dark toggle exists yet —
  the theme follows the OS setting only.

### `src/components/ui/` — primitives

- `AppText` — `<Text>` wrapper. `variant` picks a `typeScale` key (default
  `body`), `color` picks a semantic color role (default `primary`). Every
  piece of text in the app should render through this rather than a raw
  `<Text style={...}>`.
- `Screen` — `SafeAreaView` + padded content container, themed background.
  `centered` prop toggles a centered-content layout; `scroll` prop (added
  T-004) swaps the plain `View` for a `ScrollView` for content-heavy
  screens; `style` allows additional layout overrides (e.g. `gap`).
- `Card` — themed surface container: `surface` background, `border`,
  `radius.lg`, `spacing.lg` padding, and an `elevation` prop (default
  `low`) selecting a shadow token.
- `Button` — `Pressable` with three variants (`primary`/`secondary`/
  `ghost`), each mapping to theme colors. Press feedback is a static
  opacity change on the `pressed` state — not an `Animated` transition
  (motion tokens aren't invoked here; see the "no animations" boundary
  below).

### Wiring

- `app/_layout.tsx` wraps the root `<Stack>` in `ThemeProvider` and sets
  `Stack`'s `contentStyle` background from the theme, so screen transitions
  never flash the default white background.
- `app/(tabs)/_layout.tsx` reads `useTheme()` to color the tab bar,
  active/inactive tint, and header — so the tab shell (from T-002) is fully
  theme-aware in both light and dark.
- All four tab screens (`app/(tabs)/*.tsx`) render through `Screen` +
  `AppText` exclusively — no `StyleSheet`/raw `<View>`/`<Text>` remain in
  route files.
- `app/(tabs)/index.tsx` (T-004) is the first screen composing all four
  primitives together (`Screen`, `Card`, `Button`, `AppText`) into a real
  layout — see `.learning/T-004/` for the composition rationale.

---

## Boundary rules

- **Tokens are data, not components.** Nothing under `tokens/` imports
  React or renders anything — this is what keeps a future non-RN consumer
  (e.g. a web marketing site) able to reuse the same values.
- **`src/components/ui/` never imports a domain, puzzle type, or
  `src/services`.** Presentation-only, per `project-structure.md`.
- **No animation logic here.** `motionDuration` constants exist, but no
  component in this pass uses `Animated`/`Reanimated` — "reusable motion
  constants" was the explicit ceiling for this task; wiring them into an
  actual transition is a future task's decision.
- **No manual theme toggle.** Only the OS-level `useColorScheme()` is
  read. A user-facing light/dark override (persisted preference) would be
  application state — out of this task's scope — and belongs in a future
  Settings/Profile feature, not in `src/theme` itself.

---

## Deferred (not yet decided)

- `src/components/layout/` (structural primitives beyond `Screen`) — not
  created until a real structural need (e.g. a two-pane layout) exists.
- An icon set — deliberately not introduced; `Button`/`Tabs` are currently
  text/label-only, per T-002's own deferral.
- A manual theme override (light/dark/system picker) — requires a
  persistence mechanism, which is explicitly out of scope until a
  Settings feature is designed.
- Wiring `motionDuration` into actual animated transitions.

Full rationale and tradeoffs: `.learning/T-003/` (local-only, not part of
this repo's tracked documentation).
