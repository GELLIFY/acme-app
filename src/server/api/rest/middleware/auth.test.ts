import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { requestWithCookies } from "../../../../tests/http";
import type { Context } from "../init";
import { withAuth } from "./auth";

describe("withAuth middleware", () => {
  const createProtectedApp = () => {
    const app = new Hono<Context>().use(withAuth).get("/secure", (c) =>
      c.json({
        userId: c.get("userId"),
        permissions: c.get("permissions"),
      }),
    );

    return app;
  };

  test.todo("authenticates using a session cookie", async () => {});

  test("enters the session branch for the plain cookie name", async () => {
    const app = createProtectedApp();
    const res = await app.request(
      requestWithCookies("/secure", {
        "better-auth.session_token": "invalid-token",
      }),
    );
    expect(res.status).toBe(401);
    expect(await res.text()).toBe("Invalid or expired session token");
  });

  test("enters the session branch for the __Secure- prefixed cookie name", async () => {
    const app = createProtectedApp();
    const res = await app.request(
      requestWithCookies("/secure", {
        "__Secure-better-auth.session_token": "invalid-token",
      }),
    );
    expect(res.status).toBe(401);
    expect(await res.text()).toBe("Invalid or expired session token");
  });

  test.todo("authenticates using an API key header", async () => {});

  test.todo("returns 401 when API key is invalid", async () => {});

  test.todo("falls back to test bindings when credentials are missing", async () => {});

  test("returns 401 when no credentials are provided", async () => {
    const app = createProtectedApp();
    const client = testClient(app);

    const response = await client.secure.$get();

    expect(response.status).toBe(401);
  });
});
