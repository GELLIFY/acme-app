import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import type { Context } from "../init";
import { db } from "@/server/db";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "@/server/services/todo-service";
import { validateResponse } from "@/server/services/validation-service";
import {
  createTodoSchema,
  deleteTodoSchema,
  getTodosSchema,
  todoResponseSchema,
  todosResponseSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";

const app = new OpenAPIHono<Context>();

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "List all todos",
    operationId: "listTodos",
    description: "Retrieve a list of todos.",
    tags: ["Todos"],
    request: {
      query: getTodosSchema,
    },
    responses: {
      200: {
        description: "Retrieve a list of todos.",
        content: {
          "application/json": {
            schema: todosResponseSchema,
          },
        },
      },
    },
    // middleware: [withRequiredScope("todos.read")],
  }),
  async (c) => {
    const filters = c.req.valid("query");

    const result = await getTodos(db, filters);

    return c.json(validateResponse({ data: result }, todosResponseSchema));
  },
);

app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    summary: "Retrieve a todo",
    operationId: "getTodoById",
    description: "Retrieve a todo by ID.",
    tags: ["Todos"],
    request: {
      params: todoResponseSchema.pick({ id: true }),
    },
    responses: {
      200: {
        description: "Retrieve a todo by ID.",
        content: {
          "application/json": {
            schema: todoResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
      },
      500: {
        description: "Internal server error",
      },
    },
    // middleware: [withRequiredScope("todo.read")],
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await getTodoById(db, { id });

    if (!result) return c.json({}, 404);

    return c.json(validateResponse(result, todoResponseSchema), 200);
  },
);

app.openapi(
  createRoute({
    method: "post",
    path: "/",
    summary: "Create a new todo",
    operationId: "createTodo",
    description: "Create a new todo.",
    tags: ["Todos"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: createTodoSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Todo created",
        content: {
          "application/json": {
            schema: todoResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
      },
      500: {
        description: "Internal server error",
      },
    },
    // middleware: [withRequiredScope("todo.write")],
  }),
  async (c) => {
    const body = c.req.valid("json");

    const result = await createTodo(db, { ...body });

    return c.json(validateResponse(result, todoResponseSchema));
  },
);

app.openapi(
  createRoute({
    method: "patch",
    path: "/{id}",
    summary: "Update a todo",
    operationId: "updateTodo",
    description: "Update a todo by ID.",
    tags: ["Todos"],
    request: {
      params: updateTodoSchema.pick({ id: true }),
      body: {
        content: {
          "application/json": {
            schema: updateTodoSchema.omit({ id: true }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Todo updated",
        content: {
          "application/json": {
            schema: todoResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
      },
      500: {
        description: "Internal server error",
      },
    },
    // middleware: [withRequiredScope("todo.write")],
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const params = c.req.valid("json");

    const result = await updateTodo(db, { id, ...params });

    return c.json(validateResponse(result, todoResponseSchema));
  },
);

app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    summary: "Delete a todo",
    operationId: "deleteTodo",
    description: "Delete a todo by ID.",
    tags: ["Todos"],
    request: {
      params: deleteTodoSchema,
    },
    responses: {
      204: {
        description: "Todo deleted",
      },
    },
    // middleware: [withRequiredScope("todo.write")],
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await deleteTodo(db, { id });

    return c.json(validateResponse(result, z.void()));
  },
);

export const todosRouter = app;
