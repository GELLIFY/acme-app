import type {
  LogRecordExporter,
  LogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import type { SpanExporter } from "@opentelemetry/sdk-trace-base";
import { logs } from "@opentelemetry/api-logs";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { registerOTel } from "@vercel/otel";

declare global {
  // eslint-disable-next-line no-var
  var secrets: {
    apiKey?: string;
  };
}

export async function register() {
  let traceExporter: SpanExporter | undefined;
  let logExporter: LogRecordExporter | undefined;
  let logRecordProcessor: LogRecordProcessor | undefined;

  if (process.env.VERCEL_URL) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { AzureMonitorTraceExporter, AzureMonitorLogExporter } = await import(
      "@azure/monitor-opentelemetry-exporter"
    );

    // Add the Log exporter into the logRecordProcessor and register it with the LoggerProvider
    logExporter = new AzureMonitorLogExporter({
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    });
    logRecordProcessor = new BatchLogRecordProcessor(logExporter);
    const loggerProvider = new LoggerProvider();
    loggerProvider.addLogRecordProcessor(logRecordProcessor);

    // Register logger Provider as global
    logs.setGlobalLoggerProvider(loggerProvider);

    traceExporter = new AzureMonitorTraceExporter({
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    });
  }

  registerOTel({ serviceName: "acme-app", traceExporter, logRecordProcessor });
}
