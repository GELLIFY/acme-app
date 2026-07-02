# Database

Use these rules before changing schema, migrations, or seed data.

## Drizzle schema and migrations

- Drizzle schema lives in `src/server/db/schema`.
- Migrations live in `src/server/db/migrations`.
- For schema changes, update the Drizzle schema first, then run `pnpm db:generate`.
- Commit the generated SQL migration and migration metadata with the schema change.
- Apply migrations with `pnpm db:migrate`.

## Avoid db push

`pnpm db:push` is a last resort — do not use it for normal schema work. The
`predev` first-time worktree provisioning path runs `pnpm db:migrate` (not push),
so a fresh branch database is built by applying the committed migration files
exactly as production is. This also validates a branch's new migration against an
empty database before it merges.

## Env loading for db tooling

`drizzle-kit` (migrate/push/studio) and the `tsx` seed scripts load env through
`src/load-env.ts`, which mirrors `next dev` precedence: `.env.local` overrides
`.env`. This is what makes `pnpm db:migrate` / `db:seed` / `db:studio` target the
**current worktree's** branch database (written to `.env.local` by `predev`)
rather than the shared `main` database in `.env`. Real `process.env` still wins,
so the explicit `DATABASE_URL` that `provision-db.ts` injects is preserved.

## Seed data

`pnpm db:seed` resets and seeds local data. It creates a default credential user:

- Email: `matteo.badini@gellify.com`
- Password: `password`

Use this account for local manual testing after seeding.

## Integration tests

Database integration tests should rely on `src/tests/testing-db.ts`. That helper
mocks the app database with in-memory PGlite, applies migrations before each
test, seeds a fixed test user, and resets state after each test.
