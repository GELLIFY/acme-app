import { rest } from "./rest/health";

/**
 * The health checks the optional modules add to the home page: one `health.ts`
 * per module, `{ id, label, url }`, a URL answering `{ status: "ok" }`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const healthModules = [rest] as const;
