import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createTable } from "./_table";

export const user = createTable("user", (d) => ({
  id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  name: d.text("name").notNull(),
  email: d.text("email").notNull().unique(),
  emailVerified: d.boolean("email_verified").default(false).notNull(),
  image: d.text("image"),
  role: d.text("role"),
  banned: d.boolean("banned").default(false),
  banReason: d.text("ban_reason"),
  banExpires: d.timestamp("ban_expires"),
  twoFactorEnabled: d.boolean("two_factor_enabled").default(false),
}));

export const session = createTable(
  "session",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    expiresAt: d.timestamp("expires_at").notNull(),
    token: d.text("token").notNull().unique(),
    ipAddress: d.text("ip_address"),
    userAgent: d.text("user_agent"),
    impersonatedBy: d.text("impersonated_by"),
  }),
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = createTable(
  "account",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    accountId: d.text("account_id").notNull(),
    providerId: d.text("provider_id").notNull(),
    accessToken: d.text("access_token"),
    refreshToken: d.text("refresh_token"),
    idToken: d.text("id_token"),
    accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
    scope: d.text("scope"),
    password: d.text("password"),
  }),
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = createTable(
  "verification",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),

    identifier: d.text("identifier").notNull(),
    value: d.text("value").notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
  }),
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const apikey = createTable(
  "apikey",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: d.timestamp("created_at").notNull(),
    updatedAt: d.timestamp("updated_at").notNull(),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: d.text("name"),
    start: d.text("start"),
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
    permissions: d.text("permissions"),
    metadata: d.text("metadata"),
  }),
  (table) => [
    index("apikey_key_idx").on(table.key),
    index("apikey_userId_idx").on(table.userId),
  ],
);

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
  }),
  (table) => [
    index("twoFactor_secret_idx").on(table.secret),
    index("twoFactor_userId_idx").on(table.userId),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  apikeys: many(apikey),
  passkeys: many(passkey),
  twoFactors: many(twoFactor),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const apikeyRelations = relations(apikey, ({ one }) => ({
  user: one(user, {
    fields: [apikey.userId],
    references: [user.id],
  }),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
  }),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}));
