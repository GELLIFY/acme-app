import { passkey } from "./passkey/auth";

/**
 * The Better Auth server plugins of the optional modules: one `auth.ts` per module,
 * `{ id, plugins }`, spread into `plugins` of `src/libs/better-auth/auth.ts`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const authModules = [passkey] as const;
