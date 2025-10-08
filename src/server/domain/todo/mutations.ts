"server-only";

import { eq } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import { todo_table } from "@/server/db/schema/todos";

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
    .insert(todo_table)
    .values({ id, ...rest })
    .onConflictDoUpdate({
      target: todo_table.id,
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
    .delete(todo_table)
    .where(eq(todo_table.id, params.id))
    .returning({
      id: todo_table.id,
      text: todo_table.text,
      completed: todo_table.completed,
    });

  return result;
}
