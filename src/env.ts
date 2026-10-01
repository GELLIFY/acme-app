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
    BETTER_AUTH_URL: z
      .url()
      .default(
        process.env.VERCEL_BRANCH_URL
          ? `https://${process.env.VERCEL_BRANCH_URL}`
          : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000",
      ),
    RESEND_API_KEY: z.string().min(1),

    // #if useWorker
    // How a queued background job gets executed, per acme-app-aws's `EcsFargateTask` invocation
    // contract (infrastructure/components/ecs-fargate-task.md): "local" (default, no AWS needed)
    // leaves the job queued for scripts/worker.ts's own poll loop to pick up; "ecs" calls
    // `ecs:RunTask`. The ECS_CLUSTER / WORKER_* variables are injected automatically into the
    // app's container environment by that stack once `withFargateTask` is enabled.
    JOB_DRIVER: z.enum(["ecs", "local"]).default("local"),
    ECS_CLUSTER: z.string().optional(),
    WORKER_TASK_DEFINITION: z.string().optional(),
    WORKER_CONTAINER_NAME: z.string().optional(),
    WORKER_SECURITY_GROUP_ID: z.string().optional(),
    WORKER_SUBNET_IDS: z.string().optional(),
    // Only needed outside AWS (no IAM role): static credentials for the ECS client.
    AWS_REGION: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    // #endif

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
