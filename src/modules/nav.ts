import { todo } from "./todo/nav";

/**
 * The links the optional modules add to the navigation bar, before the app's
 * own: one `nav.ts` per module, `{ id, href, icon, label }`, rendered by
 * `src/components/navbar-components/navbar.tsx`.
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const navModules = [todo] as const;
