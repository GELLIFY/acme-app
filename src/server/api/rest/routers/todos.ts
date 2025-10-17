import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/server/db";
import {
  deleteTodo,
  getTodoById,
  getTodos,
  upsertTodo,
} from "@/server/domains/todo/todo-service";
import { validateResponse } from "@/server/services/validation-service";
import {
  getTodoByIdSchema,
  getTodosSchema,
  todoResponseSchema,
  todosResponseSchema,
  upsertTodoSchema,
} from "@/shared/validators/todo.schema";
import type { Context } from "../init";

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
      params: getTodoByIdSchema,
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
    // middleware: [withRequiredScope("todo.read")],
  }),
  async (c) => {
    const id = c.req.valid("param").id;

    const result = await getTodoById(db, { id });

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
            schema: upsertTodoSchema,
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
    // middleware: [withRequiredScope("todo.write")],
  }),
  async (c) => {
    const body = c.req.valid("json");

    const result = await upsertTodo(db, { ...body });

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
      params: getTodoByIdSchema,
      body: {
        content: {
          "application/json": {
            schema: upsertTodoSchema,
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
    // middleware: [withRequiredScope("todo.write")],
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const params = c.req.valid("json");

    const result = await upsertTodo(db, { id, ...params });

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
      params: getTodoByIdSchema,
    },
    responses: {
      200: {
        description: "Todo deleted",
        content: {
          "application/json": {
            schema: todoResponseSchema,
          },
        },
      },
    },
    // middleware: [withRequiredScope("todo.write")],
  }),
  async (c) => {
    const id = c.req.valid("param").id;

    const result = await deleteTodo(db, { id });

    return c.json(validateResponse(result, todoResponseSchema));
  },
);

export const todosRouter = app;
