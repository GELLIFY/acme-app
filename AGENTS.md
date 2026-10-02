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
`.github/workflows/cd/`, and the `vercel` target implements these five composite actions:

| Action | Responsibility |
|---|---|
| `provision-preview` | make this pull request's database reachable by the deployment that follows |
| `deploy-preview` | build and deploy the pull request; output `preview_url` |
| `cleanup-preview` | tear down whatever `provision-preview` and `deploy-preview` created |
| `production-env` | write the production environment into `.env`, for the migrations that run first |
| `deploy-production` | build and deploy the production branch |

The `aws` target is the exception: it has its own pipeline (one image per environment in a shared
ECR repository, an app and a worker image, `test` and `prod` environments, previews on ECS), so it
is not the same five actions. Its workflows are in `cd/aws/pipelines/` -- see below -- and its
resource names follow `PROJECT_NAME` (`ecr-<name>`, `<name>-cluster`, `ecs-<name>-<env>`), which
must match `PROJECT_NAME` in the infrastructure repository `GELLIFY/acme-app-aws`. It needs the
`AWS_ROLE_ARN` secret, the `test` and `prod` GitHub environments, and the `develop` (test) and
`main` (prod) branches. The worker is optional (generator question, `#if useWorker`): the worker
image (`Dockerfile.worker`) runs `pnpm worker`, so a project that keeps it must provide a `worker`
script, e.g. `scripts/worker.ts`.

Two rules keep that boundary intact, and both are easy to break by accident:

- **An action takes no credentials as inputs.** It reads them from the workflow-level `env:` block.
  Inputs carry only what the workflow itself knows -- the branch, the pull request number, a
  connection string. A target that needs a credential adds it to that block; it never appears in a
  `with:`.
- **Inputs are the same for every target, even the ones a given target ignores.** The AWS actions
  take a `GIT_BRANCH` they do not use, and the Vercel actions a `PR_NUMBER` they do not use, so that
  the call site is identical whichever target is active. Declare the input and say it is unused.

## Optional modules

An optional piece of the app (a Better Auth plugin, the example domain, the REST API) is a module:
a folder `src/modules/<module>/` that contributes to the app through one file per extension point,
each exporting `{ id, ... }` `as const`:

| file | contributes | registry | read by |
|---|---|---|---|
| `auth.ts` | `plugins`: Better Auth server plugins | `src/modules/auth.ts` | `src/libs/better-auth/auth.ts` |
| `auth-client.ts` | `plugins`: Better Auth client plugins | `src/modules/auth-client.ts` | `src/libs/better-auth/auth-client.ts` |
| `trpc.ts` | `routers`: tRPC routers, by key | `src/modules/trpc.ts` | `src/server/api/trpc/routers/_app.ts` |
| `rest.ts` | `routes`: `{ path, router }`, behind the protected middleware | `src/modules/rest.ts` | `src/server/api/rest/routers/_app.ts` |
| `rest-auth.ts` | `securitySchemes` and `authenticate(headers)`: a credential of the REST API, next to the session cookie | `src/modules/rest-auth.ts` | `src/server/api/rest/middleware/auth.ts`, `init.ts` (OpenAPI) |
| `schema.ts` | `tables`: Drizzle tables and relations | `src/modules/schema.ts` | `src/server/db/schema/index.ts` |
| `sign-in.tsx` | `Component`: a component of the sign-in form | `src/modules/sign-in.ts` | `src/app/[locale]/(public)/(auth)/sign-in/` |
| `account-security.tsx` | `Component`: a section of the account's Security tab, may be async | `src/modules/account-security.ts` | `src/app/[locale]/(app)/account/page.tsx` |
| `account-tab.tsx` | `value`, `Trigger`, `Component`: a tab of the account page, before Danger | `src/modules/account-tab.ts` | `src/app/[locale]/(app)/account/page.tsx` |
| `nav.ts` | `href`, `icon`, `label`: a link of the navigation bar, before the app's own | `src/modules/nav.ts` | `src/components/navbar-components/navbar.tsx` |
| `permissions.ts` | `statements`: access-control resources; `grants`: what `user`, `admin` and a new API key (`apiKey`) get | `src/modules/permissions.ts` | `src/libs/better-auth/permissions.ts`, `src/modules/api-key/auth.ts` |
| `seed.ts` | `seed(db, user)`: seed data for the default user | `src/modules/seed.ts` | `src/server/db/seed.ts` |
| `health.ts` | `label`, `url`: a health check on the home page, a URL answering `{ status: "ok" }` | `src/modules/health.ts` | `src/app/[locale]/(public)/(home)/page.tsx` |
| `user-menu.tsx` | `Component`: a client item of the user menu, before Account, shown or not by itself | `src/modules/user-menu.ts` | `src/components/auth/user-menu.tsx` |
| `overlay.tsx` | `Component`: a client component laid over every page | `src/modules/overlay.ts` | `src/app/[locale]/layout.tsx` |
| `locales.ts` | `messages`: `{ en, it }`, merged at the path they declare | `src/modules/locales.ts` | `src/shared/locales/{en,it}.ts` |

A module's tables live in its own `tables.ts`, apart from the `schema.ts` that exports them to the
registry: Drizzle's config reads `src/modules/*/tables.ts` (`drizzle.config.ts`), because drizzle-kit
reads the tables of the files it is pointed at, not the `schema` object of the index. A module that
needs a relation on a core table (`user.passkeys`) declares a second `relations(user, ...)`: Drizzle
merges them by key. A slot component loads its own data (`account-security.tsx` and
`account-tab.tsx` are server components), so the page that hosts the slot knows nothing of the
module. A REST credential takes the request's headers, not Hono's context, and answers `null` when
the request does not carry it. A page of a module cannot leave `src/app/`: the module keeps the
page's component, and the route file only re-exports it (with a `biome-ignore` for the import) and
goes with the module. Only the admin module gives a user a `role`: shared code reads it as
`"role" in user` or through `permissionsOf(user)` (no role is the `user` role), never as
`user.role`. Two modules may augment the same package's types (`@tanstack/react-table`'s
`ColumnMeta` and `TableMeta`), each in its own `react-table.d.ts`, with the package's own type
parameter names.

A registry only imports those files and lists them in one `as const` array; the shared files read
it through the helpers of `src/modules/registry.ts` and never name a module. That keeps the types:
a router of a module is in `AppRouter`, a plugin's endpoints are on `auth.api` and `authClient`.

- **One registry per extension point**, not one per module: Better Auth is part of the tRPC
  context, so one file importing both a plugin and a router is a type cycle, which TypeScript
  breaks with `any`.
- **Nothing outside `src/modules/` imports `@/modules/<module>/...`** (Biome's
  `noRestrictedImports`); a registry, `@/modules/<point>`, is fine. That is what makes removing a
  module safe: delete its folder and its line in each registry.
- **A route of a module stays under `src/app/`** (Next.js needs it there), and so does a UI
  primitive in `src/components/ui/` only the module uses (`input-otp.tsx`). Both are listed among the
  module's `files` in `gellify.template.json`; a route is also in the `includes` of Biome's override,
  so it may import its own module.
- **Validators import plain `zod`**, with OpenAPI details in `.meta({ ... })`: `@hono/zod-openapi`
  reads them from there, and it belongs to the REST module, which a project may not have. Only
  REST files import `@hono/zod-openapi` or `hono`.
- **Better Auth plugins stay a tuple** (`pluginsOf`): Better Auth reads what each plugin adds to
  the user (`twoFactorEnabled`) by walking `plugins` head to tail, and an array spread in the
  middle ends the walk.

<!-- #if isTemplate -->
## This repository is also a template

It is a working application *and* the template new ones are scaffolded from. The generator is
`create-gellify-app`, in `GELLIFY/gelly` (`packages/create-gellify-app`; `GELLIFY/create-acme-app`
is deprecated): it downloads this repository at the commit pinned in its `TEMPLATE_SOURCE` and
removes what a project declines, and `create-gellify-infra` does the same with
`GELLIFY/acme-app-aws` when the deployment target is AWS. A change here reaches new projects only
once that commit is moved forward in `gelly` (and the App's vendored CLI is refreshed).

Consequences for anyone changing this repository:

- **No `#if` marker in code.** A module is removed through the registries and the manifest (see
  "Optional modules" and the last point below). Markers remain only where there is no code: the
  workflow and action YAML, `.env.example`, `docker-compose.yml` and Markdown. The generator
  refuses a marker whose flag it does not know.

- **The steps are not marked per target, and must not be.** Two `#if`-marked copies of a step are
  both live in *this* repository -- the same step twice in one job, which GitHub refuses to load
  ("the identifier may not be used more than once"), and which would run two deployments if it did.
  So the workflows call `cd/vercel/` outright: this repository deploys to Vercel, full stop.
  Scaffolding for another target rewrites those paths to `cd/<target>/`.
- **Only the `env:` block is marked**, with `#if deployVercel` / `#if deployAws` around each
  target's variables. That is safe where a duplicated step is not: extra keys in one mapping are
  valid and inert, whereas a duplicated step id is neither. Keep it one block -- a second top-level
  `env:` key would be a duplicate mapping key.
- **The database is a second, independent question.** `#if useNeon` / `#if useExternalDatabase`
  around the preview pipeline's database steps (also in `cd/aws/pipelines/deploy-preview.yml` and
  `cleanup-preview.yml`, where `useNeon` also wraps the `delete_neon_branch` job and the Neon rows of
  the PR comments): with Neon a branch is created per pull request,
  without it the connection string comes from the `PREVIEW_DATABASE_URL` repository secret. The
  two are never both off. Nothing outside `deploy-preview.yml` and `cleanup-preview.yml` knows
  which is which -- the application talks to plain Postgres through `node-postgres` either way,
  and no Neon package is a dependency -- so keep it that way.
- **Adding a deployment target is three things**: the `cd/<target>/` directory here with its
  actions (all five for `vercel`; `aws` has its own set) and its flag in `gellify.template.json`
  (`flags`, so declining it removes the directory); the flag, the path rewrite and a smoke
  combination in `create-gellify-app`. Forgetting the generator's part produces projects whose
  workflows reference a directory that is not there.
- **The AWS pipeline lives in `cd/aws/pipelines/`.** Those workflows (`deploy-preview`,
  `deploy-production`, `cleanup-preview`, `deploy-test`, `reconcile-previews`) are inert here:
  GitHub only loads `.yml` files directly under `.github/workflows/`. Scaffolding for AWS copies
  them up, replacing the Vercel ones, instead of rewriting the `cd/vercel/` paths -- their job
  structure differs, so the path rewrite alone is not enough. Their `PROJECT_NAME` is `acme-app`
  and is replaced by the generator.
- **The worker is a third, independent question.** `#if useWorker` wraps every use of it, and
  declining it removes all of it:
  - in the workflows: `cd/aws/pipelines/` (the `build_worker` / `deploy_worker` jobs and the `needs`
    entries that point at them) and the shared AWS actions (`deploy-preview`, `cleanup-preview`: the
    worker task definition, security group, subnets and the `JOB_DRIVER` / `ECS_CLUSTER` /
    `WORKER_*` variables). Keep a `needs` list that mentions a worker job as a block list (one item
    per line), so the marked item can be dropped on its own;
  - in the application: `src/env.ts`, `.env.example` and `docker-compose.yml` (the `worker` service);
  - as whole files, under the `useWorker` flag of `gellify.template.json`: `Dockerfile.worker`, `scripts/worker.ts`,
    `scripts/direct-database-url.ts` (+ test), `src/server/services/jobs/`, and the
    `build-worker`, `build-{test,prod,preview}-worker`, `deploy-worker` and
    `deploy-{test,prod,preview}-worker` actions;
  - as JSON, which has no comments, so the manifest lists the keys: the `worker` script and the
    `@aws-sdk/client-ecs` dependency in `package.json`.

  `scripts/worker.ts` is a skeleton: the advisory lock and the poll loop are real, `findNextJob` and
  `processJob` are TODOs for the project's own queue. `configuredTaskRunner()` in
  `src/server/services/jobs/ecs-task-runner.ts` is what the code that enqueues a job calls to start
  the task under `JOB_DRIVER=ecs`.

- **What a declined module or flag removes is in `gellify.template.json`**, the generator's
  manifest (it never reaches a project): `registries` (the registry files of the table above),
  `regenerate` (paths removed from every project and rebuilt by a command: the migrations, which
  `pnpm db:generate` rewrites for the modules that are left), `templateOnly` (the template's
  files about itself, such as `src/modules/manifest.test.ts`, which checks this manifest), `modules` (for each module id: its
  folder under `src/modules/`, its other files such as its route files under `src/app/`, its `package.json` dependencies and scripts; and
  combined entries such as `example+rest`, `{ requires, files }`, for what goes when either module is
  off: the REST routes of the example domain, the REST credential of the API keys), `sharedDependencies` (a dependency kept while any of
  its modules is on) and `flags` (the same, for `deployVercel`, `deployAws`, `useWorker`). A file
  of a module or a flag goes in there, in the same pull request that adds it. The generator
  validates the manifest against its own list of modules and flags and refuses what it does not
  know, so a new module or flag also needs a change in `create-gellify-app`.

This section never reaches a generated project: it sits behind an `#if isTemplate` marker, and no
generated project sets that flag.
<!-- #endif -->

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
