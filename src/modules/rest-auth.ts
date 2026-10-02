import { apiKey } from "./api-key/rest-auth";

/**
 * The credentials the optional modules add to the REST API, next to the session
 * cookie: one `rest-auth.ts` per module, `{ id, securitySchemes, authenticate }`,
 * tried in order by `src/server/api/rest/middleware/auth.ts`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const restAuthModules = [apiKey] as const;
