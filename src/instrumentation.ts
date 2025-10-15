import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

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
    serviceName: "acme-app",
    traceExporter: new OTLPHttpJsonTraceExporter({
      // Prefer traces-specific endpoint, fallback to base
      url:
        process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    }),
  });
}
