import { admin } from "./admin/user-menu";
import { organization } from "./organization/user-menu";

/**
 * The items the optional modules add to the user menu, before Account: one
 * `user-menu.tsx` per module, `{ id, Component }`, rendered by
 * `src/components/auth/user-menu.tsx`. An item is a client component, and
 * decides itself whether to show (the admin link, for an admin only).
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const userMenuModules = [admin, organization] as const;
