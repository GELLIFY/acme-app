import { createRoute, z } from "@hono/zod-openapi";
import { checkHealth } from "@/server/services/health-service";
import { logger } from "@/shared/infrastructure/logger";
import { createRouter } from "../utils/create-router";

const tags = ["Health"];

export const healthRouter = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "Health check",
    operationId: "healthCheck",
    description:
      "Check the health/status of the application and database connection.",
    tags: tags,
    responses: {
      200: {
        description: "Service is healthy.",
        content: {
          "application/json": {
            schema: z.object({ status: z.string() }),
          },
        },
      },
      500: {
        description: "Service is unhealthy or an internal error occurred.",
        content: {
          "application/json": {
            schema: z.object({ status: z.string() }),
          },
        },
      },
    },
  }),
  async (c) => {
    const db = c.get("db");

    try {
      await checkHealth(db);
      return c.json({ status: "ok" }, 200);
    } catch (error) {
      logger.error(error);
      return c.json({ status: "error" }, 500);
    }
  },
);
