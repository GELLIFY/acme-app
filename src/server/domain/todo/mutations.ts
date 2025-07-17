"server-only";

import { eq } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import type { DB_TodoInsertType } from "@/server/db/schema/todos";
import { todo_table } from "@/server/db/schema/todos";

export async function createTodoMutation(
  db: DBClient,
  params: DB_TodoInsertType,
) {
  const [result] = await db
    .insert(todo_table)
    .values(params)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function updateTodoMutation(
  db: DBClient,
  params: Partial<DB_TodoInsertType>,
) {
  const { id, ...rest } = params;
  const [result] = await db
    .update(todo_table)
    .set(rest)
    .where(eq(todo_table.id, id!))
    .returning();

  return result;
}

export async function deleteTodoMutation(db: DBClient, params: { id: string }) {
  return await db
    .update(todo_table)
    .set({ deletedAt: new Date() }) // soft delete
    .where(eq(todo_table.id, params.id))
    .returning();
}
