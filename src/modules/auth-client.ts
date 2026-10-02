/**
 * The Better Auth client plugins of the optional modules: one `auth-client.ts` per
 * module, `{ id, plugins }`, spread into `src/libs/better-auth/auth-client.ts`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const authClientModules = [] as const;
