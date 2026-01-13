import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "@/infrastructure/trpc/init";
import { checkHealth } from "@/server/services/health-service";
import { dashboardRouter } from "./routers/dashboard";
import { todoRouter } from "./routers/todo";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  todo: todoRouter,
  dashboard: dashboardRouter,
  health: publicProcedure.query(async ({ ctx: { db } }) => {
    try {
      await checkHealth(db);
      return { status: "ok" };
    } catch (error) {
      return { status: "error", error };
    }
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export type infer of procedures
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.todo.getAll();
 */
export const createCaller = createCallerFactory(appRouter);
