import { createId } from "@paralleldrive/cuid2";
import { index } from "drizzle-orm/pg-core";

import { timestamps } from "../utils";
import { createTable } from "./_table";

export const posts = createTable(
  "posts",
  (d) => ({
    id: d
      .varchar({ length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),

    title: d.varchar({ length: 256 }).notNull(),
    content: d.varchar({ length: 256 }).notNull(),

    ...timestamps,
  }),
  (t) => [index("title_idx").on(t.title)],
);

export type DB_PostType = typeof posts.$inferSelect;
export type DB_PostInsertType = typeof posts.$inferInsert;
