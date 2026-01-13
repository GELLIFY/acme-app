import { registerOTel } from "@vercel/otel";

const DEFAULT_SERVICE_NAME = "acme-app";

const parseRegexList = (value?: string): RegExp[] => {
  if (!value) return [];

  return value
    .split(",")
    .map((pattern) => pattern.trim())
    .filter(Boolean)
    .map((pattern) => {
      try {
        return new RegExp(pattern);
      } catch {
        return null;
      }
    })
    .filter((pattern): pattern is RegExp => pattern !== null);
};

/**
 * Registers application instrumentation.
 * @ref https://github.com/kubiks-inc/otel
 *
 * This function can be used to initialize monitoring, tracing,
 * or to load secrets from a secret manager if required.
 * Call this early in your application's lifecycle.
 */
export async function register() {
  const propagateContextUrls = parseRegexList(
    process.env.OTEL_FETCH_PROPAGATE_CONTEXT_URLS,
  );
  const resolvedPropagateContextUrls =
    propagateContextUrls.length > 0 ? propagateContextUrls : [/.*/];

  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME ?? DEFAULT_SERVICE_NAME,
    attributes: {
      "deployment.environment": process.env.NODE_ENV,
      "service.version": process.env.npm_package_version,
    },
    instrumentationConfig: {
      fetch: {
        propagateContextUrls: resolvedPropagateContextUrls,
        ignoreUrls: parseRegexList(process.env.OTEL_FETCH_IGNORE_URLS),
        resourceNameTemplate: "{http.method} {http.host}{http.target}",
      },
    },
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeLogsExporter } = await import(
      "@/shared/infrastructure/otel/logs-exporter"
    );
    initializeLogsExporter();
  }
}
