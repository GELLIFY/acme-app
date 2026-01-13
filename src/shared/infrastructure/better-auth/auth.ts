import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  apiKey,
  lastLoginMethod,
  openAPI,
  type Statements,
  twoFactor,
} from "better-auth/plugins";
import { db } from "@/server/db";
import { schema } from "@/server/db/schema";
import {
  sendChangeEmailConfirmationEmail,
  sendDeleteAccountVerificationEmail,
  sendEmailVerificationEmail,
  sendResetPasswordEmail,
} from "@/server/services/email-service";
import { instrumentBetterAuth } from "../otel/otel-better-auth";
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
