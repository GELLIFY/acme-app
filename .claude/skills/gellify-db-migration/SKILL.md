---
name: gellify-db-migration
description: Building block invoked by gellify-app-maintenance. Generates, reviews, applies, and (when needed) rolls back Drizzle migrations for the acme-app. Wraps drizzle-kit commands (db:generate, db:migrate, db:push, db:studio) and enforces a destructive-change review step. Use directly only if the user scopes the task to "just migrations".
---

# gellify-db-migration

Generate and apply Drizzle migrations from `src/server/db/schema/`.

## Commands (from package.json)

| Command | Use when |
|---|---|
| `pnpm db:generate` | Schema changed → emit SQL migration file in `src/server/db/migrations/` |
| `pnpm db:migrate` | Apply pending migration files to the configured DB |
| `pnpm db:push` | Dev-only: push schema directly without a migration file. **Never use against prod-like DBs.** |
| `pnpm db:studio` | Browse the DB |
| `pnpm db:seed` | Run `src/server/db/seed.ts` |

## Workflow

1. After `gellify-db-schema` finishes editing schema files, run `pnpm db:generate`.
2. **Inspect the generated `.sql`** before doing anything else. Look for:
   - `DROP COLUMN` / `DROP TABLE` — confirm with user before proceeding
   - `ALTER COLUMN ... SET NOT NULL` on a populated column — risk of failure; needs backfill
   - renames that drizzle-kit detected as drop+create — verify intent
3. If anything in (2) trips: pause, present the diff and a safer plan to the user.
4. Apply: `pnpm db:migrate`.
5. Re-run service tests (`pnpm test`) to confirm green against the new schema.
6. Update `seed.ts` if new tables need seed data.

## Destructive-change protocol

Drizzle migrations are forward-only by default. Before applying any of:
- column drop
- table drop
- type narrowing (varchar(256) → varchar(64))
- NOT NULL on existing nullable column without default
- unique constraint on existing data

→ Confirm with user. Offer a **two-step** alternative when feasible: deploy code that tolerates both shapes, migrate data, then deploy the destructive migration.

## Rollback

There's no built-in `down`. To revert:
1. Manually craft a reverse `.sql`, or
2. Edit schema back to previous state + `pnpm db:generate` to produce the inverse migration.

Either way: review carefully before applying.

## Cross-references

- `gellify-db-schema` — the previous step in the chain
- `gellify-api-domain-service` — queries/mutations may need updates to match new columns
