"server-only";

import { and, desc, eq, ilike } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import { todoTable } from "@/server/db/schema/todos";

type GetTodosRequest = {
  text?: string | null;
  completed?: boolean | null;
  userId: string;
};

export async function getTodosQuery(db: DBClient, filters: GetTodosRequest) {
  const where = [eq(todoTable.userId, filters.userId)];

  if (filters?.text) {
    where.push(ilike(todoTable.text, filters.text));
  }

  if (filters?.completed) {
    where.push(eq(todoTable.completed, filters.completed));
  }

  return await db
    .select({
      id: todoTable.id,
      text: todoTable.text,
      completed: todoTable.completed,
    })
    .from(todoTable)
    .where(and(...where))
    .orderBy(desc(todoTable.createdAt))
    .limit(10);
}

type GetTodoByIdRequest = {
  id: string;
  userId: string;
};

export async function getTodoByIdQuery(
  db: DBClient,
  params: GetTodoByIdRequest,
) {
  const [result] = await db
    .select({
      id: todoTable.id,
      text: todoTable.text,
      completed: todoTable.completed,
    })
    .from(todoTable)
    .where(
      and(eq(todoTable.id, params.id), eq(todoTable.userId, params.userId)),
    )
    .limit(1);

  return result;
}
