"server-only";

import { and, eq } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import { todoTable } from "@/server/db/schema/todos";

type UpsertTodoParams = {
  id?: string;
  text: string;
  completed?: boolean;
  userId: string;
};

export async function upsertTodoMutation(
  db: DBClient,
  params: UpsertTodoParams,
) {
  const { id, ...rest } = params;

  // FIXME: right now we could potentially update the todo of another user
  const [todo] = await db
    .insert(todoTable)
    .values({ id, ...rest })
    .onConflictDoUpdate({
      target: todoTable.id,
      set: {
        text: rest.text,
        completed: rest.completed,
      },
    })
    .returning();

  if (!todo) {
    throw new Error("Failed to create or update todo");
  }

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
    .returning({
      id: todoTable.id,
      text: todoTable.text,
      completed: todoTable.completed,
    });

  return result;
}
