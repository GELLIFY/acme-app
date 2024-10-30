import { serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const post = pgTable("post", {
  id: serial().primaryKey(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),

  title: varchar({ length: 256 }).notNull(),
  content: varchar({ length: 256 }).notNull(),
});
