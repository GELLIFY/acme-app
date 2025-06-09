import { OpenAPIHono } from "@hono/zod-openapi";
import { handle } from "hono/vercel";

import type { Context } from "@/server/api/rest/init";
import { routers } from "@/server/api/rest/routers/_app";

const app = new OpenAPIHono<Context>().basePath("/api/rest");

app.route("/", routers);

export const GET = handle(app);
export const POST = handle(app);
