import { ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { registerOTel } from "@vercel/otel";
import { initializeLogsExporter } from "@/shared/infrastructure/logger/log-exporter";
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@/shared/infrastructure/otel/semantic-conventions";

/**
 * Registers application instrumentation.
 * @ref https://github.com/kubiks-inc/otel
 *
 * This function can be used to initialize monitoring, tracing,
 * or to load secrets from a secret manager if required.
 * Call this early in your application's lifecycle.
 */
export async function register() {
  registerOTel({
    serviceName: process.env.npm_package_name ?? "acme-app",
    // You can send traces directly from the app (skip collector),
    // but it’s not ideal for production
    //
    // traceExporter: new OTLPHttpJsonTraceExporter({
    //   url: `https://${env.SIGNOZ_ENDPOINT}/v1/traces`,
    //   headers: {
    //     'signoz-ingestion-key': env.SIGNOZ_INGESTION_KEY || ''
    //   }
    // })
    attributes: {
      // By default, @vercel/otel configures relevant Vercel attributes based on the environment
      // Any additional attributes will be merged with the default attributes.
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: process.env.NODE_ENV ?? "development",
      [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? "1.0.0",
    },
    instrumentationConfig: {
      // Monitoring third party APIs
      // @ref: https://signoz.io/blog/opentelemetry-nextjs-use-cases/#monitoring-third-party-apis-in-signoz
      fetch: {
        // ensures context is passed with the fetch call, so traces remain connected.
        propagateContextUrls: [/images\.unsplash\.com/],
        // means everything gets traced.
        ignoreUrls: [],
        // makes spans readable in dashboards.
        resourceNameTemplate: "{http.method} {http.host}{http.target}",
        // Behind the scenes, Vercel’s OpenTelemetry wrapper adds the right span metadata
        // (http.url, net.peer.name, etc.), needed to automatically recognize these calls.
      },
    },
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    initializeLogsExporter();

    // // Handle uncaught exceptions
    // process.on('uncaughtException', (error) => {
    //   const finalLogger = pino.final(logger)
    //   finalLogger.fatal({ err: error }, 'Uncaught exception')
    //   process.exit(1)
    // })

    // // Handle unhandled promise rejections
    // process.on('unhandledRejection', (reason, promise) => {
    //   const finalLogger = pino.final(logger)
    //   finalLogger.fatal({ reason }, 'Unhandled promise rejection')
    //   process.exit(1)
    // })

    // // Graceful shutdown
    // process.on('SIGTERM', () => {
    //   logger.info('Received SIGTERM, shutting down gracefully')
    //   pino.final(logger, (err, finalLogger) => {
    //     if (err) finalLogger.error(err, 'Shutdown error')
    //     finalLogger.info('Application shutdown complete')
    //     process.exit(0)
    //   })
    // })
  }
}
