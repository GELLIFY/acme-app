---
status: accepted
---

# Standard Postgres with a database-per-worktree for local parallelism

The app connects to a single standard Postgres instance through `DATABASE_URL` using the `node-postgres` driver, with no environment-specific branching in the database client — local and production share one code path.

To let multiple coding agents work the same machine concurrently, each git worktree is isolated at the **database** level rather than by running a separate database server: one shared Postgres holds a database per worktree (`main_<branch>`), and the web tier is fronted by [portless](https://github.com/vercel-labs/portless), which gives each worktree a stable `https://<branch>.acme.localhost` URL and an auto-assigned port. A `predev` hook provisions the per-worktree database (create-if-missing, then migrate + seed on first run) and writes the dynamic `DATABASE_URL` / `BETTER_AUTH_URL` into `.env.local`.

## Consequences

- One database client path everywhere; no edge/serverless HTTP driver. The app must run as a long-running Node server (`output: "standalone"`), which it does.
- Worktree databases live in one Postgres process, so watch `max_connections` against the combined connection-pool size as the number of concurrent worktrees grows.
- Orphaned `main_<branch>` databases accumulate when worktrees are removed and need periodic cleanup.
