import { PGlite } from "@electric-sql/pglite";
import { afterAll, afterEach, beforeEach, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { reset } from "drizzle-seed";

import { db } from "./server/db";
import { schema } from "./server/db/schema";

let client: PGlite;

// Replace the database with a new in-memory database
await mock.module("./server/db", () => {
  client = new PGlite();
  const db = drizzle({
    client,
    schema,
    logger: false,
    casing: "snake_case",
  });
  return { client, db };
});

// Apply migrations before each test
beforeEach(async () => {
  await migrate(db, { migrationsFolder: "src/server/db/migrations" });
});

// Clean up the database after each test
afterEach(async () => {
  await reset(db, schema);
});

// Free up resources after all tests are done
afterAll(async () => {
  await client.close();
});
