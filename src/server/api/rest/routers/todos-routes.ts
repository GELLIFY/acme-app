import { createRoute } from "@hono/zod-openapi";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "@/server/domains/todo/todo-service";
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
import {
  forbiddenSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "../utils/not-found-schema";
import { createRouter } from "./_app";

const tags = ["Todos"];

export const todosRouter = createRouter()
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
          description: "The list of todos",
          content: {
            "application/json": {
              schema: todosResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: unauthorizedSchema(),
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: forbiddenSchema(),
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

      return c.json(result, 200);
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
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: unauthorizedSchema(),
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: forbiddenSchema(),
            },
          },
        },
        404: {
          description: "Todo not found",
          content: {
            "application/json": {
              schema: notFoundSchema(),
            },
          },
        },
        422: {
          description: "The validation error(s)",
          content: {
            "application/json": {
              schema: createErrorSchema(getTodoByIdSchema),
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

      if (!result) return c.json({ message: "Todo not found" }, 404);

      return c.json(result, 200);
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
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: unauthorizedSchema(),
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: forbiddenSchema(),
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
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: unauthorizedSchema(),
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: forbiddenSchema(),
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
        204: {
          description: "Todo deleted",
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: unauthorizedSchema(),
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: forbiddenSchema(),
            },
          },
        },
        404: {
          description: "Todo not found",
          content: {
            "application/json": {
              schema: notFoundSchema(),
            },
          },
        },
        422: {
          description: "The validation error(s)",
          content: {
            "application/json": {
              schema: createErrorSchema(getTodoByIdSchema),
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

      const deleted = await deleteTodo(db, { id }, userId);

      if (!deleted) return c.json({ message: "Todo not found" }, 404);

      return c.body(null, 204);
    },
  );
