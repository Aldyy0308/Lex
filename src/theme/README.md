# Theme

Design tokens: color, typography, spacing, motion. The single source of truth for
LexIQ's visual language — minimalism, editorial aesthetics, a soft palette, restrained
motion, dark mode support.

Pure data/constants. No business logic, no components.

## Status
Implemented (T-003). Tokens live under `tokens/` (`colors`, `typography`,
`spacing`, `radius`, `elevation`, `motion`) as plain data — no components. Both
a light and dark `ColorPalette` are defined. `ThemeProvider`/`useTheme` (React
Context, not a state management library) read the OS color scheme via
`useColorScheme()` and expose the resolved `Theme` object to the component
tree. See `docs/Architecture/design-system.md` for the full rationale.
