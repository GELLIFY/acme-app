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
  await db.insert(todo_table).values(params);
}

export async function updateTodoMutation(
  params: z.infer<typeof updateTodoSchema>,
) {
  const { id, ...rest } = params;
  await db.update(todo_table).set(rest).where(eq(todo_table.id, id!));
}

export async function deleteTodoMutation(
  params: z.infer<typeof deleteTodoSchema>,
) {
  await db
    .update(todo_table)
    .set({ deletedAt: new Date() }) // soft delete
    .where(eq(todo_table.id, params.id));
}
