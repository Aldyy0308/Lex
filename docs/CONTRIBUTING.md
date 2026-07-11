# Development Workflow

This document is the canonical source of truth for how engineering work on LexIQ
is conducted — by a human contributor or an AI agent (Claude Code or otherwise).
It is checked into the repository so anyone continuing this project has full
context without needing access to prior conversations or any external memory
system. If a standing rule or convention changes, update this file — do not rely
on chat history or an agent's memory to carry it forward.

## Mode

LexIQ development runs in **Development Mode** by default:

- Chat/PR responses stay concise. Effort goes into implementation, not narration.
- Features are implemented incrementally.
- Architecture is treated as already reviewed — do not reopen architecture
  discussions unless explicitly asked. See `docs/Architecture/` for the current
  structural decisions.
- Optimize for development velocity without sacrificing code quality.

## Task completion checklist

Every engineering task is done only when all of the following are true:

1. The requested feature/change is implemented.
2. The application still runs (verified, not assumed).
3. Repository documentation is updated where appropriate (this file,
   `docs/Architecture/`, folder `README.md`s, etc.) — conventions and decisions
   live here, not in chat or agent memory.
4. Learning documentation is generated under a local `.learning/` directory (see
   below).

### Report format

When reporting a completed task, state only:

- What was implemented
- Files changed
- Documentation generated
- Tests performed
- Ready for review

Skip further explanation unless explicitly asked for it.

## `.learning/` directory

`.learning/` is a personal, local-only knowledge base — **gitignored**, never
pushed. Create it (and a per-task subfolder) if it doesn't already exist. Each
task gets an entry covering:

- Executive Summary
- Deep Technical Walkthrough
- Architecture Decisions
- Tradeoff Analysis
- Concepts Introduced
- Future Extension Points
- Interview Questions
- Common Mistakes
- Relevant React Native / TypeScript / Expo concepts
- Suggested follow-up study topics

Write it assuming the reader (the project owner) may return to it months later
having forgotten the implementation details. Do not reproduce this content in
chat unless explicitly asked to explain.

## Source of truth

The repository — this file, `AGENTS.md`, `docs/Architecture/`, and in-code
comments/READMEs — is the single source of truth for standing rules and
conventions. Any AI assistant's memory/notes are, at most, a pointer back to
these files, never a substitute for them. When a convention changes, update the
relevant repo file in the same change, so the repo stays self-sufficient for the
next contributor (human or AI) with no prior context.
