import { index } from "drizzle-orm/pg-core";

import { timestamps } from "../utils";
import { createTable } from "./_table";

export const todo_table = createTable(
  "todo_table",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey().notNull(),

    text: d.varchar({ length: 256 }).notNull(),
    completed: d.boolean().default(false).notNull(),

    ...timestamps,
  }),
  (t) => [index("text_idx").on(t.text)],
);

export type DB_TodoType = typeof todo_table.$inferSelect;
export type DB_TodoInsertType = typeof todo_table.$inferInsert;
