import { sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createTable } from "@/server/db/schema/_table";

// No relation: `referenceId` is the user or the organization the key belongs
// to, so it is text and has no foreign key.
export const apikey = createTable(
  "apikey",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    configId: d.text("config_id").default("default").notNull(),
    name: d.text("name"),
    start: d.text("start"),
    referenceId: d.text("reference_id").notNull(),
    prefix: d.text("prefix"),
    key: d.text("key").notNull(),
    refillInterval: d.integer("refill_interval"),
    refillAmount: d.integer("refill_amount"),
    lastRefillAt: d.timestamp("last_refill_at"),
    enabled: d.boolean("enabled").default(true),
    rateLimitEnabled: d.boolean("rate_limit_enabled").default(true),
    rateLimitTimeWindow: d.integer("rate_limit_time_window").default(86400000),
    rateLimitMax: d.integer("rate_limit_max").default(10),
    requestCount: d.integer("request_count").default(0),
    remaining: d.integer("remaining"),
    lastRequest: d.timestamp("last_request"),
    expiresAt: d.timestamp("expires_at"),
    createdAt: d.timestamp("created_at").notNull(),
    updatedAt: d.timestamp("updated_at").notNull(),
    permissions: d.text("permissions"),
    metadata: d.text("metadata"),
  }),
  (table) => [
    index("apikey_configId_idx").on(table.configId),
    index("apikey_referenceId_idx").on(table.referenceId),
    index("apikey_key_idx").on(table.key),
  ],
);
