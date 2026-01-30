import { ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { registerOTel } from "@vercel/otel";
import { initializeLogsExporter } from "@/shared/infrastructure/logger/log-exporter";
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@/shared/infrastructure/otel/semantic-conventions";

/**
 * Registers application instrumentation.
 *
 * This function can be used to initialize monitoring, tracing,
 * or to load secrets from a secret manager if required.
 * Call this early in your application's lifecycle.
 */
export async function register() {
  if (process.env.NODE_ENV === "production") {
    registerOTel({
      serviceName: process.env.npm_package_name ?? "acme-app",
      attributes: {
        // By default, @vercel/otel configures relevant Vercel attributes based on the environment
        // Any additional attributes will be merged with the default attributes.
        [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]:
          process.env.NODE_ENV ?? "development",
        [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? "1.0.0",
      },
    });

    if (process.env.NEXT_RUNTIME === "nodejs") {
      initializeLogsExporter();
    }
  }
}
