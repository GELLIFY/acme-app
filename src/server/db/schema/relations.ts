import { defineRelations } from "drizzle-orm";
import { schema } from ".";

export const relations = defineRelations(schema, (r) => ({
  // auth
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    organizationsViaInvitation: r.many.organization({
      from: r.user.id.through(r.invitation.inviterId),
      to: r.organization.id.through(r.invitation.organizationId),
      alias: "user_id_organization_id_via_invitation",
    }),
    organizationsViaMember: r.many.organization({
      alias: "organization_id_user_id_via_member",
    }),
    passkeys: r.many.passkey(),
    twoFactors: r.many.twoFactor(),
    todoTables: r.many.todoTable(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  organization: {
    usersViaInvitation: r.many.user({
      alias: "user_id_organization_id_via_invitation",
    }),
    usersViaMember: r.many.user({
      from: r.organization.id.through(r.member.organizationId),
      to: r.user.id.through(r.member.userId),
      alias: "organization_id_user_id_via_member",
    }),
  },
  passkey: {
    user: r.one.user({
      from: r.passkey.userId,
      to: r.user.id,
    }),
  },
  twoFactor: {
    user: r.one.user({
      from: r.twoFactor.userId,
      to: r.user.id,
    }),
  },

  // app
  todoTable: {
    user: r.one.user({
      from: r.todoTable.userId,
      to: r.user.id,
    }),
  },
}));
