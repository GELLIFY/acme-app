import type { OpenAPIHono } from "@hono/zod-openapi";
import { restModules } from "@/modules/rest";
import type { Context } from "../init";
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

/** What a module's `rest.ts` contributes: routers mounted under their path. */
export type RestModule = {
  id: string;
  routes: readonly { path: string; router: OpenAPIHono<Context> }[];
};

// The routes of the optional modules, behind the protected middleware too.
for (const module of restModules as readonly RestModule[]) {
  for (const { path, router } of module.routes) routers.route(path, router);
}

export { routers };
