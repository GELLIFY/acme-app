import { createId } from "@paralleldrive/cuid2";
import { varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../utils";
import { pgTable } from "./_table";

export const posts = pgTable("posts", {
  id: varchar({ length: 128 })
    .$defaultFn(() => createId())
    .notNull(),

  title: varchar({ length: 256 }).notNull(),
  content: varchar({ length: 256 }).notNull(),

  ...timestamps,
});

export type DB_PostType = typeof posts.$inferSelect;
export type DB_PostInsertType = typeof posts.$inferInsert;
