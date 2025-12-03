"server-only";

import type z from "zod";
import type { DBClient } from "@/server/db";
import type {
  createTodoSchema,
  getTodoByIdSchema,
  getTodosSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { shuffleTodos } from "./helpers";
import {
  createTodoMutation,
  deleteTodoMutation,
  updateTodoMutation,
} from "./mutations";
import { getTodoByIdQuery, getTodosQuery } from "./queries";

export async function getTodos(
  db: DBClient,
  filters: z.infer<typeof getTodosSchema>,
  userId: string,
) {
  const todos = await getTodosQuery(db, { ...filters, userId });

  // NOTE: do whatever you want here, map, aggregate filter...
  // result will be cached and typesafety preserved
  return shuffleTodos(todos);
}

export async function getTodoById(
  db: DBClient,
  filters: z.infer<typeof getTodoByIdSchema>,
  userId: string,
) {
  return await getTodoByIdQuery(db, { ...filters, userId });
}

export async function createTodo(
  db: DBClient,
  params: z.infer<typeof createTodoSchema>,
  userId: string,
) {
  return await createTodoMutation(db, { ...params, userId });
}

export async function updateTodo(
  db: DBClient,
  params: z.infer<typeof updateTodoSchema>,
  userId: string,
) {
  return await updateTodoMutation(db, { ...params, userId });
}

export async function deleteTodo(
  db: DBClient,
  params: z.infer<typeof getTodoByIdSchema>,
  userId: string,
) {
  return await deleteTodoMutation(db, { ...params, userId });
}
