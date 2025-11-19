import { OpenAPIHono } from "@hono/zod-openapi";

import { checkHealth } from "@/server/services/health-service";
import { protectedMiddleware } from "../middleware";
import { todosRouter } from "./todos";

const routers = new OpenAPIHono();

// Mount publicly accessible routes first
routers.get("/health", async (c) => {
  try {
    await checkHealth();
    return c.json({ status: "ok" }, 200);
  } catch (error) {
    return c.json({ status: "error", error }, 500);
  }
});

// Apply protected middleware to all subsequent routes
routers.use(...protectedMiddleware);

// Mount protected routes
routers.route("/todos", todosRouter);

export { routers };
