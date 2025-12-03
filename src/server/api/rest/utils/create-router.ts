import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "../init";

export function createRouter() {
  return new OpenAPIHono<Context>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: result.success,
            error: {
              name: result.error.name,
              issues: result.error.issues,
            },
          },
          422,
        );
      }
    },
  });
}
