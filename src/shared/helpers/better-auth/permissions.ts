import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

/**
 * A statement is a set of resource name and relative actions
 * We can expand the default statements and add our custom ones
 *
 * For more informations on Access Control read the doc
 * @ref https://www.better-auth.com/docs/plugins/admin#access-control
 */
export const ac = createAccessControl({
  ...defaultStatements,
  todo: ["create", "list", "update", "delete"],
});

// Here we define rosources and actions for the user role
export const userRole = ac.newRole({
  todo: ["create", "list", "update", "delete"],
  ...userAc.statements,
});

// Here we define rosources and actions for the admin role
export const adminRole = ac.newRole({
  todo: ["create", "list", "update", "delete"],
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
    ? Actions[]
    : never;
};

export function expandRoles(role: Role): Permissions {
  switch (role) {
    case ROLES.ADMIN:
      return adminRole.statements;
    case ROLES.USER:
      return userRole.statements;
    default:
      return {};
  }
}
