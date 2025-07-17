"server-only";

import { and, desc, eq, ilike, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/server/db";
import { todo_table } from "@/server/db/schema/todos";

type GetTodosRequest = {
  text: string | null;
  completed: boolean | null;
  deleted: boolean | null;
};

export async function getTodosQuery(filters?: GetTodosRequest) {
  // @ts-expect-error placeholder condition incase we don't have any filters
  const where = [eq(1, 1)];

  if (filters?.text) {
    where.push(ilike(todo_table.text, filters.text));
  }

  if (filters?.completed) {
    where.push(eq(todo_table.completed, filters.completed));
  }

  if (filters?.deleted) {
    where.push(isNotNull(todo_table.deletedAt));
  } else {
    where.push(isNull(todo_table.deletedAt));
  }

  return await db
    .select({
      id: todo_table.id,
      text: todo_table.text,
      completed: todo_table.completed,
    })
    .from(todo_table)
    .where(and(...where))
    .orderBy(desc(todo_table.createdAt))
    .limit(10);
}

type GetTodoByIdRequest = {
  id: string;
};

export async function getTodoByIdQuery(params: GetTodoByIdRequest) {
  const result = await db
    .select()
    .from(todo_table)
    .where(eq(todo_table.id, params.id));

  return result[0];
}
