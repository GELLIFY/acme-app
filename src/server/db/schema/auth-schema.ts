import { timestamps } from "../utils";
import { createTable } from "./_table";

export const user = createTable("user", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  ...timestamps,

  name: d.text("name").notNull(),
  email: d.text("email").notNull().unique(),
  emailVerified: d.boolean("email_verified").default(false).notNull(),
  image: d.text("image"),
}));

export const session = createTable("session", (d) => ({
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
}));

export const account = createTable("account", (d) => ({
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
}));

export const verification = createTable("verification", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  ...timestamps,

  identifier: d.text("identifier").notNull(),
  value: d.text("value").notNull(),
  expiresAt: d.timestamp("expires_at").notNull(),
}));
