import { z } from "@hono/zod-openapi"; // Extended Zod instance
import { createSchemaFactory } from "drizzle-zod";
import { parseAsBoolean, parseAsString } from "nuqs/server";

import { todo_table } from "@/server/db/schema/todos";

// ref: https://orm.drizzle.team/docs/zod#factory-functions
const { createSelectSchema, createInsertSchema, createUpdateSchema } =
  createSchemaFactory({
    zodInstance: z,
  });

export const selectTodoSchema = createSelectSchema(todo_table, {
  id: z.cuid2().openapi({
    description: "The UUID of the todo.",
    example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
    param: {
      in: "path",
      name: "id",
    },
  }),
  text: (schema) =>
    schema.openapi({
      description: "The text of the todo.",
      example: "Update the doc",
    }),
  completed: (schema) =>
    schema.openapi({
      description: "The new state of the todo.",
      example: true,
    }),
})
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .openapi("Todo");

export const selectTodosSchema = z.object({
  data: z.array(selectTodoSchema).nullable(),
});

export const createTodoSchema = createInsertSchema(todo_table, {
  // We can now use the extended instance
  text: (schema) =>
    schema.min(1).trim().openapi({
      description: "The text of the todo.",
      example: "Update the doc",
    }),
  completed: (schema) =>
    schema.optional().default(false).openapi({
      description: "The new state of the todo.",
      example: false,
    }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateTodoSchema = createUpdateSchema(todo_table, {
  // Overwrites the field, including its nullability
  id: z.cuid2().openapi({
    description: "The ID of the todo to update.",
    example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
    param: {
      in: "path",
      name: "id",
    },
  }),
  // Extends schema
  text: (schema) =>
    schema.optional().openapi({
      description: "The new text of the todo.",
      example: "Update the doc v2",
    }),
  // Extends schema before becoming nullable/optional
  completed: (schema) =>
    schema.optional().openapi({
      description: "The new state of the todo.",
      example: true,
    }),
}).omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const deleteTodoSchema = z.object({
  id: z.cuid2().openapi({
    description: "The UUID of the todo to delete.",
    example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
    param: {
      in: "path",
      name: "id",
    },
  }),
});

// Query filter schema
export const getTodosSchema = z.object({
  text: z.string().nullable().openapi({
    description: "Filter todo by text",
    example: "todo",
  }),
  completed: z.boolean().nullable().openapi({
    description: "To show completed todo.",
    example: true,
  }),
  deleted: z.boolean().nullable().openapi({
    description: "To show deleted todos.",
    example: true,
  }),
});

// Search params filter schema
export const todoFilterParamsSchema = {
  text: parseAsString,
  completed: parseAsBoolean,
  deleted: parseAsBoolean.withDefault(false),
};
