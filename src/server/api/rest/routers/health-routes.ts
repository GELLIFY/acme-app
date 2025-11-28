import { createRoute } from "@hono/zod-openapi";
import { checkHealth } from "@/server/services/health-service";
import { createRouter } from "./_app";

const tags = ["Health"];

export const healthRouter = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "List all todos",
    operationId: "listTodos",
    description: "Retrieve a list of todos.",
    tags: tags,
    responses: {
      204: {
        description: "Health success",
      },
      500: {
        description: "Todo deleted",
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
