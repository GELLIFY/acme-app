"server-only";

import type z from "zod";
import type { DBClient } from "@/server/db";
import type {
  getTodoByIdSchema,
  getTodosSchema,
  upsertTodoSchema,
} from "@/shared/validators/todo.schema";
import { shuffleTodos } from "./helpers";
import { deleteTodoMutation, upsertTodoMutation } from "./mutations";
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

export async function upsertTodo(
  db: DBClient,
  params: z.infer<typeof upsertTodoSchema>,
  userId: string,
) {
  return await upsertTodoMutation(db, { ...params, userId });
}

export async function deleteTodo(
  db: DBClient,
  params: z.infer<typeof getTodoByIdSchema>,
  userId: string,
) {
  return await deleteTodoMutation(db, { ...params, userId });
}
