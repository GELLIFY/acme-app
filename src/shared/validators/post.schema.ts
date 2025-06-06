import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod/v4";

import { todo_table } from "@/server/db/schema/todos";

export const createTodoSchema = createInsertSchema(todo_table);

export const updateTodoSchema = createUpdateSchema(todo_table, {
  id: z.string(),
});

export const deleteTodoSchema = z.object({ id: z.string() });
