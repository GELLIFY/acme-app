import { describe, expect, mock, spyOn, test } from "bun:test";
import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import { logger } from "@/infrastructure/logger";
import { db } from "@/server/db";
import type { Context } from "../init";
import { healthRouter } from "./health-routes";

describe("todos routes", () => {
  test("get /health should return 500 if no DB", async () => {
    // Mocking db impletation to simulate an error
    const dbMock = mock();
    dbMock.mockImplementationOnce(() => {
      return {
        execute: (_query: string) => {
          throw new Error("DB connection error");
        },
      };
    });

    // Create the test client from the app instance
    const app = new OpenAPIHono<Context>()
      .use(async (c, next) => {
        c.set("db", dbMock() as never);
        await next();
      })
      .route("/health", healthRouter);
    const client = testClient(app);

    // Even though the error is caught, it still gets printed to the console
    // so we mock that out to avoid the wall of red text.
    const spy = spyOn(logger, "error");
    spy.mockImplementation(() => {});

    const response = await client.health.$get();

    expect(response.status).toBe(500);

    // restore logger.error
    spy.mockRestore();
  });

  test("get /health should return 200 when db is available", async () => {
    const app = new OpenAPIHono<Context>()
      .use(async (c, next) => {
        c.set("db", db);
        await next();
      })
      .route("/health", healthRouter);
    const client = testClient(app);

    const response = await client.health.$get();

    expect(response.status).toBe(200);
  });
});
