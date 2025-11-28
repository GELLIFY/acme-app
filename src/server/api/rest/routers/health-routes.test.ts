import { describe, expect, test } from "bun:test";
import { testClient } from "hono/testing";
import { routers } from "../init";

describe("todos routes", () => {
  // Create the test client from the app instance
  const client = testClient(routers);

  test.todo("get /health should return 500 if no DB", async () => {
    const response = await client.health.$get();

    expect(response.status).toBe(500);
  });

  test("get /health should return 204 when db is available", async () => {
    const response = await client.health.$get();

    expect(response.status).toBe(204);
  });
});
