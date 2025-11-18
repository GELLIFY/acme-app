"server-only";

import { eq } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import { todoTable } from "@/server/db/schema/todos";

type UpsertTodoParams = {
  id?: string;
  text: string;
  completed?: boolean;
};

export async function upsertTodoMutation(
  db: DBClient,
  params: UpsertTodoParams,
) {
  const { id, ...rest } = params;

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
};

export async function deleteTodoMutation(
  db: DBClient,
  params: DeleteTodoParams,
) {
  const [result] = await db
    .delete(todoTable)
    .where(eq(todoTable.id, params.id))
    .returning({
      id: todoTable.id,
      text: todoTable.text,
      completed: todoTable.completed,
    });

  return result;
}
