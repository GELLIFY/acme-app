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

export const unauthorizedSchema = (defaultError: string = "Unauthorized") => {
  return z
    .object({
      error: z.string(),
      description: z.string(),
    })
    .openapi({
      example: {
        error: defaultError,
        description: "Authentication is required.",
      },
    });
};

export const forbiddenSchema = (defaultError: string = "Forbidden") => {
  return z
    .object({
      error: z.string(),
      description: z.string(),
    })
    .openapi({
      example: {
        error: defaultError,
        description: "Insufficient permissions.",
      },
    });
};
