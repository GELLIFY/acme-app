import { apiKey } from "./api-key/schema";
import { passkey } from "./passkey/schema";
import { todo } from "./todo/schema";
import { twoFactor } from "./two-factor/schema";

/**
 * The Drizzle tables of the optional modules: one `schema.ts` per module,
 * `{ id, tables }`, merged into `schema` (`src/server/db/schema/index.ts`).
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const schemaModules = [apiKey, passkey, todo, twoFactor] as const;
