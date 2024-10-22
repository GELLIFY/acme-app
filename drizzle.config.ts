import { type Config } from "drizzle-kit";

import { env } from "~/env";

// Push requires SSL so use URL instead of username/password
export const connectionStr = new URL(
  `postgresql://${env.DATABASE_URL_EXTERNAL?.split("@")[1]}`,
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
