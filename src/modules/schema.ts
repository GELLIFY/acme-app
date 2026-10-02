/**
 * The Drizzle tables of the optional modules: one `schema.ts` per module,
 * `{ id, tables }`, merged into `schema` (`src/server/db/schema/index.ts`).
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const schemaModules = [] as const;
