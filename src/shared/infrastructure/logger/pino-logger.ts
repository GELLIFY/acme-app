import { trace } from "@opentelemetry/api";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import pino, { type LoggerOptions } from "pino";
import type { LogContext } from "@/shared/infrastructure/logger/logger";

const createPinoConfig = (
  environment: string = process.env.NODE_ENV,
): LoggerOptions => ({
  name: process.env.OTEL_SERVICE_NAME ?? "acme-app",
  enabled: environment !== "test",
  level: environment === "production" ? "info" : "debug",
  timestamp: pino.stdTimeFunctions.isoTime,

  // This configuration sets up a multi-transport logger.
  // In production, it sends info-level logs to otel collector
  // In development, it also sends debug-level logs to the console
  transport: {
    targets: [
      {
        // Always export to otel collector
        target: "pino-opentelemetry-transport",
        level: "info",
        options: {
          resourceAttributes: {
            [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? "acme-app",
            [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? "1.0.0",
          },
        },
      },

      // Keep console output for development
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              target: "pino-pretty",
              level: "debug",
              options: {
                colorize: true,
                ignore: "pid,hostname",
              },
            },
          ]
        : []),
    ],
  },

  // Redact sensitive information in production
  ...(environment === "production" && {
    redact: {
      paths: ["password", "token", "apiKey", "*.password", "*.token"],
      remove: true,
    },
  }),

  mixin: () => {
    const span = trace.getActiveSpan();
    const ctx = span?.spanContext();
    return {
      traceId: ctx?.traceId,
      spanId: ctx?.spanId,
      environment,
    };
  },
});

export const pinoLogger = pino(createPinoConfig());

export class PinoLogger {
  constructor(private readonly logger = pinoLogger) {}

  private enrich(context: LogContext = {}): LogContext {
    const span = trace.getActiveSpan();
    const ctx = span?.spanContext();
    return {
      traceId: ctx?.traceId,
      spanId: ctx?.spanId,
      timestamp: new Date().toISOString(),
      ...context,
    };
  }

  info(message: string, context?: LogContext) {
    this.logger.info(this.enrich(context), message);
  }
  debug(message: string, context?: LogContext) {
    this.logger.debug(this.enrich(context), message);
  }
  warn(message: string, context?: LogContext) {
    this.logger.warn(this.enrich(context), message);
  }
  error(message: string, error?: Error, context?: LogContext) {
    const enriched = this.enrich(context);
    if (error) {
      enriched.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    this.logger.error(enriched, message);
  }
}

export const serverLogger = new PinoLogger();
