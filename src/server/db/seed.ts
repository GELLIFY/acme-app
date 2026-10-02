import "@/load-env";

import { reset } from "drizzle-seed";
import { auth } from "@/libs/better-auth/auth";
import { seedsOf } from "@/modules/registry";
import { seedModules } from "@/modules/seed";
import { db } from ".";
import { schema } from "./schema";
import { account, user } from "./schema/auth-schema";

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

  // the seed data of the optional modules (`seed.ts`)
  for (const module of seedsOf(seedModules)) {
    await module.seed(db, createdUser);
  }

  await db.$client.end();
}

await main();
