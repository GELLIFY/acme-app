"server-only";

import type z from "zod/v4";
import { eq } from "drizzle-orm";

import type {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { db } from "@/server/db";
import { todo_table } from "@/server/db/schema/todos";

export async function createTodoMutation(
  params: z.infer<typeof createTodoSchema>,
) {
  return await db.insert(todo_table).values(params).returning();
}

export async function updateTodoMutation(
  params: z.infer<typeof updateTodoSchema>,
) {
  const { id, ...rest } = params;
  return await db
    .update(todo_table)
    .set(rest)
    .where(eq(todo_table.id, id))
    .returning();
}

export async function deleteTodoMutation(
  params: z.infer<typeof deleteTodoSchema>,
) {
  return await db
    .update(todo_table)
    .set({ deletedAt: new Date() }) // soft delete
    .where(eq(todo_table.id, params.id));
}
