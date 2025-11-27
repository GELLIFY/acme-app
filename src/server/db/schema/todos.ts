import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { createTable } from "./_table";
import { user } from "./auth-schema";

export const todoTable = createTable(
  "todo_table",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    ...timestamps,

    userId: d
      .uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    text: d.varchar({ length: 256 }).notNull(),
    completed: d.boolean().default(false).notNull(),
  }),
  (t) => [index("user_id_idx").on(t.userId)],
);

export const todoRelations = relations(todoTable, ({ one }) => ({
  user: one(user, {
    fields: [todoTable.userId],
    references: [user.id],
  }),
}));

export type DB_TodoType = typeof todoTable.$inferSelect;
export type DB_TodoInsertType = typeof todoTable.$inferInsert;
