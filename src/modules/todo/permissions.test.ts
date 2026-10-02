import { describe, expect, it } from "bun:test";
import { ac, expandRoles, ROLES } from "@/libs/better-auth/permissions";

describe("the todo resource", () => {
  it("is a statement of the access control", () => {
    expect(ac.statements.todo).toEqual(["create", "list", "update", "delete"]);
  });

  it("is granted in full to both roles", () => {
    for (const role of [ROLES.ADMIN, ROLES.USER]) {
      expect(expandRoles(role).todo).toEqual([
        "create",
        "list",
        "update",
        "delete",
      ]);
    }
  });
});
