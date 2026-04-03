import { defineConfig } from "drizzle-kit";

import { env } from "@/env";

export default defineConfig({
  out: "./src/server/db/migrations",
  schema: "./src/server/db/schema",
  schemaFilter: "public",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
