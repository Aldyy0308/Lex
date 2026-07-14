# LexIQ — Project Structure

**Status as of this document:** structural scaffolding only. No business logic,
authentication, Supabase integration, or puzzle engine exists yet. This document
describes the empty foundation and the rules each folder will be held to once it's
implemented.

---

## 1. Executive Summary

**What was built:** the top-level folder structure for LexIQ's application code
(`src/domains`, `src/engine`, `src/puzzles`, `src/services`, `src/components`,
`src/theme`, `src/lib`, `src/config`) and this documentation directory
(`docs/Architecture`).

**Why it was built:** LexIQ's Product Vision mandates a puzzle engine that stays
completely independent of individual puzzle implementations, and business logic
that is never duplicated across puzzle types. Neither constraint can be enforced
after the fact — if engine code and puzzle-specific code start in the same folder,
nothing stops them from mixing. Establishing the folder boundaries *before* any code
exists means the first line of business logic anyone writes already has an
unambiguous home, and the dependency rules below are checkable by "does this import
cross a folder boundary it shouldn't," not by convention alone.

**Files involved:** eight new folders under `src/`, each with a single `README.md`;
this document under `docs/Architecture/`. Nothing under the existing scaffold
(`App.tsx`, `index.ts`, `app.json`, `package.json`, `tsconfig.json`) was modified —
the app's launch behavior is unchanged.

**Explicitly deferred:** `supabase/` (migrations/functions) and any per-domain
subfolders (`src/domains/auth`, `src/domains/catalog`, etc.) were left out of this
pass. They weren't named in the scope for this step, and creating them now would
mean guessing at their internal shape before the domain is actually decided.

> **Update (T-001):** `app/` (Expo Router) has since been introduced. See
> [`routing.md`](./routing.md) for the routing layer's structure and boundary
> rules.

> **Update (T-003):** `src/theme/` and `src/components/ui/` are no longer
> empty scaffolding — see [`design-system.md`](./design-system.md) for the
> token set and primitive components now implemented.

---

## 2. Architecture Walkthrough

### `src/domains/`
Business domains — Auth, Catalog, Daily Challenge, Practice, Skills, Statistics,
Progression. This is where the app answers "why does this screen exist" — session
configuration, XP transaction rules, streak calculation, what a Daily Challenge is
made of. Each domain will get its own `api/`, `hooks/`, `model/`, `components/`
subfolders when it's implemented.

*Why it exists as its own folder rather than nested under `app/` routes:* routes
change shape often (new tabs in V3, new screens as features grow); domain logic
should not have to move every time navigation is restructured.

### `src/engine/`
The Puzzle Engine — the single place that knows how to run *any* puzzle, regardless
of type. Owns the lifecycle from the Product Vision's own diagram (fetch → render →
validate → record → score → XP → analytics → explanation → progress → return),
implemented once, generically.

*Why it's separated from `src/puzzles/` even though they're tightly related:* this
is the physical enforcement of "the engine should remain completely independent from
individual puzzle implementations." As two sibling folders connected only by a
registry contract, a puzzle implementation cannot accidentally reach into engine
internals, and the engine cannot accidentally special-case a puzzle type.

### `src/puzzles/`
Puzzle type plugins. Each puzzle type (Common Link first; 23 more named in the
roadmap) is a folder here containing only what makes it unique — its renderer and
its validator.

*Why it exists:* this is where "puzzle types are implementation details, not
architecture" becomes literal. Adding puzzle type #25 means adding a folder here and
one registration line — never modifying the engine.

### `src/services/`
Infrastructure adapters — Supabase, secure storage, notifications, analytics. The
only folder allowed to import a third-party SDK or know an API key exists.

*Why it exists:* isolates the one thing in the Product Vision that could change
(the backend provider) from everything that shouldn't need to care (business rules,
UI). Domains talk to services through repository interfaces, never directly.

### `src/components/`
The shared design system. Presentation-only, reusable UI with no knowledge of
domains, puzzle types, or data sources.

*Why it exists separately from domain-specific components:* LexIQ's Product Vision
has unusually specific, consistent visual requirements (restraint, calm, editorial).
A single shared vocabulary of primitives is what keeps 24+ puzzle types and 7+
domains looking like one product instead of a collection of screens.

### `src/theme/`
Design tokens — color, typography, spacing, motion — as data, not components.

*Why it's separate from `components/`:* tokens change independently of components
(a palette adjustment shouldn't require touching every component file), and tokens
are also consumed directly by some puzzle renderers.

### `src/lib/`
Generic utilities with zero business meaning — the kind of code that could be lifted
into an unrelated project unchanged.

*Why it exists:* gives "small generic helper" an obvious home, so it doesn't
default into a domain folder and quietly become domain-coupled.

### `src/config/`
Environment configuration and feature flags.

*Why it exists:* keeps environment-dependent values (API URLs, feature toggles) out
of both business logic and infrastructure code, so neither has to know *how* a value
was sourced.

### `docs/Architecture/`
Living documentation of structural and architectural decisions — this file is the
first entry.

---

## 3. Design Decisions

### Decision: Separate `engine/` and `puzzles/` as sibling folders, not nested
- **Reason:** makes the "engine must not know puzzle-specific details" rule
  physically visible in the folder tree, not just a convention someone has to
  remember.
- **Alternatives considered:** `engine/puzzles/common-link/` (nested) — rejected
  because it makes it easy to accidentally import engine internals from a puzzle
  file; a flat `src/puzzle-types/` alongside a monolithic `src/engine.ts` — rejected
  because it doesn't scale past a handful of puzzle types.
- **Pros:** the only connection between the two is the registry's public interface;
  a new engineer can't misuse an internal they can't see.
- **Cons:** slightly more indirection to trace "how does a puzzle actually get
  rendered" compared to reading one big file.
- **Future implications:** this is the decision that makes adding puzzle type #25
  (in V2+) a pure-addition change with zero risk to the engine or other puzzle
  types.

### Decision: Domain subfolders (`auth/`, `catalog/`, etc.) not created yet
- **Reason:** your instructions explicitly excluded implementing authentication and
  the puzzle engine in this pass; pre-creating `domains/auth/` with an internal
  `api/hooks/model/components` shape would mean guessing at that domain's structure
  before it's actually built.
- **Alternatives considered:** create all seven domain folders now as empty
  placeholders — rejected as scope creep beyond what was requested, and it risks
  the placeholder structure being wrong and needing rework once real requirements
  (e.g., guest access) are settled.
- **Pros of deferring:** each domain gets structured deliberately, at the point its
  actual requirements are known.
- **Cons:** the domain-level dependency rules (e.g., "Statistics never mutates
  aggregates") are documented here and in `src/domains/README.md` but not yet
  enforced by any folder boundary.
- **Future implications:** the next foundational step will likely be creating the
  first domain (probably Auth or Catalog) with its real internal shape.

### Decision: `app/` (Expo Router) intentionally not introduced in this pass
- **Reason:** explicitly deferred per your choice — it requires a new dependency
  (`expo-router`) and a rewrite of the entry point, which is a materially different
  risk profile than adding empty folders with READMEs, and it wasn't named in your
  explicit folder list.
- **Alternatives considered:** setting it up now to match the full agreed
  architecture sooner — available as an option, deferred by your decision to keep
  this pass to pure scaffolding.
- **Pros of deferring:** this pass has zero chance of breaking the app's launch
  behavior, since the entry point was never touched.
- **Cons:** `App.tsx` at the root doesn't yet reflect where the app is headed
  structurally; a future step will need to introduce `app/` as its own reviewable
  change.
- **Future implications:** routing/navigation adoption is now a clearly-scoped,
  standalone next step rather than bundled into this one.

> **Superseded by T-001:** this deferral is resolved — `app/` now exists. See
> [`routing.md`](./routing.md).

### Decision: README.md as the placeholder file, not index.ts
- **Reason:** none of these folders export anything yet. An empty `index.ts` would
  compile successfully but imply the module is ready to be imported from, which is
  false and would invite premature, incorrect imports.
- **Pros:** a README can state the folder's rules (what belongs, what's forbidden)
  at the exact moment the boundary is created.
- **Cons:** none identified — READMEs impose no runtime or build cost.

---

## 4. Key Concepts

- **Layered architecture:** Presentation → Domains → Engine ↔ Puzzle Implementations
  → Services → Infrastructure. Each layer may only depend on the layer(s) explicitly
  listed as allowed in its README.
- **Plugin/registry pattern:** the mechanism (not yet implemented) by which the
  engine will discover puzzle types without hardcoding a list of them anywhere
  except a single bootstrap import.
- **Dependency direction:** business-logic-bearing folders (`domains/`, `engine/`,
  `puzzles/`) never import from presentation-only folders (`components/`,
  `theme/`), and never import a third-party SDK directly — only `services/` does
  that.

## 5. Common Beginner Mistakes to Avoid Here

- Putting a Supabase call directly inside a domain hook "just for now" — even
  temporarily, this creates a dependency that's easy to forget to remove, and it's
  exactly the coupling `services/` exists to prevent.
- Adding an `if (puzzleType === '...')` branch inside `src/engine/` because a new
  puzzle type "just needs one small exception" — this is the specific anti-pattern
  the engine/puzzles split is designed to make visible and uncomfortable to write.
- Putting a formatting helper that happens to format an "XP" number into `src/lib/`
  — if the function knows what XP is, it belongs in the Progression domain, not in
  generic utilities.

## 6. Interview & Discussion Questions

**Beginner**
- Why does `src/theme/` exist separately from `src/components/` if both are about
  the UI?
- What's the difference between something belonging in `src/lib/` versus a domain
  folder?

**Intermediate**
- If `src/engine/` is not allowed to import Supabase, how will it ever get a puzzle
  to render? Trace the data flow from a domain hook to the engine and back.
- Why might creating all seven `src/domains/*` subfolders right now, even empty,
  have been a worse choice than waiting?

**Senior**
- The engine and puzzle implementations are described as sibling folders connected
  only by a registry. What would have to go wrong in code review for that boundary
  to erode over time, and how would you catch it?
- `services/` is the only folder allowed to depend on infrastructure. What's the
  cost of that rule, and under what circumstance would you consider relaxing it?

**Architecture-focused**
- This structure assumes Supabase might one day be replaced. Is that a realistic
  assumption for this project, or over-engineering? What evidence would tell you
  which it is?
- The Product Vision requires puzzle validation logic to live with each puzzle
  type, not the engine. What are the limits of this contract — is there any puzzle
  mechanic you can imagine that wouldn't fit cleanly into a `render` + `validate`
  pair?
