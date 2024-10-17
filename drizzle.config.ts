import { neonConfig } from "@neondatabase/serverless";
import { type Config } from "drizzle-kit";

import { env } from "~/env";

// TODO: remove when next-auth postgres edge problems resolves
// #ref: https://github.com/vercel/next.js/discussions/50177
// Set the WebSocket proxy to work with the local instance
neonConfig.wsProxy = (host) => `${host}:5433/v1`;
// Disable all authentication and encryption
neonConfig.useSecureWebSocket = false;
neonConfig.pipelineTLS = false;
neonConfig.pipelineConnect = false;

export default {
  dialect: "postgresql", // "postgresql" | "mysql"
  dbCredentials: {
    url: env.DATABASE_URL_EXTERNAL,
  },
  schema: "./src/server/db/schema",
} satisfies Config;
