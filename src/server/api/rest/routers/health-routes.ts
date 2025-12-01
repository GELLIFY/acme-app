import { createRoute } from "@hono/zod-openapi";
import { checkHealth } from "@/server/services/health-service";
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
      204: {
        description: "Service is healthy.",
      },
      500: {
        description: "Service is unhealthy or an internal error occurred.",
      },
    },
  }),
  async (c) => {
    const db = c.get("db");

    try {
      await checkHealth(db);
      return c.body(null, 204);
    } catch (error) {
      console.error(error);
      return c.body(null, 500);
    }
  },
);
