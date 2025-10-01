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

export const todoResponseSchema = z.object({
  // FIXME: uuid() check won't work
  id: z.string().openapi({
    description: "Unique identifier of the todo",
    example: "b3b7c1e2-4c2a-4e7a-9c1a-2b7c1e24c2a4",
  }),
  text: z.string().min(1).trim().openapi({
    description: "The text of the todo.",
    example: "Update the doc",
  }),
  completed: z.boolean().default(false).openapi({
    description: "The new state of the todo.",
    example: true,
  }),
});

export const todosResponseSchema = z.object({
  data: z.array(todoResponseSchema).nullable(),
});

export const createTodoSchema = z
  .object({
    text: z.string().min(1).trim().openapi({
      description: "The text of the todo.",
      example: "Update the doc",
    }),
    completed: z.boolean().optional().openapi({
      description: "The new state of the todo.",
      example: true,
    }),
  })
  .openapi("CreateTodo");

export const updateTodoSchema = z.object({
  // Overwrites the field, including its nullability
  id: z.uuid().openapi({
    description: "The ID of the todo to update.",
    example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
    param: {
      in: "path",
      name: "id",
    },
  }),
  // Extends schema
  text: z.string().optional().openapi({
    description: "The new text of the todo.",
    example: "Update the doc v2",
  }),
  // Extends schema before becoming nullable/optional
  completed: z.boolean().optional().openapi({
    description: "The new state of the todo.",
    example: true,
  }),
});

export const deleteTodoSchema = z.object({
  id: z.uuid().openapi({
    description: "The UUID of the todo to delete.",
    example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
    param: {
      in: "path",
      name: "id",
    },
  }),
});

// Search params filter schema
export const todoFilterParamsSchema = {
  text: parseAsString,
  completed: parseAsBoolean,
};
