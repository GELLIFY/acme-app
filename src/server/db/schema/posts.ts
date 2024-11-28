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

export type SelectPost = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
