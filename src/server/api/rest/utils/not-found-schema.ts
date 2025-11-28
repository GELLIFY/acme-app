import { z } from "@hono/zod-openapi";

export const notFoundSchema = (exampleMessage: string = "Not Found") => {
  return z
    .object({
      message: z.string(),
    })
    .openapi({
      example: {
        message: exampleMessage,
      },
    });
};
