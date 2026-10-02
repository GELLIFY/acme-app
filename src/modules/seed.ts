import { todo } from "./todo/seed";

/**
 * The seed data of the optional modules: one `seed.ts` per module,
 * `{ id, seed(db, user) }`, run in order by `src/server/db/seed.ts` once the
 * default user exists.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const seedModules = [todo] as const;
