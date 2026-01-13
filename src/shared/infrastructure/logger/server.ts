import { SpanStatusCode, trace } from "@opentelemetry/api";
import pino, { type LogFn, type Logger } from "pino";
import { getTraceContext } from "@/shared/infrastructure/otel/get-trace-context";
import { toLogLevel } from "./levels";
import { normalizeLogArgs } from "./normalize-log-args";
import type { LogEntry } from "./types";

const emitOtelLogEntry = (entry: LogEntry) => {
  const emitter = (
    globalThis as { __otelExportLogEntry?: (payload: LogEntry) => void }
  ).__otelExportLogEntry;

  emitter?.(entry);
};

export const logger: Logger = pino({
  level: process.env.LOG_LEVEL || "info",
  mixin: () => {
    const { traceId, spanId } = getTraceContext();

    return {
      traceId,
      spanId,
    };
  },
  hooks: {
    logMethod(this: Logger, args: Parameters<LogFn>, method: LogFn, level) {
      const label = this.levels.labels[level] ?? "info";
      const { message, context, error } = normalizeLogArgs(args);
      const bindings = this.bindings();
      const { traceId, spanId } = getTraceContext();

      if (error) {
        const span = trace.getActiveSpan();

        if (span) {
          span.recordException(error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          });
        }
      }

      emitOtelLogEntry({
        timestamp: new Date().toISOString(),
        level: toLogLevel(label),
        message,
        context: {
          ...bindings,
          ...context,
          traceId,
          spanId,
          source: "server",
        },
        error,
      });

      return method.apply(this, args);
    },
  },
  // Use pretty printing in development, structured JSON in production
  ...(process.env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        messageFormat: true,
        hideObject: false,
        singleLine: false,
      },
    },
  }),
});

export const serverLogger = logger.child({ group: "server" });
