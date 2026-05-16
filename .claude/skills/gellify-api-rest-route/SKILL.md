---
name: gellify-api-rest-route
description: Building block invoked by gellify-app-maintenance. Creates or edits a Hono OpenAPI route in src/server/api/rest/routers/ in the acme-app. Wires validator → service → route with required-permissions middleware, full OpenAPI response set (200/401/403/404/422/500), and Scalar docs. Use directly only if the user explicitly scopes the task to "just the REST layer".
---

# gellify-api-rest-route

Add or edit a Hono OpenAPI route following the acme-app conventions.

## Contract input

If the orchestrator (or user) passed an OpenAPI fragment, Zod schema, or path/method/response definition, it is **authoritative**:
- Validators MUST match the contract's request shapes (path/query/body) exactly.
- Response schemas (`<domain>ResponseSchema`) MUST match the contract's response payload.
- Status codes declared in the contract MUST appear in the `responses` map; the standard 401/403/422/500 set is added on top.
- `path`, `method`, `operationId`, `tags` come from the contract when specified.
- Tests MUST cover each declared response status.

## Files involved

| Path | Role |
|---|---|
| `src/server/api/rest/routers/<domain>-routes.ts` | route definitions |
| `src/server/api/rest/routers/_app.ts` | mount new routers + middleware order |
| `src/server/api/rest/init.ts` | global Hono app + OpenAPI doc + Scalar |
| `src/server/api/rest/middleware/` | `withRequiredPermissions`, auth, db, wideEvent |
| `src/server/api/rest/utils/` | `createRouter`, error schemas |
| `src/shared/validators/<domain>.schema.ts` | Zod inputs (must use `@hono/zod-openapi` z) |
| `src/server/domains/<domain>/<domain>-service.ts` | business logic |
| `src/app/api/rest/[...rest]/route.ts` | Next.js entry — usually no edits |

## TDD workflow (use the `tdd` skill)

1. **Locate** files. Edit-mode: reuse router file. New-mode: create `<domain>-routes.ts` + matching test file.
2. **Test list** — propose to user. Pattern: `src/server/api/rest/routers/todos-routes.test.ts` using `testClient` + `OpenAPIHono`. Cover:
   - validation error → 422
   - happy path → 200/201/204
   - not-found → 404
   - permission missing → 403 (if applicable)
3. **Red** → `pnpm test` confirms failures.
4. **Green** → implement validator + service + route.
5. `pnpm lint && pnpm typecheck`.

## Route template

See [templates/route.ts.tmpl](templates/route.ts.tmpl) — annotated, extracted from `src/server/api/rest/routers/todos-routes.ts`. Covers GET-list / GET-by-id / POST / PATCH / DELETE.

## Mandatory response codes

Every route must declare schemas for the codes it can return. From the codebase pattern:

| Code | Schema helper | When |
|---|---|---|
| 200/201/204 | your `<domain>ResponseSchema` | success |
| 401 | `unauthorizedSchema()` | always |
| 403 | `forbiddenSchema()` | when `withRequiredPermissions` is used |
| 404 | `notFoundSchema("<entity> not found")` | when fetching by id |
| 422 | `createErrorSchema(<inputSchema>)` | when there's path/body/query validation |
| 500 | `internalServerErrorSchema()` | recommended on read routes |

## Permissions middleware

Use `withRequiredPermissions({ <resource>: ["<action>"] })`. Match the resource/action names defined in Better Auth permissions config. See `better-auth-best-practices` skill if permissions are unfamiliar.

## Validator must use `@hono/zod-openapi`

The schemas need `.openapi({ description, example, param })` annotations so Scalar renders the API docs. Import:

```ts
import { z } from "@hono/zod-openapi";
```

NOT plain `zod`. If the schema is shared with tRPC, this z is compatible.

## Mounting (new router only)

Edit `src/server/api/rest/routers/_app.ts` — note middleware order matters:

```ts
const routers = createRouter()
  .use(...publicMiddleware)
  .route("/health", healthRouter)           // public
  .use(...protectedMiddleware)
  .route("/todos", todosRouter)             // protected
  .route("/my-new-resource", myRouter);     // protected
```

## Cross-references

- `tdd` skill
- `engineering:write-tests`
- `logging-best-practices` — `c.set("wideEvent", ...)` or `c.get("wideEvent")` enrichment
- `better-auth-best-practices` — permissions config
- `next-best-practices` — App Router route handler behavior

## After green

- `gellify-docs-update` — the Scalar UI updates automatically from the OpenAPI doc; markdown docs and ADR (if needed) still required.
