---
name: gellify-api-trpc-procedure
description: Building block invoked by gellify-app-maintenance. Creates or edits a tRPC procedure in src/server/api/trpc/routers/ in the acme-app. Wires validator → service → procedure with auth/permissions and wideEvent enrichment. Use directly only if the user explicitly scopes the task to "just the tRPC layer". Otherwise prefer gellify-app-maintenance.
---

# gellify-api-trpc-procedure

Add or edit a tRPC procedure following the acme-app conventions.

## Contract input

If the orchestrator (or user) passed an interface contract (Zod, TS type, OpenAPI fragment, tRPC signature), it is **authoritative**:
- The validator in `src/shared/validators/<domain>.schema.ts` MUST match the contract field-for-field.
- The procedure return shape MUST match the contract's output type.
- If the contract is partial (e.g., only inputs given), still match what's given exactly; ask before inventing the rest.
- Tests in the test list MUST cover every required field and every documented error case from the contract.

## Files involved

| Path | Role |
|---|---|
| `src/server/api/trpc/routers/<domain>.ts` | router with procedures |
| `src/server/api/trpc/routers/_app.ts` | mount new routers here |
| `src/server/api/trpc/init.ts` | `publicProcedure` / `protectedProcedure` / `adminProcedure` |
| `src/shared/validators/<domain>.schema.ts` | Zod inputs (use `@hono/zod-openapi` z when also exposed via REST) |
| `src/server/domains/<domain>/<domain>-service.ts` | business logic |

## TDD workflow (use the `tdd` skill)

1. **Locate** existing files. Edit-mode: reuse the existing router, validator, service. New-mode: create them.
2. **Test list** — propose to user, get confirmation. Pattern: `src/server/domains/<domain>/<domain>-service.test.ts` (service-level) — tRPC procedures are typically tested via service tests; only add a router test if the procedure has non-trivial branching beyond what the service tests cover. Use `createCaller` from `_app.ts` for direct router tests.
3. **Red** → `pnpm test` confirms failures.
4. **Green** → implement validator + service + procedure.
5. `pnpm lint && pnpm typecheck`.

## Procedure template

See [templates/router.ts.tmpl](templates/router.ts.tmpl) — annotated, extracted from `src/server/api/trpc/routers/todo.ts`.

## Pick the right procedure base

- **`publicProcedure`** — unauthenticated. Health, public read-only.
- **`protectedProcedure`** — most common. Auth required; `ctx.session.user.id` available.
- **`adminProcedure`** — admin role required.

## wideEvent enrichment

Every procedure should attach business context to `ctx.wideEvent` for canonical log lines. See `logging-best-practices` skill. Pattern:

```ts
.query(async ({ ctx: { db, session, wideEvent }, input }) => {
  const res = await getTodos(db, input, session.user.id);
  wideEvent.todos = { todo_count: res.length };
  return res;
})
```

## Mounting (new router only)

Edit `src/server/api/trpc/routers/_app.ts`:

```ts
import { myRouter } from "./my";
export const appRouter = createTRPCRouter({
  // ...existing
  my: myRouter,
});
```

## Cross-references

- `tdd` skill — red-green-refactor
- `engineering:write-tests` — test conventions
- `logging-best-practices` — `wideEvent` structure
- `better-auth-best-practices` — when auth/permissions change
- `node_modules/@trpc/server/skills/server-setup/SKILL.md` — router fundamentals
- `node_modules/@trpc/server/skills/auth/SKILL.md` — when changing auth procedures
- `node_modules/@trpc/server/skills/validators/SKILL.md` — input/output validators
- `node_modules/@trpc/server/skills/middlewares/SKILL.md` — middleware composition

## After green

- Hand back to `gellify-app-maintenance` (or invoke directly): `gellify-docs-update`.
