import { exportLogEntry } from "@/infrastructure/logger/log-exporter";
import { getTraceContext } from "../otel/get-trace-context";

export interface LogContext {
  traceId?: string;
  spanId?: string;
  [key: string]: unknown;
}

// This interface is imported by logs-exporter.ts
export interface LogEntry {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  context: LogContext;
  error?: Error;
}

class Logger {
  private log(
    level: "debug" | "info" | "warn" | "error",
    message: string,
    context?: LogContext,
    error?: Error,
  ) {
    const entry: LogEntry = {
      // Use the LogEntry type
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...getTraceContext(), ...context },
      error,
    };

    if (typeof window === "undefined") {
      exportLogEntry(entry);
    }
  }

  // Public methods for a complete logger
  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }
  debug(message: string, context?: LogContext) {
    this.log("debug", message, context);
  }
  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }
  error(message: string, error?: Error, context?: LogContext) {
    this.log("error", message, context, error);
  }
}

export const logger = new Logger();
