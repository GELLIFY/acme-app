import { protectedMiddleware, publicMiddleware } from "../middleware";
import { createRouter } from "../utils/create-router";
import { healthRouter } from "./health-routes";
import { todosRouter } from "./todos-routes";

const routers = createRouter()
  .use(...publicMiddleware)
  // Mount publicly accessible routes first
  .route("/health", healthRouter)
  // Apply protected middleware to all subsequent routes
  .use(...protectedMiddleware)
  // Mount protected routes
  .route("/todos", todosRouter);

export { routers };
