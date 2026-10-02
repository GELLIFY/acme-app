import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createTable } from "@/server/db/schema/_table";
import { user } from "@/server/db/schema/auth-schema";

export const twoFactor = createTable(
  "two_factor",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    secret: d.text("secret").notNull(),
    backupCodes: d.text("backup_codes").notNull(),
    verified: d.boolean("verified").default(true),
    failedVerificationCount: d.integer("failed_verification_count").default(0),
    lockedUntil: d.timestamp("locked_until"),
  }),
  (table) => [
    index("twoFactor_secret_idx").on(table.secret),
    index("twoFactor_userId_idx").on(table.userId),
  ],
);

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}));

// A second `relations(user, ...)`: Drizzle merges them by key, so the user's
// side of the relation lives with the module and goes with it.
export const userTwoFactorRelations = relations(user, ({ many }) => ({
  twoFactors: many(twoFactor),
}));
