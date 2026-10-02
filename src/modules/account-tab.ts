import { apiKey } from "./api-key/account-tab";

/**
 * The tabs the optional modules add to the account page, before Danger: one
 * `account-tab.tsx` per module, `{ id, value, Trigger, Component }`. A tab loads its
 * own data.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const accountTabModules = [apiKey] as const;
