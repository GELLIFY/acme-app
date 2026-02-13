import { describe, expect, it } from "bun:test";
import { adminRole, ROLES, userRole } from "@/libs/better-auth/permissions";
import { expandRoles } from "./permissions";

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

  it("returns permissions with todo resource for ADMIN role", () => {
    const result = expandRoles(ROLES.ADMIN);
    expect(result).toHaveProperty("todo");
    expect(Array.isArray(result.todo)).toBe(true);
  });

  it("returns permissions with todo resource for USER role", () => {
    const result = expandRoles(ROLES.USER);
    expect(result).toHaveProperty("todo");
    expect(Array.isArray(result.todo)).toBe(true);
  });

  it("returns different permissions for ADMIN vs USER roles", () => {
    const adminPermissions = expandRoles(ROLES.ADMIN);
    const userPermissions = expandRoles(ROLES.USER);

    // Admin should have at least the same permissions as user, but potentially more
    // This test verifies they are different objects (not the same reference)
    expect(adminPermissions).not.toBe(userPermissions);
  });
});
