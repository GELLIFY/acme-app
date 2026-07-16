# Acme App

The GELLIFY Stack is a modern web development stack designed for simplicity, modularity, and full-stack TypeScript safety. Created and refined by [Matteo Badini↗](https://x.com/badini_matteo) and the GELLIFY team, it brings together battle-tested technologies to help developers build scalable, maintainable, and performant applications with minimal friction. Please refer to the [official documentation↗](https://gellify.dev)

Built with Next.js 16, TypeScript, tRPC, Hono, Drizzle, Better Auth and Shadcn.

## Prerequisites

Before you begin, make sure you have the following:

- [`fnm`↗](https://github.com/Schniz/fnm) ➡️ Node version manager (the repo pins Node `24.15.0` in `.nvmrc`)
- [`pnpm`↗](https://pnpm.io) ➡️ package manager (version pinned in `package.json`)
- [`docker`↗](https://www.docker.com/) ➡️ runs the local Postgres database via `docker-compose.yml`
- [`bun`↗](https://bun.sh/) ➡️ test runner (`pnpm test` runs `bun test`)
- [`portless`↗](https://github.com/vercel-labs/portless) (optional) ➡️ serves each worktree at its own `https://<branch>.localhost` URL

## Getting started

Install dependencies:

```sh
pnpm install
```

Create your environment file from the example and fill in the required secrets
(at minimum `BETTER_AUTH_SECRET` and `RESEND_API_KEY`):

```sh
cp .env.example .env
```

You do **not** need to set `DATABASE_URL` for local development — `pnpm dev`
auto-writes a per-worktree `DATABASE_URL` and `BETTER_AUTH_URL` to `.env.local`
(which overrides `.env`), pointing at a database named after your current git
branch. See [`docs/agents/build.md`](docs/agents/build.md) for details.

### Database

The local Postgres runs in Docker (one shared instance for all worktrees). Start it:

```sh
docker compose up -d --wait db
```

Then start the dev server:

```sh
pnpm dev
```

On first run for a branch, the `predev` hook creates the branch database, applies
migrations (`pnpm db:migrate`) and seeds it (`pnpm db:seed`). Use the URL printed
by `pnpm dev` — in the portless path the app is **not** served at `localhost:3000`.

The seed creates a default local login:

- Email: `matteo.badini@gellify.com`
- Password: `password`

### One-time machine setup: portless proxy

If you use portless, its proxy binds port 443 and must be started once per machine
before `pnpm dev` (it needs sudo and a TTY, so it cannot self-start):

```sh
sudo portless proxy start --https
```

Without portless installed, `pnpm dev` falls back to a plain `next dev` on a
deterministic per-branch port.

## More

See [`docs/agents/`](docs/agents/) for build, database and testing details, and
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the contribution workflow.
</content>
</invoke>
