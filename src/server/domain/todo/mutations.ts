"server-only";

import { eq } from "drizzle-orm";

import type { DB_TodoInsertType } from "@/server/db/schema/todos";
import { db } from "@/server/db";
import { todo_table } from "@/server/db/schema/todos";

export async function createTodoMutation(params: DB_TodoInsertType) {
  return await db.insert(todo_table).values(params).returning();
}

export async function updateTodoMutation(
  params: Partial<DB_TodoInsertType> & { id: string },
) {
  const { id, ...rest } = params;
  return await db
    .update(todo_table)
    .set(rest)
    .where(eq(todo_table.id, id))
    .returning();
}

export async function deleteTodoMutation(params: { id: string }) {
  return await db
    .update(todo_table)
    .set({ deletedAt: new Date() }) // soft delete
    .where(eq(todo_table.id, params.id));
}
