import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  dialect: "postgresql", // "postgresql" | "mysql"
  dbCredentials: {
    url: env.DATABASE_URL_EXTERNAL,
  },
  schema: "./src/server/db/schema",
  out: "./src/server/db/migrations",
} satisfies Config;
