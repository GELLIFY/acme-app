import { type LogRecord, logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { env } from "@/env";
import type { LogEntry } from "./logger";

let isInitialized = false;
let loggerProvider: LoggerProvider | null = null;

function createLoggerProvider() {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? "acme-app",
    [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? "1.0.0",
  });

  const exporter = new OTLPLogExporter({
    url: env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT,
  });

  const batchProcessor = new BatchLogRecordProcessor(exporter, {
    maxExportBatchSize: 20,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
    maxQueueSize: 1000,
  });

  return new LoggerProvider({
    resource,
    processors: [batchProcessor],
  });
}

export function initializeLogsExporter() {
  if (typeof window !== "undefined" || isInitialized) {
    return;
  }

  loggerProvider = createLoggerProvider();
  logs.setGlobalLoggerProvider(loggerProvider);
  isInitialized = true;
  console.log("✅ OpenTelemetry logs exporter initialized");
}

export function exportLogEntry(entry: LogEntry) {
  if (typeof window !== "undefined") return;
  if (!isInitialized) initializeLogsExporter();
  if (!loggerProvider) return;

  const logger = loggerProvider.getLogger(env.OTEL_SERVICE_NAME);

  const attributes: Record<string, unknown> = {
    ...entry.context,
    "log.level": entry.level,
    "service.name": env.OTEL_SERVICE_NAME,
  };

  if (entry.error) {
    attributes["error.name"] = entry.error.name;
    attributes["error.message"] = entry.error.message;
    attributes["error.stack"] = entry.error.stack;
  }

  const logRecord: LogRecord = {
    body: entry.message,
    timestamp: Date.now(),
    observedTimestamp: Date.now(),
    severityNumber: getSeverityNumber(entry.level),
    severityText: entry.level.toUpperCase(),
    // @ts-expect-error it's ok
    attributes,
  };

  logger.emit(logRecord);
}

function getSeverityNumber(level: LogEntry["level"]): number {
  switch (level) {
    case "debug":
      return 5;
    case "info":
      return 9;
    case "warn":
      return 13;
    case "error":
      return 17;
    default:
      return 9;
  }
}

export function shutdownLogsExporter() {
  return loggerProvider?.shutdown() ?? Promise.resolve();
}
