import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { parseAsBoolean, parseAsString } from "nuqs/server";
import z from "zod/v4";

import { todo_table } from "@/server/db/schema/todos";

export const selectTodoSchema = createSelectSchema(todo_table);

export const createTodoSchema = createInsertSchema(todo_table);

export const updateTodoSchema = createUpdateSchema(todo_table);

export const deleteTodoSchema = z.object({ id: z.string() });

// Query filter schema
export const todoFilterSchema = z
  .object({
    text: z.string().nullable(),
    completed: z.boolean().nullable(),
    deleted: z.boolean().default(false),
  })
  .optional();

// Search params filter schema
export const todoFilterParamsSchema = {
  text: parseAsString,
  completed: parseAsBoolean,
  deleted: parseAsBoolean.withDefault(false),
};
