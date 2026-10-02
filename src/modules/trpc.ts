/**
 * The tRPC routers of the optional modules: one `trpc.ts` per module,
 * `{ id, routers }`, merged into `appRouter` (`src/server/api/trpc/routers/_app.ts`).
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const trpcModules = [] as const;
