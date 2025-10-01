"server-only";

import type z from "zod";

import type { DBClient } from "../db";
import type {
  createTodoSchema,
  deleteTodoSchema,
  getTodosSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { shuffleTodos } from "../domain/todo/helpers";
import {
  createTodoMutation,
  deleteTodoMutation,
  updateTodoMutation,
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

export async function getTodoById(db: DBClient, params: { id: string }) {
  return await getTodoByIdQuery(db, params);
}

export async function createTodo(
  db: DBClient,
  params: z.infer<typeof createTodoSchema>,
) {
  return await createTodoMutation(db, params);
}

export async function updateTodo(
  db: DBClient,
  params: z.infer<typeof updateTodoSchema>,
) {
  return await updateTodoMutation(db, params);
}

export async function deleteTodo(
  db: DBClient,
  params: z.infer<typeof deleteTodoSchema>,
) {
  return await deleteTodoMutation(db, params);
}
