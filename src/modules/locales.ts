import { apiKey } from "./api-key/locales";
import { passkey } from "./passkey/locales";
import { twoFactor } from "./two-factor/locales";

/**
 * The messages of the optional modules: one `locales.ts` per module,
 * `{ id, messages: { en, it } }`, merged into `src/shared/locales/{en,it}.ts`
 * by `messagesWith()`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const localeModules = [apiKey, passkey, twoFactor] as const;
