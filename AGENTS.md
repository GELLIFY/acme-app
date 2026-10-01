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

<!-- #if isTemplate -->
## This repository is also a template

It is a working application *and* the template new ones are scaffolded from. The generator lives in
its own repository, `GELLIFY/create-acme-app`, and it scaffolds this repository together with the
infrastructure repository `GELLIFY/acme-app-aws` when the deployment target is AWS.

Two consequences for anyone changing this repository:

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
- **Adding a deployment target is three things**, and two of them live in `create-acme-app`: the
  `cd/<target>/` directory here with its actions (all five for `vercel`; `aws` has its own set); the target listed in that generator's
  `featureFiles`, so declining it removes the directory; and the path rewrite plus a row in its
  `scaffold` matrix. Forgetting any of the last two produces a generator that emits projects whose
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
  - as whole files, for the generator's `featureFiles`: `Dockerfile.worker`, `scripts/worker.ts`,
    `scripts/direct-database-url.ts` (+ test), `src/server/services/jobs/`, and the
    `build-worker`, `build-{test,prod,preview}-worker`, `deploy-worker` and
    `deploy-{test,prod,preview}-worker` actions;
  - as JSON, which has no comments, so the generator removes the keys: the `worker` script and the
    `@aws-sdk/client-ecs` dependency in `package.json`.

  `scripts/worker.ts` is a skeleton: the advisory lock and the poll loop are real, `findNextJob` and
  `processJob` are TODOs for the project's own queue. `configuredTaskRunner()` in
  `src/server/services/jobs/ecs-task-runner.ts` is what the code that enqueues a job calls to start
  the task under `JOB_DRIVER=ecs`.

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
