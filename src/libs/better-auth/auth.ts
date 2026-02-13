import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { apiKey, lastLoginMethod, openAPI } from "better-auth/plugins";
import type { Statements } from "better-auth/plugins/access";
import { admin } from "better-auth/plugins/admin";
import { twoFactor } from "better-auth/plugins/two-factor";
import { instrumentBetterAuth } from "@/infrastructure/otel/otel-better-auth";
import { db } from "@/server/db";
import { schema } from "@/server/db/schema";
import {
  sendChangeEmailConfirmationEmail,
  sendDeleteAccountVerificationEmail,
  sendEmailVerificationEmail,
  sendResetPasswordEmail,
} from "@/server/services/email-service";
import { ac, adminRole, userRole } from "./permissions";

export const auth = instrumentBetterAuth(
  betterAuth({
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
      apiKey({
        permissions: {
          defaultPermissions: async (_userId) => {
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
      twoFactor(),
      openAPI({ disableDefaultReference: true }),
      nextCookies(),
    ],
  }),
);
