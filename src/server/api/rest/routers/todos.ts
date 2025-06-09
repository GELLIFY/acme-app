import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { Context } from "../init";
import { getTodos } from "@/server/services/todo-service";
import { todosResponseSchema } from "../schemas/todo";

const app = new OpenAPIHono<Context>();

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "List all todos",
    operationId: "listTodos",
    description: "Retrieve a list of todos for the authenticated user.",
    tags: ["Todos"],
    responses: {
      200: {
        description: "Retrieve a list of todos for the authenticated user.",
        content: {
          "application/json": {
            schema: todosResponseSchema,
          },
        },
      },
    },
    // middleware: [withRequiredScope("tags.read")],
  }),
  async (c) => {
    const result = await getTodos();

    return c.json({ data: result });
  },
);

export const todosRouter = app;
