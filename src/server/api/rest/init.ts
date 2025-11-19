import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import type { db } from "@/server/db";
import type { auth } from "@/shared/helpers/better-auth/auth";
import { getBaseUrl } from "@/shared/helpers/get-url";
import { routers } from "./routers/_app";

export type Context = {
  Variables: {
    db: typeof db;
    session: typeof auth.$Infer.Session;
  };
};

const app = new OpenAPIHono<Context>();

app.use(secureHeaders());

app.use(
  "*",
  cors({
    origin: process.env.ALLOWED_API_ORIGINS?.split(",") ?? [],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  }),
);

app.doc("/openapi", {
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
  security: [{ cookieAuth: [] }, { bearerAuth: [] }, { apiKeyAuth: [] }],
});

// Register security scheme
app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "better-auth.session_token",
  description:
    "Authentication via a session token stored in the 'better-auth.session_token' cookie.",
});

app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  in: "header",
  scheme: "bearer",
  description:
    "Authentication using a Bearer token in the Authorization header. Example: 'Authorization: Bearer <token>'",
});

app.openAPIRegistry.registerComponent("securitySchemes", "apiKeyAuth", {
  type: "apiKey",
  in: "header",
  name: "X-API-KEY",
  description:
    "Authentication using the X-API-KEY header. Example: 'X-API-KEY: <your-api-key>'",
});

app.get(
  "/scalar",
  Scalar({
    pageTitle: "Acme API",
    sources: [
      { url: "/api/rest/openapi", title: "API" },
      // Better Auth schema generation endpoint
      { url: "/api/auth/open-api/generate-schema", title: "Auth" },
    ],
  }),
);

app.route("/", routers);

export { app as routers };
