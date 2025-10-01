import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" }).$onUpdate(() =>
    new Date().toISOString(),
  ),
};
