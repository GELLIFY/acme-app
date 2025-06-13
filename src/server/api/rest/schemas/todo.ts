import { z } from "@hono/zod-openapi";

export const todosRequestSchema = z
  .object({
    text: z.string().nullable().openapi({
      description: "Filter todo by text",
      example: "todo",
    }),
    completed: z.boolean().nullable().openapi({
      description: "To show completed todo.",
      example: true,
    }),
    deleted: z.boolean().openapi({
      description: "To show deleted todos.",
      example: true,
      default: false,
    }),
  })
  .openapi("TodoRequest");

export const createTodoSchema = z
  .object({
    text: z.string().min(1).trim().openapi({
      description: "The text of the todo.",
      example: "Update the doc",
    }),
  })
  .openapi("CreateTodo");

export const deleteTodoSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({
        description: "The UUID of the todo to delete.",
        example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
        param: {
          in: "path",
          name: "id",
        },
      }),
  })
  .openapi("DeleteTodo");

export const updateTodoSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({
        description: "The ID of the todo to update.",
        example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
        param: {
          in: "path",
          name: "id",
        },
      }),
    text: z.string().optional().openapi({
      description: "The new text of the todo.",
      example: "Update the doc v2",
    }),
    completed: z.boolean().optional().openapi({
      description: "The new state of the todo.",
      example: true,
    }),
  })
  .openapi("UpdateTodo");

export const todoResponseSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({
        description: "The UUID of the todo.",
        example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
        param: {
          in: "path",
        },
      }),
    text: z.string().openapi({
      description: "The text of the todo.",
      example: "Update the doc",
    }),
    completed: z.boolean().openapi({
      description: "The new state of the todo.",
      example: true,
    }),
  })
  .openapi("TodoResponse");

export const todosResponseSchema = z
  .object({
    data: z.array(todoResponseSchema).openapi({
      description: "List of todos.",
    }),
  })
  .openapi("TodosResponse");
