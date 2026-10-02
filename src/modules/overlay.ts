import { admin } from "./admin/overlay";

/**
 * The components the optional modules lay over every page: one `overlay.tsx`
 * per module, `{ id, Component }`, rendered by `src/app/[locale]/layout.tsx`
 * after the toaster (the admin's impersonation indicator).
 *
 * A registry only imports and lists: the generator removes a declined module
 * by deleting its import and its entry here (see `registry.ts`).
 */
export const overlayModules = [admin] as const;
