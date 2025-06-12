import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { Context } from "../init";
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
  todoResponseSchema,
  todosRequestSchema,
  todosResponseSchema,
  updateTodoSchema,
} from "../schemas/todo";

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
      query: todosRequestSchema,
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
    // middleware: [withRequiredScope("tags.read")],
  }),
  async (c) => {
    const filters = c.req.valid("query");

    const result = await getTodos(filters);

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
    },
    // middleware: [withRequiredScope("tags.read")],
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await getTodoById({ id });

    return c.json(validateResponse(result, todoResponseSchema));
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
    },
    // middleware: [withRequiredScope("tags.write")],
  }),
  async (c) => {
    const body = c.req.valid("json");

    const result = await createTodo({ ...body, completed: false });

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
            schema: updateTodoSchema.pick({ text: true, completed: true }),
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
    },
    // middleware: [withRequiredScope("tags.write")],
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const params = c.req.valid("json");

    const result = await updateTodo({ id, ...params });

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
      params: deleteTodoSchema.pick({ id: true }),
    },
    responses: {
      204: {
        description: "Todo deleted",
      },
    },
    // middleware: [withRequiredScope("tags.write")],
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await deleteTodo({ id });

    return c.json(validateResponse(result, todoResponseSchema));
  },
);

export const todosRouter = app;
