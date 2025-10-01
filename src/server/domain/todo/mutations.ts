"server-only";

import { eq } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import { todo_table } from "@/server/db/schema/todos";

type CreateTodoParams = {
  text: string;
  completed?: boolean;
};

export async function createTodoMutation(
  db: DBClient,
  params: CreateTodoParams,
) {
  const [result] = await db
    .insert(todo_table)
    .values(params)
    .onConflictDoNothing()
    .returning();

  return result;
}

type UpdateTodoParams = {
  id: string;
  text?: string;
  completed?: boolean;
};

export async function updateTodoMutation(
  db: DBClient,
  params: UpdateTodoParams,
) {
  const { id, ...rest } = params;
  const [result] = await db
    .update(todo_table)
    .set(rest)
    .where(eq(todo_table.id, id))
    .returning();

  return result;
}

type DeleteTodoParams = {
  id: string;
};

export async function deleteTodoMutation(
  db: DBClient,
  params: DeleteTodoParams,
) {
  return await db
    .delete(todo_table)
    .where(eq(todo_table.id, params.id))
    .returning();
}
