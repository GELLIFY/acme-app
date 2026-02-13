import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import type { Permissions } from "@/libs/better-auth/permissions";
import type { Context } from "../init";
import { withRequiredPermissions } from "./required-permissions";

describe("withRequiredPermissions middleware", () => {
  const createPermissionsApp = (
    requiredPermissions: Permissions,
    existingPermissions?: Permissions,
  ) => {
    const app = new Hono<Context>();

    if (existingPermissions) {
      app.use(async (c, next) => {
        c.set("permissions", existingPermissions);
        await next();
      });
    }

    app.use(withRequiredPermissions(requiredPermissions));

    app.get("/secure-permissions", (c) =>
      c.json({
        ok: true,
        permissions: c.get("permissions"),
      }),
    );

    return app;
  };

  const requestPermissionsRoute = (app: Hono<Context>) => {
    const request = new Request("http://localhost/secure-permissions", {
      method: "GET",
    });

    return app.fetch(request);
  };

  test("returns 401 when no permissions are set on context", async () => {
    const app = createPermissionsApp({ todo: ["create"] });

    const response = await requestPermissionsRoute(app);

    expect(response.status).toBe(401);
    const body = (await response.json()) as {
      error: string;
      description: string;
    };

    expect(body.error).toBe("Unauthorized");
  });

  test("returns 403 when user lacks required permissions", async () => {
    const app = createPermissionsApp(
      { todo: ["delete"] },
      { todo: ["create"] },
    );

    const response = await requestPermissionsRoute(app);

    expect(response.status).toBe(403);
    const body = (await response.json()) as {
      error: string;
      description: string;
    };

    expect(body.error).toBe("Forbidden");
    expect(body.description).toContain("Insufficient permissions");
  });

  test("allows request when user has required permissions", async () => {
    const app = createPermissionsApp(
      { todo: ["delete"] },
      { todo: ["create", "delete"] },
    );

    const response = await requestPermissionsRoute(app);

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      ok: boolean;
      permissions: Permissions;
    };

    expect(body.ok).toBe(true);
    expect(body.permissions.todo).toEqual(["create", "delete"]);
  });
});
