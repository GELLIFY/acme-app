/**
 * The REST routes of the optional modules: one `rest.ts` per module,
 * `{ id, routes: [{ path, router }] }`, mounted behind the protected middleware
 * by `src/server/api/rest/routers/_app.ts`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const restModules = [] as const;
