"server-only";

import { and, eq } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import { todoTable } from "@/server/db/schema/todos";

type CreateTodoParams = {
  text: string;
  userId: string;
};

export async function createTodoMutation(
  db: DBClient,
  params: CreateTodoParams,
) {
  const [todo] = await db.insert(todoTable).values(params).returning();

  if (!todo) {
    throw new Error("Failed to create or update todo");
  }

  return todo;
}

type UpdateTodoParams = {
  id: string;
  text?: string;
  completed?: boolean;
  userId: string;
};

export async function updateTodoMutation(
  db: DBClient,
  params: UpdateTodoParams,
) {
  const { id, userId, ...rest } = params;

  const [todo] = await db
    .update(todoTable)
    .set(rest)
    .where(and(eq(todoTable.id, id), eq(todoTable.userId, userId)))
    .returning();

  return todo;
}

type DeleteTodoParams = {
  id: string;
  userId: string;
};

export async function deleteTodoMutation(
  db: DBClient,
  params: DeleteTodoParams,
) {
  const [result] = await db
    .delete(todoTable)
    .where(
      and(eq(todoTable.id, params.id), eq(todoTable.userId, params.userId)),
    )
    .returning();

  return result;
}
