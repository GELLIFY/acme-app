import { index } from "drizzle-orm/pg-core";

import { timestamps } from "../utils";
import { createTable } from "./_table";
import { user } from "./auth-schema";

export const todoTable = createTable(
  "todo_table",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey().notNull(),
    ...timestamps,

    userId: d
      .uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    text: d.varchar({ length: 256 }).notNull(),
    completed: d.boolean().default(false).notNull(),
  }),
  (t) => [index("text_idx").on(t.text)],
);

export type DB_TodoType = typeof todoTable.$inferSelect;
export type DB_TodoInsertType = typeof todoTable.$inferInsert;
