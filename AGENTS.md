# AGENTS.md

## Project overview

Acme App is a Next.js 16 full-stack app built with TypeScript, tRPC, Hono, Drizzle, Better Auth and Shadcn.

## Essentials

- Package manager: pnpm (scripts in package.json)
- For setup, dev server, build, and local URLs, read `docs/agents/build.md`.
- For database schema, Drizzle migrations, and seed data, read `docs/agents/database.md`.
- For unit, integration, and UI unit testing, read `docs/agents/testing.md`.
- For domain language and decisions, read `CONTEXT.md` and relevant ADRs in `docs/adr/`.

## Agent skills

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Product design

For UI/UX/copy/visual decisions and the "estratto-conto" ledger idiom, load the `product-design`
skill (`.agents/skills/product-design/`) — it is the canonical base documentation for product design
(STANDARDS, surfaces, exemplars). Set a request-mode first; Review is flag-only.

## Deployment

The three CD workflows -- `deploy-preview.yml`, `cleanup-preview.yml`, `deploy-production.yml` --
know *when* to deploy and nothing about *where*. The target is a directory under
`.github/workflows/cd/`, and every target implements the same five composite actions:

| Action | Responsibility |
|---|---|
| `provision-preview` | make this pull request's database reachable by the deployment that follows |
| `deploy-preview` | build and deploy the pull request; output `preview_url` |
| `cleanup-preview` | tear down whatever `provision-preview` and `deploy-preview` created |
| `production-env` | write the production environment into `.env`, for the migrations that run first |
| `deploy-production` | build and deploy the production branch |

Two rules keep that boundary intact, and both are easy to break by accident:

- **An action takes no credentials as inputs.** It reads them from the workflow-level `env:` block.
  Inputs carry only what the workflow itself knows -- the branch, the pull request number, a
  connection string. A target that needs a credential adds it to that block; it never appears in a
  `with:`.
- **Inputs are the same for every target, even the ones a given target ignores.** The AWS actions
  take a `GIT_BRANCH` they do not use, so that the call site is identical whichever target is
  active. Declare the input and say it is unused.

`cd/vercel/` predates both rules -- it takes its token as an input and implements three of the five
actions -- and the workflows here call `cd/aws/`. Bring it up to the contract before deploying this
branch to Vercel again.


<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->
