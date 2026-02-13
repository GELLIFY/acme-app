import "dotenv/config";

import { reset, seed } from "drizzle-seed";
import { auth } from "@/libs/better-auth/auth";
import { db } from ".";
import { schema } from "./schema";
import { account, user } from "./schema/auth-schema";
import { todoTable } from "./schema/todos";

async function main() {
  await reset(db, schema);

  // create a default user for seeding
  const [createdUser] = await db
    .insert(user)
    .values({
      email: "matteo.badini@gellify.com",
      name: "Matteo Badini",
    })
    .returning({ id: user.id });

  // if something went wrong force exit
  if (!createdUser) throw new Error("Error creating user");

  // this will create a credential account with a default password
  const context = await auth.$context;
  const hash = await context.password.hash("password");
  await db.insert(account).values({
    userId: createdUser.id,
    providerId: "credential",
    accountId: createdUser.id,
    password: hash,
  });

  await seed(db, { todo_table: todoTable }).refine((f) => ({
    todo_table: {
      columns: {
        text: f.loremIpsum(),
        userId: f.default({ defaultValue: createdUser.id }),
      },
      count: 5,
    },
  }));

  await db.$client.end();
}

await main();
