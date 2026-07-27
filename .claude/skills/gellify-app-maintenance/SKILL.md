---
name: gellify-app-maintenance
description: Single entry point for ANY change to the acme-app (GELLIFY Stack — Next.js + tRPC + Hono + Drizzle + Better Auth). Analyzes the user's request, plans the layers touched (DB → migration → service → router → docs), and dispatches to the right building-block skills with a TDD-first loop. Use when the user wants to create, evolve, edit, rename, deprecate, or version any API, business logic, database table, or domain service. Triggers: "add/change/edit/update/create/remove ... API/endpoint/procedure/route/field/table/migration/service".
---

# gellify-app-maintenance

Central orchestrator. The user describes a change in natural language; this skill **plans, confirms, dispatches, and finalises with docs**. Sub-skills (`gellify-api-*`, `gellify-db-*`, `gellify-docs-update`) are building blocks — do not invoke them directly unless this skill says to.

## Three phases

### 1. Intake & analysis (no code)

1. Read the request. Locate every affected file using Grep/Glob — table in `src/server/db/schema/`, validator in `src/shared/validators/`, service in `src/server/domains/<name>/`, router in `src/server/api/trpc/routers/` and/or `src/server/api/rest/routers/`.
2. **Check for an input contract.** If the user pasted/attached any of:
   - OpenAPI / JSON Schema fragment
   - Zod schema snippet
   - tRPC procedure signature
   - SQL DDL (`CREATE TABLE ...`)
   - Drizzle table snippet
   - TypeScript interface / type alias describing inputs or outputs

   → treat it as **authoritative**. Do not invent field names, types, or response shapes that contradict it. If the contract is ambiguous or partial, ask the user to fill the gap rather than guessing. Pass the contract verbatim to the relevant building block in the dispatch step.
3. Classify the change using [DISPATCH.md](DISPATCH.md):
   - **New endpoint** / **Edit existing** / **Contract change (rename/deprecate/version/break)**
   - tRPC, REST, or **both** (if both surfaces exist for the domain, change both unless user says otherwise)
4. If the surface is unclear AND the user didn't specify, ask **once**: *"tRPC procedure, REST endpoint, or both?"* Default: whatever already exists for that domain.
5. Build a **layer plan**:

   | Layer | Touch? | Sub-skill |
   |---|---|---|
   | DB schema (`src/server/db/schema/`) | y/n | `gellify-db-schema` |
   | Migration (`drizzle-kit generate`) | y/n | `gellify-db-migration` |
   | Validator (`src/shared/validators/`) | y/n | inline in this skill |
   | Domain service (`src/server/domains/<name>/`) | y/n | `gellify-api-domain-service` |
   | tRPC router | y/n | `gellify-api-trpc-procedure` |
   | REST router | y/n | `gellify-api-rest-route` |
   | Docs / ADR | always | `gellify-docs-update` |

6. Draft a **test list** — concrete `describe/it` names per affected layer (happy path, validation, auth/permission, edge cases). Pattern: see `src/server/domains/todo/todo-service.test.ts` and `src/server/api/rest/routers/todos-routes.test.ts`.

### 2. Confirmation gate (blocking)

Present to user:
- the file-level plan
- the test list
- whether an ADR is recommended (see [PLAYBOOKS.md](PLAYBOOKS.md) → "When ADR")

Ask: *"Accept the plan and test list, edit them, or supply your own test cases?"* **Do not proceed without explicit acceptance.**

### 3. TDD dispatch loop

For each layer in dependency order (DB → migration → validator → service → router):

> Validator before service: domain service signatures are typed from validator schemas (`z.infer<typeof ...Schema>`), so the Zod schema must exist before the service layer compiles.

1. Invoke the matching sub-skill.
2. **Red first**: write failing tests using `bun:test` imports (see existing tests). Run `pnpm test` (the script invokes `bun test`) — confirm red.
3. **Green**: implement until green.
4. Run `pnpm lint` and `pnpm typecheck`.
5. (Optional) Invoke `simplify` skill on changed files.

Always end with `gellify-docs-update`. ADR if the change matches the triggers in PLAYBOOKS.md.

## Cross-skill references

- TDD loop details → use the **`tdd`** skill (don't redefine it here)
- Test conventions → **`engineering:write-tests`**
- `wideEvent` enrichment → **`logging-best-practices`** (procedures expose `ctx.wideEvent`, REST routes use `c.set("wideEvent", ...)`)
- Auth/permissions changes → **`better-auth-best-practices`**
- Route handler / Next.js concerns → **`next-best-practices`**
- tRPC internals → `node_modules/@trpc/server/skills/{server-setup,auth,middlewares,validators}/SKILL.md`

## See also

- [DISPATCH.md](DISPATCH.md) — decision tables and worked examples
- [PLAYBOOKS.md](PLAYBOOKS.md) — rename / deprecate / version / break
