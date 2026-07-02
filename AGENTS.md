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
