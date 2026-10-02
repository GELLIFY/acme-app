import { relations, sql } from "drizzle-orm";
import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { createTable } from "@/server/db/schema/_table";
import { user } from "@/server/db/schema/auth-schema";

export const organization = createTable(
  "organization",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    name: d.text("name").notNull(),
    slug: d.text("slug").notNull().unique(),
    logo: d.text("logo"),
    createdAt: d.timestamp("created_at").notNull(),
    metadata: d.text("metadata"),
  }),
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = createTable(
  "member",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    organizationId: d
      .uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: d.text("role").default("member").notNull(),
    createdAt: d.timestamp("created_at").notNull(),
  }),
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = createTable(
  "invitation",
  (d) => ({
    id: d.uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    organizationId: d
      .uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: d.text("email").notNull(),
    role: d.text("role"),
    status: d.text("status").default("pending").notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    inviterId: d
      .uuid("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

// A second `relations(user, ...)`: Drizzle merges them by key, so the user's
// side of the relations lives with the module and goes with it.
export const userOrganizationRelations = relations(user, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));
