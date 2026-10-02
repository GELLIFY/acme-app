import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { serverLogger } from "@/libs/logger/pino-logger";
import { routersOf } from "@/modules/registry";
import { trpcModules } from "@/modules/trpc";
import { checkHealth } from "@/server/services/health-service";
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "../init";
import { userRouter } from "./user";

/**
 * This is the primary router for your server.
 *
 * The routers of the app are added here by hand; those of an optional module
 * come from its `trpc.ts`, through `src/modules/trpc.ts`.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  ...routersOf(trpcModules),
  health: publicProcedure.query(async ({ ctx: { db } }) => {
    try {
      await checkHealth(db);
      return { status: "ok" };
    } catch (error) {
      serverLogger.error("Health check failed", error as Error);
      return { status: "error" };
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
 * const res = await trpc.health();
 */
export const createCaller = createCallerFactory(appRouter);
