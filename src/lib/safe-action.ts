import { createSafeActionClient } from "next-safe-action";

import { auth } from "~/server/auth";

// This is our base client.
// Here we define a middleware that logs the result of the action execution.
export const actionClient = createSafeActionClient();

// This client extends the base one and ensures that the user is authenticated before running
// action server code function. Note that by extending the base client, you don't need to
// redeclare the logging middleware, is will simply be inherited by the new client.
export const authActionClient = actionClient
  // In this case, context is used for (fake) auth purposes.
  .use(async ({ next }) => {
    const session = await auth();

    // If the session is not valid, we throw an error and stop execution here.
    if (!session?.access_token) {
      throw new Error("Session is not valid!");
    }

    // Here we return the context object for the next middleware in the chain/server code function.
    return next({
      ctx: {
        session: session,
      },
    });
  });
