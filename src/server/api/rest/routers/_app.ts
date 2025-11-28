import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { checkHealth } from "@/server/services/health-service";
import type { Context } from "../init";
import { protectedMiddleware } from "../middleware";
import { todosRouter } from "./todos";

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
  // Mount publicly accessible routes first
  .get(
    "/scalar",
    Scalar({
      pageTitle: "Acme API",
      sources: [
        { url: "/api/rest/openapi", title: "API" },
        // Better Auth schema generation endpoint
        { url: "/api/auth/open-api/generate-schema", title: "Auth" },
      ],
    }),
  )
  .get("/health", async (c) => {
    try {
      await checkHealth();
      return c.json({ status: "ok" }, 200);
    } catch (error) {
      return c.json({ status: "error", error }, 500);
    }
  })
  // Apply protected middleware to all subsequent routes
  .use(...protectedMiddleware)
  // Mount protected routes
  .route("/todos", todosRouter);

export { routers };
