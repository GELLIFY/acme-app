"server-only";

import type z from "zod/v4";
import { eq } from "drizzle-orm";

import type {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "@/shared/validators/post.schema";
import { db } from "@/server/db";
import { todo_table } from "@/server/db/schema/todos";

export async function createTodo(params: z.infer<typeof createTodoSchema>) {
  await db.insert(todo_table).values(params);
}

export async function updateTodo(params: z.infer<typeof updateTodoSchema>) {
  const { id, ...rest } = params;
  await db.update(todo_table).set(rest).where(eq(todo_table.id, id));
}

export async function deleteTodo(params: z.infer<typeof deleteTodoSchema>) {
  await db.delete(todo_table).where(eq(todo_table.id, params.id));
}
