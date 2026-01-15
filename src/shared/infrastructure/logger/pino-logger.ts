import { trace } from "@opentelemetry/api";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { format } from "date-fns";
import pino from "pino";
import type { LogContext } from "@/shared/infrastructure/logger/logger";

type BrowserLogType = {
  error?: Error;
  level: "debug" | "info" | "warn" | "error";
  msg: string;
  time: "2026-01-14T11:03:56.138Z";
  timestamp: "2026-01-14T11:03:56.138Z";
  traceId?: string;
  spanId?: string;
};

// A simplified LogEntry type for the browser
interface BrowserLogEntry {
  timestamp: string;
  level: string;
  message: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const environment = process.env.NODE_ENV ?? "development";

const pinoLogger = pino({
  name: process.env.OTEL_SERVICE_NAME ?? "acme-app",
  enabled: environment !== "test",
  level: environment === "production" ? "info" : "debug",
  timestamp: pino.stdTimeFunctions.isoTime,

  browser: {
    asObject: true,
    formatters: { level: (label) => ({ level: label }) },
    write: (logObj) => {
      const { level, msg, error, time } = logObj as BrowserLogType;
      // console.log("logObj", logObj);

      if (process.env.NODE_ENV === "development") {
        const dateTime = time ? new Date(time) : new Date();
        const timeFormatted = format(new Date(dateTime), `HH:mm:ss`);

        if (error) console[level](`[${timeFormatted}] ${msg}`, error);
        else console[level](`[${timeFormatted}] ${msg}`);
      }
    },
    transmit: {
      level: "info",
      send: async (_, logEvent) => {
        const [context, message] = logEvent.messages;
        const { timestamp, error, ...rest } = context;

        const logToSend: BrowserLogEntry = {
          timestamp: timestamp ?? logEvent.ts.toString(),
          level: logEvent.level.label,
          message: message,
          context: rest,
        };

        if (error) {
          logToSend.error = {
            name: error.name,
            message: error.message,
            stack: error.stack,
          };
        }
        // Use navigator.sendBeacon if available for reliability,
        // especially on page unload.
        // Note: sendBeacon only supports POST and specific data types.
        try {
          if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify([logToSend])], {
              type: "application/json",
            });
            navigator.sendBeacon("/api/logs", blob);
          } else {
            fetch("/api/logs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify([logToSend]),
              keepalive: true, // Important for reliability
            });
          }
        } catch (error) {
          // If sending fails, amen
          console.error("Failed to send browser logs", error);
        }
      },
    },
  },

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

export const logger = new PinoLogger();
