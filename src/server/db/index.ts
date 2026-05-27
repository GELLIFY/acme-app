import { instrumentDrizzleClient } from "@kubiks/otel-drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/env";
import { schema } from "./schema";

const drizzleClient = drizzle(
  new Pool({ connectionString: env.DATABASE_URL }),
  {
    schema,
    casing: "snake_case",
  },
);

// Add instrumentation
instrumentDrizzleClient(drizzleClient, {
  dbSystem: "postgresql",
  tracerName: "drizzle",
});

export const db = drizzleClient;

// Helper type for database client
export type DBType = typeof db;
export type TXType = Parameters<Parameters<DBType["transaction"]>[0]>[0];
export type DBClient = DBType | TXType;
