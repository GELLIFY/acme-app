import { neonConfig } from "@neondatabase/serverless";
import { type Config } from "drizzle-kit";

import { env } from "~/env";

// TODO: remove when next-auth postgres edge problems resolves
// #ref: https://github.com/vercel/next.js/discussions/50177
if (!process.env.VERCEL_ENV) {
  // Set the WebSocket proxy to work with the local instance
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;

  // Disable all authentication and encryption
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

// Push requires SSL so use URL instead of username/password
export const connectionStr = new URL(
  `postgresql://${env.DATABASE_URL_EXTERNAL.split("@")[1]}`,
);
connectionStr.username = env.POSTGRES_USER;
connectionStr.password = env.POSTGRES_PASSWORD;
// connectionStr.searchParams.set("sslmode", 'require');

export default {
  dialect: "postgresql", // "postgresql" | "mysql"
  dbCredentials: {
    url: connectionStr.toString(),
  },
  schema: "./src/server/db/schema",
} satisfies Config;
