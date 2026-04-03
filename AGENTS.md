# AGENTS.md

## Project overview

Acme App is a Next.js 16 app built on the GELLIFY Stack for full-stack TypeScript with tRPC, Hono, Drizzle, and Better Auth.

## Essentials

- Package manager: pnpm (scripts in package.json)
- Build and run: docs/agent/BUILD.md
- Code style: docs/agent/CODE_STYLE.md
- Testing: docs/agent/TESTING.md
- Security: docs/agent/SECURITY.md
- PRs: docs/agent/PR.md

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "working on the React Query tRPC client in src/libs/trpc/client.tsx or src/libs/trpc/server.tsx"
    load: "node_modules/@trpc/tanstack-react-query/skills/react-query-setup/SKILL.md"
  - task: "adding or changing routers and procedures in src/server/api/trpc/routers"
    load: "node_modules/@trpc/server/skills/server-setup/SKILL.md"
  - task: "changing auth or base procedures in src/server/api/trpc/init.ts or src/server/api/trpc/middleware"
    load: "node_modules/@trpc/server/skills/auth/SKILL.md"
  - task: "changing tRPC middleware composition in src/server/api/trpc/init.ts or src/server/api/trpc/middleware"
    load: "node_modules/@trpc/server/skills/middlewares/SKILL.md"
  - task: "changing tRPC input or output validation on procedures"
    load: "node_modules/@trpc/server/skills/validators/SKILL.md"
  - task: "changing SuperJSON or tRPC link configuration between client and server"
    load: "node_modules/@trpc/client/skills/superjson/SKILL.md"
<!-- intent-skills:end -->

<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->
