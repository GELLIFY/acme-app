# REST API design rules

Concise reference for designing REST contracts. Applied by `gellify-api-contract` when drafting OpenAPI specs.

## Resource naming

- **Nouns, not verbs.** `/orders` not `/getOrders`. The HTTP method is the verb.
- **Plural for collections.** `/users`, `/orders`, `/audit-logs`. Item path: `/users/{id}`.
- **Singular for singleton resources** (one-per-parent). `/users/{id}/preferences` (one preferences object per user).
- **Lowercase, kebab-case.** `/audit-logs` not `/auditLogs` or `/audit_logs`.
- **No file extensions** in paths.
- **Sub-resources for ownership.** `/users/{userId}/orders` when orders belong to a user. Keep nesting shallow — max 2 levels. If you need 3, you usually want a top-level resource with a query filter.
- **IDs are opaque** to the client. Don't expose internal numeric PKs if the entity is referenced externally; prefer UUIDs (matches the codebase's `pg_catalog.gen_random_uuid()` pattern).

## HTTP methods — semantics matter

| Method | Idempotent | Safe | Use for |
|---|---|---|---|
| `GET` | yes | yes | Read. No side effects. |
| `POST` | no | no | Create, or actions that don't fit CRUD (e.g., `/orders/{id}/cancel`). |
| `PUT` | yes | no | Full replacement of a resource. Client provides complete representation. |
| `PATCH` | no* | no | Partial update. JSON Merge Patch (default) or JSON Patch (if precise ops needed). |
| `DELETE` | yes | no | Remove. Return 204 on success. |

*PATCH can be idempotent depending on payload semantics; don't rely on it.

**Bulk operations**: `POST /<resource>/batch` with an array body. Don't use `PUT` for "upsert-many" — too ambiguous.

**Actions that aren't CRUD**: model as sub-POST. `POST /orders/{id}/cancel`, `POST /sessions/{id}/refresh`. Don't invent verbs like `PATCH /orders/{id}?action=cancel`.

## Status codes

Use the smallest set that conveys meaning:

| Code | Meaning | Use when |
|---|---|---|
| 200 OK | Success with body | GET, PATCH/PUT returning the updated resource |
| 201 Created | Created with body | POST creating a resource (include `Location` header) |
| 202 Accepted | Async accepted | Long-running operations |
| 204 No Content | Success, no body | DELETE; PATCH/PUT when no body needed |
| 400 Bad Request | Malformed request | JSON parse errors, semantic violations not caught by schema |
| 401 Unauthorized | No/invalid auth | Missing or expired credentials |
| 403 Forbidden | Authed but not allowed | Permission denied |
| 404 Not Found | Resource doesn't exist | Or hidden from this caller |
| 409 Conflict | State conflict | Duplicate unique key, version mismatch, illegal transition |
| 422 Unprocessable | Schema validation failed | Use this for Zod/OpenAPI validation errors (matches codebase) |
| 429 Too Many Requests | Rate limited | Include `Retry-After` |
| 500 Internal Server Error | Server bug | Generic catch-all |
| 503 Service Unavailable | Dependency down | Include `Retry-After` |

**Don't use 200 for errors.** Don't return `{"error": "..."}` with status 200.

## Pagination

For list endpoints, default to **cursor pagination** when ordering is stable:

```http
GET /orders?limit=20&cursor=<opaque>
→ 200 { "data": [...], "nextCursor": "..." | null }
```

Use **offset pagination** only when the dataset is small and stable:

```http
GET /orders?limit=20&offset=40
→ 200 { "data": [...], "total": 1234 }
```

Always cap `limit` server-side (e.g., max 100). Document the default.

## Filtering, sorting, searching

- **Filtering**: `?status=open&priority=high`. One query param per filterable field.
- **Sorting**: `?sort=created_at` (asc) or `?sort=-created_at` (desc). Multi-field: `?sort=-priority,created_at`.
- **Search**: `?q=<text>` for full-text. Reserve `q` for search; don't overload it for filters.
- **Field selection** (optional): `?fields=id,name,status`. Skip unless payload size is a real problem.

## Request body conventions

- **JSON only** unless there's a clear file-upload case (then `multipart/form-data`).
- **camelCase or snake_case** — pick one project-wide. The codebase uses **camelCase in TS** but Drizzle is configured with `casing: "snake_case"` so DB columns are snake_case. For API payloads: **camelCase** (matches existing validators like `getTodosSchema`).
- **No null vs missing ambiguity**: if absent is allowed, use `.optional()`. If null is meaningful (explicit clear), use `.nullable()`. Document the distinction.

## Error response shape

Match the existing codebase shape (`src/server/api/rest/utils/`). Standard envelope:

```yaml
ErrorResponse:
  type: object
  required: [message]
  properties:
    message: { type: string }
    code: { type: string, description: "Stable machine-readable code" }
    details: { type: object, description: "Optional structured context" }
```

For 422 (validation), use the Zod error tree shape produced by `createErrorSchema` in the codebase.

## Versioning

- **No version in v1.** Don't pre-emptively prefix with `/v1`. Add `/v2` only when a breaking change is actually needed.
- When you do version: path prefix (`/v2/orders`), not header-based. Easier to debug.
- Document deprecation: include `Deprecation` and `Sunset` response headers when an endpoint is deprecated.

## Idempotency

For unsafe methods that may be retried (POST creates, payment-like actions):
- Accept `Idempotency-Key` header.
- Server stores the response for N hours; same key → same response.
- Document the TTL in the contract.

Skip idempotency keys for trivial creates (no dedup risk).

## Async / long-running

- Return `202 Accepted` with `Location: /jobs/{id}` and a body containing `{ "job_id": "...", "status": "pending" }`.
- Provide `GET /jobs/{id}` to poll.
- Don't make the client wait synchronously.

## Auth

Match the existing codebase: cookie auth (`better-auth.session_token`) or API key (`x-api-key`). Declare both in `components.securitySchemes`. Per-endpoint: omit `security` to inherit; specify `security: []` to mark an endpoint as public.

## Common pitfalls — avoid these

- ❌ `GET /getUser?id=123` — use `GET /users/{id}`.
- ❌ `POST /deleteOrder/{id}` — use `DELETE /orders/{id}`.
- ❌ Mixing singular and plural across the API.
- ❌ Returning different shapes for the same resource depending on endpoint.
- ❌ Embedding HTML, JS, or rendered text in JSON responses.
- ❌ 200-with-error-in-body.
- ❌ Status code chosen "to be informative" but inconsistent (e.g., 422 for "not found"). Pick from the table above.

## Sources

Distilled from: RFC 9110 (HTTP semantics), RFC 7807 (problem details), Zalando RESTful API guidelines, Microsoft Azure API guidelines, Stripe API. When in doubt, look at how Stripe does it.
