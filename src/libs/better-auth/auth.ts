import { apiKey } from "@better-auth/api-key";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod, openAPI, organization } from "better-auth/plugins";
import type { Statements } from "better-auth/plugins/access";
import { admin } from "better-auth/plugins/admin";
import { twoFactor } from "better-auth/plugins/two-factor";
import { instrumentBetterAuth } from "@/libs/better-auth/otel-better-auth";
import { db } from "@/server/db";
import { schema } from "@/server/db/schema";
import {
  sendChangeEmailConfirmationEmail,
  sendDeleteAccountVerificationEmail,
  sendEmailVerificationEmail,
  sendOrganizationInvitationEmail,
  sendResetPasswordEmail,
} from "@/server/services/email-service";
import { ac, adminRole, userRole } from "./permissions";

export const auth = instrumentBetterAuth(
  betterAuth({
    appName: "Acme App",
    experimental: {
      joins: true,
    },
    advanced: {
      database: {
        generateId: "uuid",
      },
    },
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ url, user }) => {
        await sendResetPasswordEmail({ url, user });
      },
    },
    // session: {
    //   cookieCache: {
    //     enabled: true,
    //     maxAge: 5 * 60, // 5 min
    //   },
    // },
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailConfirmation: async ({ newEmail, url, user }) => {
          await sendChangeEmailConfirmationEmail({ newEmail, url, user });
        },
      },
      deleteUser: {
        enabled: true,
        sendDeleteAccountVerification: async ({ user, url }) => {
          await sendDeleteAccountVerificationEmail({ user, url });
        },
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmailVerificationEmail({ user, url });
      },
    },
    plugins: [
      admin({
        ac,
        roles: {
          admin: adminRole,
          user: userRole,
        },
      }),
      organization({
        organizationLimit: 5,
        cancelPendingInvitationsOnReInvite: true,
        async sendInvitationEmail(data) {
          const inviteLink = `https://example.com/accept-invitation/${data.id}`;
          sendOrganizationInvitationEmail({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          });
        },
      }),
      apiKey({
        permissions: {
          defaultPermissions: async (_referenceId) => {
            // Fetch user role or other data to determine permissions
            const permissions: Statements = {
              todo: ["create"],
            };

            return {
              ...permissions,
            };
          },
        },
      }),
      lastLoginMethod(),
      passkey(),
      twoFactor({
        issuer: "Acme App",
      }),
      openAPI({ disableDefaultReference: true }),
      nextCookies(),
    ],
  }),
);

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization;
export type Organization = typeof auth.$Infer.Organization;
export type OrganizationRole = ActiveOrganization["members"][number]["role"];
