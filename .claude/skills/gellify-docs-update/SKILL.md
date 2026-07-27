---
name: gellify-docs-update
description: Building block invoked at the end of every gellify-app-maintenance run. Updates project documentation in docs/ for the acme-app and, when the change is architectural, writes an ADR in docs/adr/. Markdown-first. Use directly when the user says "update docs", "document this change", "write an ADR", or after any code change that affects API contracts, domain concepts, or project-wide patterns.
---

# gellify-docs-update

Final step of every change. Two surfaces: **markdown docs** (always) and **ADR** (sometimes).

## Existing docs layout

```
docs/
├── agent/            # Agent-facing guidance (BUILD, CODE_STYLE, PR, SECURITY, TESTING)
├── auth.md
├── logs.md
├── metrics.md
└── otel.md
```

No ADR folder exists yet — create `docs/adr/` on first use.

## Decision: ADR or just markdown?

Ask: *"Is this change architectural?"* Yes when any of:
- new domain concept or entity (e.g., SPID, audit-log)
- new dependency added or dependency removed
- change to project-wide pattern (service files → use-cases, error-model change, etc.)
- contract/versioning decision callers depend on
- irreversible decision (auth scheme, transport, data model)

No when:
- bugfix, internal refactor
- adding a field to an existing entity (unless the field itself is a new concept)
- validator tweaks that don't change semantics
- doc-only changes

Default: **no ADR**. Tip toward writing one only when you can name what *future readers* will need to know in 6 months.

## Markdown updates (always)

For API changes, find/create the doc that lives closest to the domain:
- if a `docs/<domain>.md` exists → update it
- otherwise create one, linked from the appropriate index

What to include:
- one-paragraph description of the change
- new fields / new endpoints / changed behavior
- breaking notes (if any) — clearly marked
- examples (curl for REST, tRPC call for tRPC)
- link to the ADR (if one was written)

For REST, note that **Scalar** at `/api/rest/scalar` is auto-generated from OpenAPI — markdown docs cover the *why*, Scalar covers the *how*.

## ADR — when needed

1. Create `docs/adr/` if missing.
2. Pick the next number: `NNNN-kebab-title.md` (e.g., `0001-api-versioning-policy.md`).
3. Use [templates/adr.md.tmpl](templates/adr.md.tmpl) (MADR-lite: Context / Decision / Consequences).
4. Cross-link: add a link from the relevant `docs/<domain>.md` and from `docs/agent/` if it affects agent guidance.

## After writing

If the change affects how agents should work (e.g., a new convention), also update the relevant file in `docs/agent/` (CODE_STYLE, TESTING, SECURITY, PR, BUILD) — or update `AGENTS.md` / `CLAUDE.md` if cross-cutting.

## Cross-references

- `grill-with-docs` — if the user wants a stress-test of the doc/ADR before finalising
- `improve-codebase-architecture` — references `docs/adr/` for future improvement runs
