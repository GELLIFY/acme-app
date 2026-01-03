import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import type { db } from "@/server/db";
import type { Permissions } from "@/shared/helpers/better-auth/permissions";
import { getBaseUrl } from "@/shared/helpers/get-url";
import type { LogContext } from "@/shared/infrastructure/logger";
import { routers } from "./routers/_app";

export type Context = {
  Variables: {
    db: typeof db;
    permissions: Permissions;
    userId: string;
    wideEvent: Partial<LogContext>;
  };
};

const app = new OpenAPIHono<Context>()
  .doc31("/openapi", {
    openapi: "3.1.0",
    info: {
      version: "0.0.1",
      title: "GELLIFY API",
      description: "Description",
      contact: {
        name: "GELLIFY Support",
        email: "engineer@gellify.dev",
        url: "https://gellify.dev",
      },
      license: {
        name: "AGPL-3.0 license",
        url: "https://github.com/GELLIFY/acme-app/blob/main/LICENSE",
      },
    },
    servers: [
      {
        url: `${getBaseUrl()}/api/rest/`,
        description: "Production API",
      },
    ],
    security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
  })
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
  .route("/", routers);

// @ts-expect-error override of types between OpenAPIHono and Hono
app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "better-auth.session_token",
  description:
    "Authentication via a session token stored in the 'better-auth.session_token' cookie.",
});

// @ts-expect-error override of types between OpenAPIHono and Hono
app.openAPIRegistry.registerComponent("securitySchemes", "apiKeyAuth", {
  type: "apiKey",
  in: "header",
  name: "x-api-key",
  description:
    "Authentication using the x-api-key header. Example: 'x-api-key: <your-api-key>'",
});

export { app as routers };
