import { todo } from "./todo/permissions";

/**
 * The access-control resources of the optional modules: one `permissions.ts`
 * per module, `{ id, statements, grants }`, merged into `ac` and the roles of
 * `src/libs/better-auth/permissions.ts`; `grants.apiKey` is read by the
 * API key module.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const permissionModules = [todo] as const;
