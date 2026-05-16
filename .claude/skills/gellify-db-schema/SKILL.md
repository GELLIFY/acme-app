---
name: gellify-db-schema
description: Building block invoked by gellify-app-maintenance. Adds or modifies a Drizzle table in src/server/db/schema/ for the acme-app (PostgreSQL, snake_case casing, `acme_` table prefix). Defines columns, relations, indexes, and the `DB_*Type`/`DB_*InsertType` exports. Use directly only if the user scopes the task to "just the schema". Always pair with gellify-db-migration to generate the SQL migration.
---

# gellify-db-schema

Add or modify a Drizzle table.

## Contract input

If the orchestrator (or user) passed a schema contract — SQL DDL (`CREATE TABLE ...`), an existing Drizzle table snippet, a TS interface for the row, or a JSON Schema for the entity — it is **authoritative**:
- Column names, types, nullability, defaults, and constraints in the Drizzle table MUST match the contract.
- FK references and `onDelete` behavior MUST match.
- Index definitions in the contract MUST be reproduced.
- If the contract uses raw SQL types that don't map cleanly to Drizzle helpers, ask the user before substituting.
- The generated migration (`pnpm db:generate`) MUST be inspected to confirm it produces the SQL the contract implies; if it diverges, fix the Drizzle definition rather than the SQL.

## Files involved

| Path | Role |
|---|---|
| `src/server/db/schema/<name>.ts` | table + relations + types |
| `src/server/db/schema/_table.ts` | `createTable` — applies `acme_` prefix. **Do not edit.** |
| `src/server/db/schema/index.ts` | re-export — new tables must be imported here |
| `src/server/db/utils.ts` | shared `timestamps` helper |
| `drizzle.config.ts` | drizzle-kit config (`casing: "snake_case"`) |

## Conventions (extracted from `todos.ts`)

1. Use `createTable` from `./_table` — never `pgTable` directly. This applies the `acme_` prefix.
2. Use the `(d) => ({...})` callback form so column types come from the contextual `d` namespace.
3. UUID primary keys with `pg_catalog.gen_random_uuid()` default.
4. Spread `...timestamps` from `../utils`.
5. Foreign keys: `.references(() => parent.id, { onDelete: "cascade" })` — always specify `onDelete`.
6. Indexes on FK columns (third arg to `createTable`).
7. Snake_case casing handled globally — write camelCase in code; drizzle-kit emits snake_case SQL.
8. Define relations with `relations(table, ({ one, many }) => ({...}))`.
9. Export `DB_<Name>Type = typeof <table>.$inferSelect` and `DB_<Name>InsertType = typeof <table>.$inferInsert`.
10. Add to `schema/index.ts`:
    ```ts
    import * as myEntity from "./my-entity";
    export const schema = { ...auth, ...todo, ...myEntity };
    ```

## Template

[templates/table.ts.tmpl](templates/table.ts.tmpl) — extracted verbatim from `src/server/db/schema/todos.ts`.

## TDD note

Schema changes are validated by:
1. Drizzle generating the migration without errors (`pnpm db:generate`).
2. Service-level tests in `gellify-api-domain-service` exercising the new columns.

No standalone "schema test" — the test is the migration + downstream service tests.

## After this skill

Always invoke **`gellify-db-migration`** next.

## Cross-references

- `gellify-db-migration` — generate/apply
- `gellify-api-domain-service` — queries/mutations using the new columns
