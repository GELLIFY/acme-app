import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { schema } from ".";
import { postsMock } from "./data/posts-mock";
import { connectionStr } from "drizzle.config";

const queryClient = postgres(connectionStr.toString());
const db = drizzle(queryClient);

console.log("Seed start");
// eslint-disable-next-line drizzle/enforce-delete-with-where
await db.delete(schema.post);
await db.insert(schema.post).values(postsMock);
console.log("Seed done");

// closing connection
await queryClient.end();
