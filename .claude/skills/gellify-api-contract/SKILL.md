---
name: gellify-api-contract
description: Standalone skill. Reads an issue (Linear, GitHub, Jira, or pasted text), analyzes the problem, and produces a REST API contract as OpenAPI 3.1 YAML in docs/api/contracts/<name>.yaml. Resolves resource names against docs/GLOSSARY.md (and the existing codebase as fallback) so naming stays consistent, and updates the glossary when a new resource is introduced. Use ONLY when the user asks to design/draft/extract an API contract from an issue, ticket, PRD, or problem description — NEVER for implementation work (use gellify-app-maintenance for that).
---

# gellify-api-contract

Turn an issue into a reviewable REST API contract. This skill **does not** generate code, touch routers, write services, or modify schemas. Its only side effects are:
- `docs/api/contracts/<name>.yaml` (new OpenAPI 3.1 spec)
- `docs/GLOSSARY.md` (append/update entries when resources are introduced)

If you find yourself wanting to implement: stop and hand off to `gellify-app-maintenance` with the produced contract as input.

## Workflow

### 1. Fetch the issue

Ask the user for the source if not specified:

| Source | How to fetch |
|---|---|
| Linear | MCP: `mcp__claude_ai_Linear__get_issue`, `list_comments` |
| Jira | MCP: `mcp__claude_ai_Atlassian__getJiraIssue` |
| GitHub | `gh issue view <num> --json title,body,comments` (or GitHub MCP if available) |
| Pasted text | Use what the user provided |

Collect: title, full body, comments/replies, attached labels/types. If the issue references other issues, fetch those too (one hop is usually enough).

### 2. Analyze the problem (no contract yet)

Extract:
- **Goal** — what does the caller want to accomplish? (1 sentence)
- **Actors** — who calls this? (end user, admin, system-to-system, …)
- **Entities** — nouns mentioned. These become resource candidates.
- **Operations** — verbs mentioned. These map to HTTP methods.
- **Constraints** — auth, rate limits, idempotency, async requirements, regulatory.
- **Unknowns** — anything the issue doesn't answer that the contract needs (cardinality, pagination, error semantics, …).

Surface unknowns to the user and resolve them before drafting. **Do not invent answers.**

### 3. Resolve resource names — glossary-first

For each candidate entity:

1. **Read `docs/GLOSSARY.md`.** If the file doesn't exist, create it with the header in [templates/glossary-header.md.tmpl](templates/glossary-header.md.tmpl).
2. If the concept exists → reuse the canonical name verbatim. Note the entry being matched.
3. If not in glossary → **search the codebase** for similar concepts:
   - `src/server/db/schema/*.ts` (existing tables)
   - `src/server/domains/*/` (existing domain modules)
   - `src/shared/validators/*.schema.ts` (existing validator naming)
   - `src/server/api/rest/routers/*.ts` (existing URL/operation patterns)

   Use Grep liberally. If a similar concept exists under a different name, prefer the existing name unless the user disagrees.
4. If nothing matches → it's a **new resource**. Pick a name following the naming rules in [REFERENCE.md](REFERENCE.md) ("Resource naming"). Plan to append a glossary entry.

Present the resource-name decisions to the user **before drafting the contract**.

### 4. Draft the contract

Apply [REFERENCE.md](REFERENCE.md) (REST design rules) to produce:
- Resource paths (`/<resource>` collection, `/<resource>/{id}` item, sub-resources nested)
- Methods (GET/POST/PUT/PATCH/DELETE) with correct semantics
- Status codes (200/201/204 success; 400/401/403/404/409/422 client; 500/503 server)
- Request shapes (path/query/body) and response shapes
- Pagination, filtering, sorting where lists are returned
- Error envelope consistent with the existing codebase pattern (see `src/server/api/rest/utils/`)

Use [templates/contract.yaml.tmpl](templates/contract.yaml.tmpl) as the OpenAPI 3.1 skeleton. Fill `info`, `tags`, `paths`, `components.schemas`. Reuse `components.schemas` across endpoints — never inline duplicate schemas.

### 5. Review with user

Present:
- the resource decisions and glossary diff
- a summary table of endpoints (method, path, purpose, status codes)
- any open question that the issue didn't resolve

Iterate until the user accepts.

### 6. Write files

1. `docs/api/contracts/<name>.yaml` — OpenAPI 3.1 spec. `<name>` is the canonical resource (singular for single-resource specs, or the feature name for multi-resource specs).
2. `docs/GLOSSARY.md` — append/update entries. One entry per resource and per non-obvious term.

Show the user the file paths and a one-paragraph summary of what was decided. Do NOT proceed to implementation. If the user wants code, hand off with: *"Pass `docs/api/contracts/<name>.yaml` to `gellify-app-maintenance` as a contract input."*

## What this skill is NOT

- Not an implementer. No code, no routers, no Drizzle.
- Not a tRPC contract designer. Output is REST-shaped (OpenAPI). The implementation skill can derive tRPC procedures from the same Zod schemas, but contract design here is REST-first.
- Not a doc-updater for unrelated docs. Only `docs/api/contracts/` and `docs/GLOSSARY.md`.

## Cross-references

- [REFERENCE.md](REFERENCE.md) — REST design rules (resource naming, methods, status codes, pagination, errors, versioning)
- [templates/contract.yaml.tmpl](templates/contract.yaml.tmpl) — OpenAPI 3.1 skeleton
- [templates/glossary-header.md.tmpl](templates/glossary-header.md.tmpl) — bootstrap for a new `docs/GLOSSARY.md`
