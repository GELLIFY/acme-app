import { z } from "@hono/zod-openapi"; // Extended Zod instance
import { parseAsBoolean, parseAsString } from "nuqs/server";

export const getTodosSchema = z.object({
  text: z.string().nullable().optional().openapi({
    description: "Filter todo by text",
    example: "todo",
  }),
  completed: z.boolean().nullable().optional().openapi({
    description: "To show completed todo.",
    example: true,
  }),
});

export const getTodoByIdSchema = z.object({
  id: z.uuid().openapi({
    description: "Unique identifier of the todo to retrieve",
    example: "b3b7c1e2-4c2a-4e7a-9c1a-2b7c1e24c2a4",
    param: {
      in: "path",
      name: "id",
    },
  }),
});

export const todoResponseSchema = z.object({
  id: z.uuid().openapi({
    description: "Unique identifier of the todo to retrieve",
    example: "b3b7c1e2-4c2a-4e7a-9c1a-2b7c1e24c2a4",
  }),
  text: z.string().openapi({
    description: "The text of the todo.",
    example: "Update the doc",
  }),
  completed: z.boolean().openapi({
    description: "The new state of the todo.",
    example: true,
  }),
});

export const todosResponseSchema = z.array(todoResponseSchema);

export const createTodoSchema = z.object({
  text: z.string().min(3).openapi({
    description: "The new text of the todo.",
    example: "Update the doc v2",
  }),
});

export const updateTodoSchema = z.object({
  id: z.uuid().openapi({
    description: "The ID of the todo to update.",
    example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
    param: {
      in: "path",
      name: "id",
    },
  }),
  text: z.string().min(3).optional().openapi({
    description: "The new text of the todo.",
    example: "Update the doc v2",
  }),
  completed: z.boolean().optional().openapi({
    description: "The new state of the todo.",
    example: true,
  }),
});

// Search params filter schema
export const todoFilterParamsSchema = {
  text: parseAsString,
  completed: parseAsBoolean,
};
