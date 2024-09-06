import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";

import { auth } from "~/server/auth";

// This is our base client.
// Here we define a middleware that logs the result of the action execution.
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
      track: z
        .object({
          event: z.string(),
          channel: z.string(),
        })
        .optional(),
    });
  },
});

// This client extends the base one and ensures that the user is authenticated before running
// action server code function. Note that by extending the base client, you don't need to
// redeclare the logging middleware, is will simply be inherited by the new client.
export const authActionClient = actionClient
  .use(async ({ next, clientInput, metadata }) => {
    const startTime = performance.now();

    // Here we await the action execution.
    const result = await next();

    const endTime = performance.now();

    console.log("Client input ->", clientInput);
    console.log("Result ->", result);
    console.log("Metadata ->", metadata);
    console.log("Action execution took", endTime - startTime, "ms");

    // And then return the result of the awaited action.
    return result;
  })
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
