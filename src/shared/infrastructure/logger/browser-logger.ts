"use client";

import { trace } from "@opentelemetry/api";
import type { LogContext } from "./logger";

// A simplified LogEntry type for the browser
interface BrowserLogEntry {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class BrowserLogger {
  private logs: BrowserLogEntry[] = [];
  private readonly flushInterval = 10000; // Flush every 10 seconds
  private sessionId = this.generateSessionId();

  constructor() {
    if (typeof window === "undefined") return;

    setInterval(() => this.flush(), this.flushInterval);
    // Optional: Also flush when the page is hidden
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });
  }

  private generateSessionId() {
    return (
      "session_" +
      (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15))
    );
  }

  private getSessionId() {
    return this.sessionId;
  }

  private enrich(context: LogContext = {}): LogContext {
    const span = trace.getActiveSpan();
    const ctx = span?.spanContext();
    return {
      traceId: ctx?.traceId ?? "no-trace",
      spanId: ctx?.spanId ?? "no-span",
      sessionId: this.getSessionId(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };
  }

  private log(
    level: "debug" | "info" | "warn" | "error",
    message: string,
    context?: LogContext,
    error?: Error,
  ) {
    if (typeof window === "undefined") return;

    const entry: BrowserLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.enrich(context),
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console[level](message, entry);
    }

    this.logs.push(entry);
  }

  private flush() {
    if (typeof window === "undefined" || this.logs.length === 0) {
      return;
    }

    const logsToSend = this.logs;
    this.logs = [];

    // Use navigator.sendBeacon if available for reliability,
    // especially on page unload.
    // Note: sendBeacon only supports POST and specific data types.
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(logsToSend)], {
          type: "application/json",
        });
        navigator.sendBeacon("/api/logs", blob);
      } else {
        fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logsToSend),
          keepalive: true, // Important for reliability
        });
      }
    } catch (error) {
      console.error("Failed to send browser logs", error);
      // If sending fails, put logs back in the queue
      this.logs = logsToSend.concat(this.logs);
    }
  }

  // --- Public API ---
  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }
  debug(message: string, context?: LogContext) {
    this.log("debug", message, context);
  }
  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }
  error(message: string, error: Error, context?: LogContext) {
    this.log("error", message, context, error);
  }
}

export const browserLogger = new BrowserLogger();
