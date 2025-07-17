"server-only";

import type z from "zod/v4";

import type {
  createTodoSchema,
  deleteTodoSchema,
  getTodosSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { db } from "../db";
import { shuffleTodos } from "../domain/todo/helpers";
import {
  createTodoMutation,
  deleteTodoMutation,
  updateTodoMutation,
} from "../domain/todo/mutations";
import { getTodoByIdQuery, getTodosQuery } from "../domain/todo/queries";

export async function getTodos(filters?: z.infer<typeof getTodosSchema>) {
  const todos = await getTodosQuery(filters);

  // NOTE: do whatever you want here, map, aggregate filter...
  // result will be cached and typesafety preserved
  return shuffleTodos(todos);
}

export async function getTodoById(params: { id: string }) {
  return await getTodoByIdQuery(params);
}

export async function createTodo(params: z.infer<typeof createTodoSchema>) {
  return await createTodoMutation(db, params);
}

export async function updateTodo(params: z.infer<typeof updateTodoSchema>) {
  return await updateTodoMutation(db, params);
}

export async function deleteTodo(params: z.infer<typeof deleteTodoSchema>) {
  return await deleteTodoMutation(db, params);
}
