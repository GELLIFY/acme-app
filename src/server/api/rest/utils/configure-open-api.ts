import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import type { Schema } from "hono";
import { getBaseUrl } from "@/shared/helpers/get-url";
import type { Context } from "../init";

export default function configureOpenAPI(app: OpenAPIHono<Context, Schema>) {
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
    security: [{ cookieAuth: [] }, { apiKeyAuth: [] }],
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
}
