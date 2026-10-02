import { passkey } from "./passkey/account-security";
import { twoFactor } from "./two-factor/account-security";

/**
 * The sections the optional modules add to the Security tab of the account page:
 * one `account-security.tsx` per module, `{ id, Component }`. A section loads its
 * own data; the page renders them in order, before the sessions.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const accountSecurityModules = [twoFactor, passkey] as const;
