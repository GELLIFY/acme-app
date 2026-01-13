import { trace } from "@opentelemetry/api";
import pino, { type LoggerOptions } from "pino";
import type { LogContext } from "@/shared/infrastructure/logger/logger";

const createPinoConfig = (
  environment: string = process.env.NODE_ENV,
): LoggerOptions => ({
  name: process.env.OTEL_SERVICE_NAME ?? "acme-app",
  enabled: environment !== "test",
  level: environment === "production" ? "info" : "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  // Use pino-pretty in development
  ...(environment !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
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
