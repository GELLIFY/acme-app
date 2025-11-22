import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, openAPI, twoFactor } from "better-auth/plugins";
import { db } from "@/server/db";
import { ac, adminRole, userRole } from "./permissions";

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
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ url }) => {
      // TODO: send email here
      console.log(`Click the link to reset your password: ${url}`);
    },
    onPasswordReset: async ({ user }) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
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
      sendChangeEmailConfirmation: async ({ newEmail, url }) => {
        // TODO: send email here
        console.log(
          `Click the link to approve the change to ${newEmail}: ${url}`,
        );
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        // TODO: send email here
        console.log(`Delete ${user.email} by visiting ${url}.`);
      },
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
    apiKey({ enableSessionForAPIKeys: true }),
    passkey(),
    twoFactor(),
    openAPI({ disableDefaultReference: true }),
    nextCookies(),
  ],
});
