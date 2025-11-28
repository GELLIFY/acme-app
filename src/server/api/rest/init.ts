import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import type { db } from "@/server/db";
import type { Permissions } from "@/shared/helpers/better-auth/permissions";
import { routers } from "./routers/_app";

export type Context = {
  Variables: {
    db: typeof db;
    permissions: Permissions;
    userId: string;
  };
};

const app = new OpenAPIHono<Context>()
  .use(secureHeaders())
  .use(
    "*",
    cors({
      origin: process.env.ALLOWED_API_ORIGINS?.split(",") ?? [],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      exposeHeaders: ["Content-Length"],
      maxAge: 86400,
    }),
  )
  .route("/", routers);

export { app as routers };
