import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

/**
 * For more informations on Access Control
 * @ref https://www.better-auth.com/docs/plugins/admin#access-control
 */

export const ac = createAccessControl(defaultStatements);

export const userRole = ac.newRole(userAc.statements);

export const adminRole = ac.newRole(adminAc.statements);
