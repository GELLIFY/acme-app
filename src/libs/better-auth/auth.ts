import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod, openAPI } from "better-auth/plugins";
import { authModules } from "@/modules/auth";
import { pluginsOf } from "@/modules/registry";
import { db } from "@/server/db";
import { schema } from "@/server/db/schema";
import {
  sendChangeEmailConfirmationEmail,
  sendDeleteAccountVerificationEmail,
  sendEmailVerificationEmail,
  sendResetPasswordEmail,
} from "@/server/services/email-service";

export const auth = betterAuth({
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
    lastLoginMethod(),
    openAPI({ disableDefaultReference: true }),
    ...pluginsOf(authModules),
    // Last: it sets the cookies of what the plugins before it answered.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
