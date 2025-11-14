import { index } from "drizzle-orm/pg-core";
import { timestamps } from "../utils";
import { createTable } from "./_table";

export const user = createTable(
  "user",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    ...timestamps,

    name: d.text("name").notNull(),
    email: d.text("email").notNull().unique(),
    emailVerified: d.boolean("email_verified").default(false).notNull(),
    image: d.text("image"),
    twoFactorEnabled: d.boolean("two_factor_enabled").default(false),
  }),
  (t) => [index("user_email_idx").on(t.email)],
);

export const session = createTable(
  "session",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    ...timestamps,

    expiresAt: d.timestamp("expires_at").notNull(),
    token: d.text("token").notNull().unique(),
    ipAddress: d.text("ip_address"),
    userAgent: d.text("user_agent"),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [
    index("session_user_id_idx").on(t.userId),
    index("session_token_idx").on(t.token),
  ],
);

export const account = createTable(
  "account",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    ...timestamps,

    accountId: d.text("account_id").notNull(),
    providerId: d.text("provider_id").notNull(),
    accessToken: d.text("access_token"),
    refreshToken: d.text("refresh_token"),
    idToken: d.text("id_token"),
    accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
    scope: d.text("scope"),
    password: d.text("password"),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = createTable(
  "verification",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    ...timestamps,

    identifier: d.text("identifier").notNull(),
    value: d.text("value").notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

export const passkey = createTable(
  "passkey",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    createdAt: d.timestamp("created_at"),

    name: d.text("name"),
    publicKey: d.text("public_key").notNull(),
    credentialID: d.text("credential_id").notNull(),
    counter: d.integer("counter").notNull(),
    deviceType: d.text("device_type").notNull(),
    backedUp: d.boolean("backed_up").notNull(),
    transports: d.text("transports"),
    aaguid: d.text("aaguid"),

    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("passkey_user_id_idx").on(t.userId)],
);

export const twoFactor = createTable(
  "two_factor",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    secret: d.text("secret").notNull(),
    backupCodes: d.text("backup_codes").notNull(),
    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("two_factor_secret_idx").on(t.secret)],
);
