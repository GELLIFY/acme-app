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
import { logger } from "@/shared/infrastructure/logger";
import { ac, adminRole, formatPermissions, userRole } from "./permissions";

export const auth = betterAuth({
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
        defaultPermissions: async (userId) => {
          // Fetch user role or other data to determine permissions
          const permissions: Statements = {
            todo: ["create"],
          };

          logger.info(
            `Creating API Key for user ${userId} with permissions: ${formatPermissions(permissions)}`,
          );

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
});
