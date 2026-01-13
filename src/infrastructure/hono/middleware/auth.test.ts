import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { testClient } from "hono/testing";
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

  test.todo("returns 401 when session cookie is invalid", async () => {});

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
