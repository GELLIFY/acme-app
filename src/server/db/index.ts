import "dotenv/config";

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

import { env } from "~/env";
import * as post from "./schema/posts";

let connectionString = env.DATABASE_URL;

// Configuring Neon for local development
// https://neon.tech/guides/local-development-with-neon#local-postgresql
if (env.NODE_ENV === "development") {
  connectionString = `postgres://postgres:postgres@db.localtest.me:5432/main`;
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
    return `${protocol}://${host}:${port}/sql`;
  };
  const connectionStringUrl = new URL(connectionString);
  neonConfig.useSecureWebSocket =
    connectionStringUrl.hostname !== "db.localtest.me";
  //@ts-expect-error bad typings
  neonConfig.wsProxy = (host) =>
    host === "db.localtest.me" ? `${host}:4444/v1` : undefined;
  neonConfig.webSocketConstructor = ws;
}

export const schema = { ...post };

export const sql = neon(connectionString);

export const db = drizzle({
  client: sql,
  schema: schema,
  logger: env.NODE_ENV !== "production",
  casing: "snake_case",
});
