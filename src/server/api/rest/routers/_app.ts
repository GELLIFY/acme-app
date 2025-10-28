import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import { checkHealth } from "@/server/services/health-service";
import { protectedMiddleware } from "../init";
import { todosRouter } from "./todos";

const routers = new OpenAPIHono();

routers.use(secureHeaders());

routers.use(
  "*",
  cors({
    origin: process.env.ALLOWED_API_ORIGINS?.split(",") ?? [],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  }),
);

routers.doc("/openapi", {
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
      url: "http://localhost:3000/api/rest/",
      description: "Production API",
    },
  ],
  security: [
    {
      token: [],
    },
  ],
});

// Mount publicly accessible routes first
routers.get("/health", async (c) => {
  try {
    await checkHealth();
    return c.json({ status: "ok" }, 200);
  } catch (error) {
    return c.json({ status: "error", error }, 500);
  }
});

routers.get(
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

// Mount protected routes
routers.use(...protectedMiddleware);
routers.route("/todos", todosRouter);

export { routers };
