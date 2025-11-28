import { createRoute } from "@hono/zod-openapi";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "@/server/domains/todo/todo-service";
import { validateResponse } from "@/server/services/validation-service";
import {
  createTodoSchema,
  getTodoByIdSchema,
  getTodosSchema,
  todoResponseSchema,
  todosResponseSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { withRequiredPermissions } from "../middleware/auth";
import { createErrorSchema } from "../utils/create-error-schema";
import { notFoundSchema } from "../utils/not-found-schema";
import { createRouter } from "./_app";

const tags = ["Todos"];

const app = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      summary: "List all todos",
      operationId: "listTodos",
      description: "Retrieve a list of todos.",
      tags: tags,
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
      middleware: [
        withRequiredPermissions({
          todo: ["list"],
        }),
      ],
    }),
    async (c) => {
      const db = c.get("db");
      const userId = c.get("userId");
      const filters = c.req.valid("query");

      const result = await getTodos(db, filters, userId);

      return c.json({ data: result }, 200);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/{id}",
      summary: "Retrieve a todo",
      operationId: "getTodoById",
      description: "Retrieve a todo by ID.",
      tags: tags,
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
      middleware: [
        withRequiredPermissions({
          todo: ["list"],
        }),
      ],
    }),
    async (c) => {
      const db = c.get("db");
      const userId = c.get("userId");
      const id = c.req.valid("param").id;

      const result = await getTodoById(db, { id }, userId);

      return c.json(validateResponse(result, todoResponseSchema));
    },
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      summary: "Create a new todo",
      operationId: "createTodo",
      description: "Create a new todo.",
      tags: tags,
      request: {
        body: {
          content: {
            "application/json": {
              schema: createTodoSchema,
            },
          },
          required: true,
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
        422: {
          description: "The validation error(s)",
          content: {
            "application/json": {
              schema: createErrorSchema(createTodoSchema),
            },
          },
        },
      },
      middleware: [
        withRequiredPermissions({
          todo: ["create"],
        }),
      ],
    }),
    async (c) => {
      const db = c.get("db");
      const userId = c.get("userId");
      const body = c.req.valid("json");

      const result = await createTodo(db, { ...body }, userId);

      return c.json(result, 201);
    },
  )
  .openapi(
    createRoute({
      method: "patch",
      path: "/{id}",
      summary: "Update a todo",
      operationId: "updateTodo",
      description: "Update a todo by ID.",
      tags: tags,
      request: {
        params: getTodoByIdSchema,
        body: {
          content: {
            "application/json": {
              schema: updateTodoSchema,
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
          description: "Not found error",
          content: {
            "application/json": {
              schema: notFoundSchema("Todo not found"),
            },
          },
        },
        422: {
          description: "The validation error(s)",
          content: {
            "application/json": {
              schema: createErrorSchema(updateTodoSchema),
            },
          },
        },
      },
      middleware: [
        withRequiredPermissions({
          todo: ["update"],
        }),
      ],
    }),
    async (c) => {
      const db = c.get("db");
      const userId = c.get("userId");
      const { id } = c.req.valid("param");
      const params = c.req.valid("json");

      const result = await updateTodo(db, { ...params, id }, userId);

      if (!result) return c.json({ message: "Not found" }, 404);

      return c.json(result, 200);
    },
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/{id}",
      summary: "Delete a todo",
      operationId: "deleteTodo",
      description: "Delete a todo by ID.",
      tags: tags,
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
      middleware: [
        withRequiredPermissions({
          todo: ["delete"],
        }),
      ],
    }),
    async (c) => {
      const db = c.get("db");
      const userId = c.get("userId");
      const id = c.req.valid("param").id;

      const result = await deleteTodo(db, { id }, userId);

      return c.json(validateResponse(result, todoResponseSchema));
    },
  );

export const todosRouter = app;
