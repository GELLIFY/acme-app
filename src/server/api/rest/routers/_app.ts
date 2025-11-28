import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "../init";
import { protectedMiddleware, publicMiddleware } from "../middleware";
import { healthRouter } from "./health-routes";
import { todosRouter } from "./todos-routes";

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

const routers = createRouter()
  .use(...publicMiddleware)
  // Mount publicly accessible routes first
  .route("/health", healthRouter)
  // Apply protected middleware to all subsequent routes
  .use(...protectedMiddleware)
  // Mount protected routes
  .route("/todos", todosRouter);

export { routers };
