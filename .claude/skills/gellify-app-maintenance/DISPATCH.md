# DISPATCH — how to classify requests and pick layers

## Classification

| Phrase pattern | Class | Notes |
|---|---|---|
| "add a new endpoint/procedure", "create an API for X", "expose Y" | **New endpoint** | Plan: validator + service + router (+ DB if new entity) |
| "the X API should also do Y", "change the X logic to ...", "add field Z to the X endpoint" | **Edit existing** | Locate first; touch only what's needed |
| "rename X to Y", "deprecate X", "version v2 of X", "remove X" | **Contract change** | Go through [PLAYBOOKS.md](PLAYBOOKS.md). Caller-visible. |

## Surface (tRPC vs REST)

| Signal | Pick |
|---|---|
| User said "tRPC" / "procedure" / mentions `src/server/api/trpc` | tRPC |
| User said "REST" / "OpenAPI" / "public API" / mentions `src/app/api/rest` | REST |
| Domain has only one surface | match it |
| Domain has both surfaces (e.g. `todo`) | ask once, default to both |

## Layer matrix — examples extracted from the codebase

### Example 1 — "create-user API: check CF uniqueness, add SPID relation"

| Layer | Touch | Why |
|---|---|---|
| DB schema | yes | new `spid` field/table + relation on `user` |
| Migration | yes | DB shape changed |
| Validator (`user.schema.ts`) | yes | new input field |
| Service (`domains/auth/` or `domains/user/`) | yes | `assertCfUnique()` + `createUser` extension |
| tRPC router (`routers/user.ts`) | yes | wire input + error mapping |
| REST router | if exists for user | mirror tRPC |
| Docs | yes | document new field + uniqueness rule |
| ADR | **yes** | new domain concept (SPID) — architecturally meaningful |

Test list:
- service: `creates user with valid CF + SPID`, `rejects duplicate CF with domain error`, `persists SPID relation`
- validator: `rejects malformed SPID`, `rejects missing CF`
- router (tRPC): `maps duplicate-CF error to TRPCError CONFLICT`
- router (REST): `returns 409 on duplicate CF`, `returns 422 on malformed SPID`

### Example 2 — "read-user API: only return active users"

| Layer | Touch | Why |
|---|---|---|
| DB schema | no | `active` column already exists |
| Migration | no | — |
| Validator | no | input unchanged |
| Service | **yes** | add `where(eq(user.active, true))` in `getUser` query |
| Router | no | signature unchanged |
| Docs | yes | short note: "returns active users only" |
| ADR | no | internal logic change, not architectural |

Test list:
- service: `returns active user`, `does not return inactive user`, `returns empty when only inactive users match`

### Example 3 — "add `completed` filter default = false to listTodos"

| Layer | Touch | Why |
|---|---|---|
| Validator | yes | default value in `getTodosSchema` |
| Service / query | yes | apply default if unspecified |
| Router | no | input/output shape unchanged |
| Docs | yes | document default |
| ADR | no | |

## When tests touch infrastructure

If a service test needs a user row (FK), follow the pattern in `src/server/domains/todo/todo-service.test.ts`:

```ts
beforeEach(async () => {
  await db.insert(userTable).values({ id: userId, email: "...", name: "..." }).onConflictDoNothing();
});
```

For REST route tests, use `testClient` + `OpenAPIHono` with middleware seeded with `db`, `userId`, `permissions` — pattern in `src/server/api/rest/routers/todos-routes.test.ts`.
