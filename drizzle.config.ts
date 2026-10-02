import { defineConfig } from "drizzle-kit";

import "@/load-env";

import { env } from "@/env";

export default defineConfig({
  out: "./src/server/db/migrations",
  // drizzle-kit reads the tables of the files it is pointed at, not the
  // `schema` object of the index: the tables of the optional modules are in
  // `src/modules/<module>/tables.ts`.
  schema: ["./src/server/db/schema", "./src/modules/*/tables.ts"],
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
