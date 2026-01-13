import { logs } from "@opentelemetry/api-logs";
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
import type { LogEntry } from "@/shared/infrastructure/logger/types";

const DEFAULT_SERVICE_NAME = "acme-app";

let isInitialized = false;
let loggerProvider: LoggerProvider | null = null;

const getOtlpHeaders = (): Record<string, string> | undefined => {
  const rawHeaders = process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (!rawHeaders) return undefined;

  return rawHeaders.split(",").reduce<Record<string, string>>((acc, pair) => {
    const [key, value] = pair.split("=");
    if (!key || !value) return acc;
    acc[key.trim()] = value.trim();
    return acc;
  }, {});
};

const getLogsEndpoint = () => {
  if (process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT) {
    return process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT;
  }

  const baseEndpoint =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318";

  return `${baseEndpoint.replace(/\/$/, "")}/v1/logs`;
};

const getSeverityNumber = (level: LogEntry["level"]): number => {
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
};

const createLoggerProvider = () => {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? DEFAULT_SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? "0.0.0",
  });

  const exporter = new OTLPLogExporter({
    url: getLogsEndpoint(),
    headers: getOtlpHeaders(),
  });

  const processor = new BatchLogRecordProcessor(exporter, {
    maxExportBatchSize: 50,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
    maxQueueSize: 1000,
  });

  return new LoggerProvider({
    resource,
    processors: [processor],
  });
};

export const initializeLogsExporter = () => {
  if (typeof window !== "undefined" || isInitialized) return;

  loggerProvider = createLoggerProvider();
  logs.setGlobalLoggerProvider(loggerProvider);
  isInitialized = true;

  (
    globalThis as { __otelExportLogEntry?: (entry: LogEntry) => void }
  ).__otelExportLogEntry = exportLogEntry;
};

export const exportLogEntry = (entry: LogEntry) => {
  if (typeof window !== "undefined") return;

  if (!isInitialized) {
    initializeLogsExporter();
  }

  if (!loggerProvider) return;

  const logger = loggerProvider.getLogger(
    process.env.OTEL_SERVICE_NAME ?? DEFAULT_SERVICE_NAME,
  );

  const attributes: Record<string, unknown> = {
    ...entry.context,
    "log.level": entry.level,
    "service.name": process.env.OTEL_SERVICE_NAME ?? DEFAULT_SERVICE_NAME,
  };

  if (entry.error) {
    attributes["error.name"] = entry.error.name;
    attributes["error.message"] = entry.error.message;
    attributes["error.stack"] = entry.error.stack;
  }

  logger.emit({
    body: entry.message,
    timestamp: Date.now(),
    observedTimestamp: Date.now(),
    severityNumber: getSeverityNumber(entry.level),
    severityText: entry.level.toUpperCase(),
    attributes,
  });
};

export const shutdownLogsExporter = () =>
  loggerProvider?.shutdown() ?? Promise.resolve();
