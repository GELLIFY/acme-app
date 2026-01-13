import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().min(1, "url is required"),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace"])
      .default("info"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    BETTER_AUTH_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),

    OTEL_SERVICE_NAME: z.string().optional(),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z.string().optional(),
    OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: z.string().optional(),
    OTEL_EXPORTER_OTLP_HEADERS: z.string().optional(),
    OTEL_EXPORTER_OTLP_TRACES_PROTOCOL: z.string().optional(),
    OTEL_LOG_LEVEL: z.string().optional(),
    NEXT_OTEL_VERBOSE: z.string().optional(),
    OTEL_TRACES_SAMPLER: z.string().optional(),
    OTEL_TRACES_SAMPLER_ARG: z.string().optional(),
    OTEL_FETCH_PROPAGATE_CONTEXT_URLS: z.string().optional(),
    OTEL_FETCH_IGNORE_URLS: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_OTEL_SERVICE_NAME: z.string().optional(),
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: z.string().optional(),
  },

  /**
   * For Next.js >= 13.4.4, you only need to destructure client variables
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_OTEL_SERVICE_NAME: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME,
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT:
      process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV === "test",
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
