import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { db, schema } from "~/server/db";

export async function POST() {
  // Clear out the todos for the (public) demo
  // Because you can't trust an open <input> on the internet
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(schema.post);
  revalidatePath("/db");

  return NextResponse.json({ message: "All todos deleted successfully" });
}
