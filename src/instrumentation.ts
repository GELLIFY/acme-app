import type { SpanExporter } from "@opentelemetry/sdk-trace-base";
import { registerOTel } from "@vercel/otel";

declare global {
  // eslint-disable-next-line no-var
  var secrets: {
    apiKey?: string;
  };
}

export async function register() {
  let traceExporter: SpanExporter | undefined;

  if (process.env.VERCEL_URL) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { AzureMonitorTraceExporter } = await import(
      "@azure/monitor-opentelemetry-exporter"
    );
    traceExporter = new AzureMonitorTraceExporter({
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    });
  }

  registerOTel({ serviceName: "acme-app", traceExporter });
}
