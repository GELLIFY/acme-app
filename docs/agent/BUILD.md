# Build and run

This repo uses pnpm (packageManager pinned in package.json).

## Common commands

- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Start prod: `pnpm start`
- Typecheck: `pnpm typecheck` (runs Next.js typegen and `tsc --noEmit`)
- Lint: `pnpm lint` (Biome)
- Format: `pnpm format` (Biome)
- Tests: `pnpm test` (runs `bun test`)

## Local dev & parallel worktrees

`pnpm dev` self-provisions an isolated stack for the current git worktree:

1. A shared Postgres must be running: `docker compose up -d --wait db`.
2. The `predev` hook derives a database name from the current branch (`main_<branch>`),
   creates it in the shared Postgres if missing, runs `db:push` + `db:seed` on first
   creation, and writes `DATABASE_URL` + `BETTER_AUTH_URL` into `.env.local`.
3. The dev server runs through [portless](https://github.com/vercel-labs/portless),
   which assigns a free port and serves the app at `https://<branch>.acme.localhost`.

This lets multiple worktrees (e.g. one per agent/issue) run concurrently with no port
or data collisions. Override the Postgres base with `POSTGRES_BASE_URL`.

### One-time machine setup: portless proxy

The portless proxy binds port 443 and **must be started once per machine** before
`pnpm dev` — it cannot self-start headless (it needs sudo and a TTY):

```
sudo portless proxy start --https
```

Without portless installed, `pnpm dev` falls back to a plain `next dev` on a
deterministic per-branch port (`http://localhost:<port>`).

## Other useful scripts

- Database: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:studio`, `pnpm db:seed`
- Auth schema generation: `pnpm auth:generate`
- Email dev server: `pnpm email:dev` (port 3001)
- Clean build artifacts: `pnpm clean`
