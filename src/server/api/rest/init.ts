import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import type { db } from "@/server/db";
import type { Permissions } from "@/shared/helpers/better-auth/permissions";
import { getBaseUrl } from "@/shared/helpers/get-url";
import { routers } from "./routers/_app";

export type Context = {
  Variables: {
    db: typeof db;
    permissions: Permissions;
    userId: string;
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

app.openAPIRegistry.registerComponent("securitySchemes", "apiKeyAuth", {
  type: "apiKey",
  in: "header",
  name: "x-api-key",
  description:
    "Authentication using the x-api-key header. Example: 'x-api-key: <your-api-key>'",
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
