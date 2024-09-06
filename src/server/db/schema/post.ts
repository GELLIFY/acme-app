import { serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),

  title: varchar("name", { length: 256 }).notNull(),
  content: varchar("content", { length: 256 }).notNull(),
});
