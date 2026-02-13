import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().min(1, "url is required"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    RESEND_API_KEY: z.string().min(1),

    OTEL_EXPORTER_OTLP_ENDPOINT: z.string().default("http://localhost:4318"),
    OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: z
      .string()
      .default("http://localhost:4318/v1/logs"),
    OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: z
      .string()
      .default("http://localhost:4318/v1/metrics"),
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z
      .string()
      .default("http://localhost:4318/v1/traces"),
    OTEL_EXPORTER_OTLP_TRACES_PROTOCOL: z.string().default("http/protobuf"),
    OTEL_TRACES_SAMPLER: z.string().default("parentbased_traceidratio"),
    OTEL_TRACES_SAMPLER_ARG: z.string().default("0.05"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   * For Next.js >= 13.4.4, you only need to destructure client variables
   */
  experimental__runtimeEnv: {},
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
