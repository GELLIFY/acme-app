"server-only";

import type z from "zod";
import type {
  getTodoByIdSchema,
  getTodosSchema,
  upsertTodoSchema,
} from "@/shared/validators/todo.schema";
import type { DBClient } from "../db";
import { shuffleTodos } from "../domain/todo/helpers";
import {
  deleteTodoMutation,
  upsertTodoMutation,
} from "../domain/todo/mutations";
import { getTodoByIdQuery, getTodosQuery } from "../domain/todo/queries";

export async function getTodos(
  db: DBClient,
  filters: z.infer<typeof getTodosSchema>,
) {
  const todos = await getTodosQuery(db, filters);

  // NOTE: do whatever you want here, map, aggregate filter...
  // result will be cached and typesafety preserved
  return shuffleTodos(todos);
}

export async function getTodoById(
  db: DBClient,
  filters: z.infer<typeof getTodoByIdSchema>,
) {
  return await getTodoByIdQuery(db, filters);
}

export async function upsertTodo(
  db: DBClient,
  params: z.infer<typeof upsertTodoSchema>,
) {
  return await upsertTodoMutation(db, params);
}

export async function deleteTodo(
  db: DBClient,
  params: z.infer<typeof getTodoByIdSchema>,
) {
  return await deleteTodoMutation(db, params);
}
