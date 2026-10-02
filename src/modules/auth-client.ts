import { admin } from "./admin/auth-client";
import { apiKey } from "./api-key/auth-client";
import { organization } from "./organization/auth-client";
import { passkey } from "./passkey/auth-client";
import { twoFactor } from "./two-factor/auth-client";

/**
 * The Better Auth client plugins of the optional modules: one `auth-client.ts` per
 * module, `{ id, plugins }`, spread into `src/libs/better-auth/auth-client.ts`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const authClientModules = [
  admin,
  apiKey,
  organization,
  passkey,
  twoFactor,
] as const;
