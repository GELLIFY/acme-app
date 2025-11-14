import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { openAPI, twoFactor } from "better-auth/plugins";
import { db } from "@/server/db";

export const auth = betterAuth({
  advanced: {
    database: {
      generateId: false,
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
  user: {
    changeEmail: {
      enabled: true,
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
    twoFactor(),
    openAPI({ disableDefaultReference: true }),
    nextCookies(),
  ],
});
