import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";
import { permissionModules } from "@/modules/permissions";
import { grantsOf, statementsOf } from "@/modules/registry";

/**
 * A statement is a set of resource name and relative actions
 * We can expand the default statements and add our custom ones; those of
 * the optional modules come from their `permissions.ts`.
 *
 * For more informations on Access Control read the doc
 * @ref https://www.better-auth.com/docs/plugins/admin#access-control
 */
export const ac = createAccessControl({
  ...defaultStatements,
  ...statementsOf(permissionModules),
});

// Here we define rosources and actions for the user role
export const userRole = ac.newRole({
  ...grantsOf(permissionModules, "user"),
  ...userAc.statements,
});

// Here we define rosources and actions for the admin role
export const adminRole = ac.newRole({
  ...grantsOf(permissionModules, "admin"),
  ...adminAc.statements,
});

// ... add custom roles if needed

/**
 * Custom utility types
 */
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export type AccessControlStatements = typeof ac.statements;

export type Permissions = {
  [Resource in keyof AccessControlStatements]?: AccessControlStatements[Resource] extends readonly (infer Actions)[]
    ? readonly Actions[]
    : never;
};

/**
 * The permissions of a role. No role is the user role, as Better Auth's
 * `defaultRole`: a user has none without the admin module, which adds it.
 */
export function expandRoles(role: Role | null | undefined): Permissions {
  switch (role ?? ROLES.USER) {
    case ROLES.ADMIN:
      return adminRole.statements;
    case ROLES.USER:
      return userRole.statements;
    default:
      return {};
  }
}

/**
 * The permissions of a user of a session. The user has a `role` only with
 * the admin module, so it is read without naming the module.
 */
export function permissionsOf(user: object): Permissions {
  return expandRoles("role" in user ? (user.role as Role | null) : undefined);
}

export function formatPermissions(permissions: Permissions) {
  return Object.entries(permissions)
    .map(([resource, actions]) =>
      actions.map((action) => `${resource}:${action}`),
    )
    .join(", ");
}
