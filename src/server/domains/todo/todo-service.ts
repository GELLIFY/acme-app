"server-only";

import { and, desc, eq, ilike } from "drizzle-orm";
import type z from "zod";

import type { DBClient } from "@/server/db";
import type { DB_TodoType } from "@/server/db/schema/todos";
import { todoTable } from "@/server/db/schema/todos";
import type {
  createTodoSchema,
  getTodoByIdSchema,
  getTodosSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { shuffleTodos } from "./helpers";

// The projection every list/detail read returns. Exported so domain logic
// (helpers) and its tests share one source of truth for the row shape.
export type TodoListItem = Pick<DB_TodoType, "id" | "text" | "completed">;

const todoColumns = {
  id: todoTable.id,
  text: todoTable.text,
  completed: todoTable.completed,
};

export async function getTodos(
  db: DBClient,
  filters: z.infer<typeof getTodosSchema>,
  userId: string,
) {
  const where = [eq(todoTable.userId, userId)];

  if (filters.text) {
    where.push(ilike(todoTable.text, `%${filters.text}%`));
  }
  if (filters.completed) {
    where.push(eq(todoTable.completed, filters.completed));
  }

  const todos = await db
    .select(todoColumns)
    .from(todoTable)
    .where(and(...where))
    .orderBy(desc(todoTable.createdAt))
    .limit(10);

  // Domain logic lives in the service: shape/aggregate rows before returning.
  return shuffleTodos(todos);
}

export async function getTodoById(
  db: DBClient,
  { id }: z.infer<typeof getTodoByIdSchema>,
  userId: string,
) {
  const [todo] = await db
    .select(todoColumns)
    .from(todoTable)
    .where(and(eq(todoTable.id, id), eq(todoTable.userId, userId)))
    .limit(1);

  return todo;
}

export async function createTodo(
  db: DBClient,
  { text }: z.infer<typeof createTodoSchema>,
  userId: string,
) {
  const [todo] = await db
    .insert(todoTable)
    .values({ text, userId })
    .returning();

  if (!todo) {
    throw new Error("Failed to create todo");
  }

  return todo;
}

export async function updateTodo(
  db: DBClient,
  { id, ...rest }: z.infer<typeof updateTodoSchema>,
  userId: string,
) {
  const [todo] = await db
    .update(todoTable)
    .set(rest)
    .where(and(eq(todoTable.id, id), eq(todoTable.userId, userId)))
    .returning();

  return todo;
}

export async function deleteTodo(
  db: DBClient,
  { id }: z.infer<typeof getTodoByIdSchema>,
  userId: string,
) {
  const [todo] = await db
    .delete(todoTable)
    .where(and(eq(todoTable.id, id), eq(todoTable.userId, userId)))
    .returning();

  return todo;
}
