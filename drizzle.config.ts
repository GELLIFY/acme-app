import { defineConfig } from "drizzle-kit";

import { env } from "@/env";

console.log("env", env.DATABASE_URL);

export default defineConfig({
  out: "./src/server/db/migrations",
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
