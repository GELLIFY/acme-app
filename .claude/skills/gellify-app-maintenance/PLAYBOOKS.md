# PLAYBOOKS — contract changes

These apply when the change is **caller-visible**: rename, deprecate, version, remove, intentional break.

## When ADR (always check)

Write an ADR via `gellify-docs-update` when any of:
- introduces a new domain concept or entity (e.g., SPID)
- changes an irreversible architectural decision (auth scheme, transport, error model)
- adopts/drops a dependency
- changes a project-wide pattern (e.g., switching from service files to use-cases)
- locks in a contract decision callers depend on (versioning policy, deprecation window)

Skip ADR for: bugfixes, internal refactors, validator tweaks that don't change semantics, doc-only changes.

## Rename a procedure or route

1. **Decide window**: keep both names working for N releases, or hard cut? Ask user.
2. Add the new name; have it delegate to the existing implementation.
3. Mark the old name `@deprecated` with JSDoc pointing to the new name.
4. Update **all in-repo callers** (Grep for the old name across `src/`).
5. Tests: keep tests for old name (asserting it still works) + duplicate for new name. Both green.
6. Docs: changelog entry + deprecation notice.
7. ADR if this is a pattern (e.g., "we're standardizing on noun.verb naming") — otherwise skip.

## Deprecate

1. Mark `@deprecated` with JSDoc: reason + replacement + removal date.
2. Emit a `wideEvent` warning when the deprecated path is hit (helps drive callers off it).
3. Update docs with deprecation table.
4. Do NOT remove yet — schedule removal via a follow-up.

## Version (v2)

1. New file: `routers/<domain>-v2.ts` (REST) or `<domain>V2` sub-router (tRPC).
2. Mount under `/v2/...` (REST) or `<domain>V2` namespace (tRPC).
3. Share the service layer unless behavior diverges; if it diverges, create `<service>-v2.ts`.
4. v1 stays untouched and passing.
5. ADR: **required** — versioning policy is architectural.

## Break (intentional)

1. Confirm with user: any external callers? If yes, push toward version-bump instead.
2. Update validator, service, router atomically.
3. Update all in-repo callers.
4. CHANGELOG: prominent BREAKING entry.
5. ADR: **required**.
