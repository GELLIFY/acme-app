import {
  protectedMiddleware,
  publicMiddleware,
} from "@/infrastructure/hono/middleware";
import { healthRouter } from "./routers/health-routes";
import { todosRouter } from "./routers/todos-routes";
import { createRouter } from "./utils/create-router";

const routers = createRouter()
  .use(...publicMiddleware)
  // Mount publicly accessible routes first
  .route("/health", healthRouter)
  // Apply protected middleware to all subsequent routes
  .use(...protectedMiddleware)
  // Mount protected routes
  .route("/todos", todosRouter);

export { routers };
