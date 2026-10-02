import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createTable } from "@/server/db/schema/_table";
import { user } from "@/server/db/schema/auth-schema";

export const passkey = createTable(
  "passkey",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: d.timestamp("created_at"),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: d.text("name"),
    publicKey: d.text("public_key").notNull(),
    credentialID: d.text("credential_id").notNull(),
    counter: d.integer("counter").notNull(),
    deviceType: d.text("device_type").notNull(),
    backedUp: d.boolean("backed_up").notNull(),
    transports: d.text("transports"),
    aaguid: d.text("aaguid"),
  }),
  (table) => [
    index("passkey_userId_idx").on(table.userId),
    index("passkey_credentialID_idx").on(table.credentialID),
  ],
);

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
  }),
}));

// A second `relations(user, ...)`: Drizzle merges them by key, so the user's
// side of the relation lives with the module and goes with it.
export const userPasskeyRelations = relations(user, ({ many }) => ({
  passkeys: many(passkey),
}));
