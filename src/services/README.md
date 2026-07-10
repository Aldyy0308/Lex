# Services

Infrastructure adapters — the only layer permitted to know about external systems:
Supabase, secure token storage, push notifications, analytics providers.

Domains and the engine reach infrastructure only through repositories/interfaces
defined here. This is what lets domain logic (streak rules, scoring rules) be tested
without a live backend, and what would let a backend be swapped without touching
business logic.

## Status
No services are implemented yet. Supabase integration is explicitly out of scope for
this pass.
