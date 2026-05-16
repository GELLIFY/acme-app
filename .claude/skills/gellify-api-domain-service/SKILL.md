---
name: gellify-api-domain-service
description: Building block invoked by gellify-app-maintenance. Creates or edits domain service files under src/server/domains/<name>/ in the acme-app — service.ts (public API consumed by routers), queries.ts (read), mutations.ts (write), helpers.ts (pure utilities). Use directly only if the user scopes the task to "just the service/business-logic layer".
---

# gellify-api-domain-service

The domain layer between routers and Drizzle. Routers (tRPC + REST) consume only `<domain>-service.ts` — never `queries.ts` / `mutations.ts` directly.

## File convention

| File | Purpose | Example |
|---|---|---|
| `<domain>-service.ts` | Public functions. Composes queries + mutations + helpers. Annotated `"server-only";` | `todo-service.ts` |
| `queries.ts` | Drizzle reads. Pure DB. `"server-only";` | `queries.ts` |
| `mutations.ts` | Drizzle writes. Pure DB. `"server-only";` | `mutations.ts` |
| `helpers.ts` | Pure functions (no DB). Easily unit-testable. | `helpers.ts` |
| `<domain>-service.test.ts` | Integration tests against real DB | `todo-service.test.ts` |
| `helpers.test.ts` | Pure unit tests | `helpers.test.ts` |

## TDD workflow (use the `tdd` skill)

1. **Locate** the domain folder. Edit-mode: extend existing service function. New-mode: scaffold all four files.
2. **Test list** — service-level tests against real DB (see pattern below). Propose to user, get confirmation.
3. **Red** → `pnpm test`.
4. **Green** → implement query/mutation/helper + service composition.
5. Refactor with `simplify` if helpful. `pnpm lint && pnpm typecheck`.

## Test pattern (extracted from `todo-service.test.ts`)

```ts
import { beforeEach, expect, test } from "bun:test";
import { randomUUIDv7 } from "bun";
import { db } from "@/server/db";
import { user as userTable } from "@/server/db/schema/auth-schema";

const userId = randomUUIDv7();

beforeEach(async () => {
  await db
    .insert(userTable)
    .values({ id: userId, email: "test@test.com", name: "test" })
    .onConflictDoNothing();
});

test("creates and lists", async () => {
  // direct call to service function
});
```

Service tests hit the real DB. No mocks. If the FK chain requires parent rows, seed them in `beforeEach` with `onConflictDoNothing`.

## Templates

- [templates/service.ts.tmpl](templates/service.ts.tmpl) — extracted from `todo-service.ts`
- [templates/queries.ts.tmpl](templates/queries.ts.tmpl) — extracted from `queries.ts`
- [templates/mutations.ts.tmpl](templates/mutations.ts.tmpl) — extracted from `mutations.ts`

## Signature convention

All service functions take `(db: DBClient, input: z.infer<typeof XSchema>, userId: string)` so:
- routers pass `ctx.db` (or `c.get("db")`) and `ctx.session.user.id` (or `c.get("userId")`) directly,
- userId scoping is explicit at the type level — easy to audit for IDOR.

`queries.ts` / `mutations.ts` take their own request type that already includes `userId` — see template.

## Cross-references

- `tdd`
- `engineering:write-tests`
- `simplify` — after green

## After green

- Routers: invoke `gellify-api-trpc-procedure` and/or `gellify-api-rest-route` to wire the new/changed service functions in.
- Then `gellify-docs-update`.
