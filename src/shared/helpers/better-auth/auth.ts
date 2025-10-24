import { instrumentBetterAuth } from "@kubiks/otel-better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/server/db";

export const auth = instrumentBetterAuth(
  betterAuth({
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
      async sendResetPassword(_data, _request) {
        // Send an email to the user with a link to reset their password
      },
    },
    plugins: [nextCookies()],
  }),
);
