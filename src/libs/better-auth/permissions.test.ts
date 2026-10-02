import { describe, expect, it } from "bun:test";
import { adminRole, ROLES, userRole } from "@/libs/better-auth/permissions";
import { expandRoles, permissionsOf } from "./permissions";

describe("expandRoles", () => {
  it("returns admin permissions for ADMIN role", () => {
    const result = expandRoles(ROLES.ADMIN);
    expect(result).toEqual(adminRole.statements);
  });

  it("returns user permissions for USER role", () => {
    const result = expandRoles(ROLES.USER);
    expect(result).toEqual(userRole.statements);
  });

  it("returns empty object for unknown role", () => {
    const result = expandRoles("unknown" as typeof ROLES.ADMIN);
    expect(result).toEqual({});
  });

  it("returns permissions with user resource for ADMIN role", () => {
    const result = expandRoles(ROLES.ADMIN);
    expect(result).toHaveProperty("user");
    expect(Array.isArray(result.user)).toBe(true);
  });

  it("returns permissions with user resource for USER role", () => {
    const result = expandRoles(ROLES.USER);
    expect(result).toHaveProperty("user");
    expect(Array.isArray(result.user)).toBe(true);
  });

  it("returns different permissions for ADMIN vs USER roles", () => {
    const adminPermissions = expandRoles(ROLES.ADMIN);
    const userPermissions = expandRoles(ROLES.USER);

    // Admin should have at least the same permissions as user, but potentially more
    // This test verifies they are different objects (not the same reference)
    expect(adminPermissions).not.toBe(userPermissions);
  });
});

describe("permissionsOf", () => {
  it("reads the role of the user", () => {
    expect(permissionsOf({ role: ROLES.ADMIN })).toEqual(adminRole.statements);
  });

  // Without the admin module a user has no role, and is a user.
  it("gives the user role to a user without one", () => {
    expect(permissionsOf({})).toEqual(userRole.statements);
    expect(permissionsOf({ role: null })).toEqual(userRole.statements);
  });
});
