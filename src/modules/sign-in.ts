import { passkey } from "./passkey/sign-in";

/**
 * The components the optional modules add to the sign-in form: one `sign-in.tsx` per
 * module, `{ id, Component }`, rendered by the sign-in page.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const signInModules = [passkey] as const;
