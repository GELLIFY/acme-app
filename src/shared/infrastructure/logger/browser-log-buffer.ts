import { trace } from "@opentelemetry/api";
import type { BrowserLogEntry, LogContext, LogLevel } from "./types";

const FLUSH_INTERVAL_MS = 10000;
const LOGS_ENDPOINT = "/api/logs";

class BrowserLogBuffer {
  private logs: BrowserLogEntry[] = [];
  private initialized = false;
  private sessionId = this.generateSessionId();
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  initialize() {
    if (this.initialized || typeof window === "undefined") return;

    this.initialized = true;
    this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });

    window.addEventListener("beforeunload", () => this.flush());
    this.setupGlobalErrorHandlers();
  }

  enqueue(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
  ) {
    if (typeof window === "undefined") return;

    this.initialize();
    this.logs.push(this.createEntry(level, message, context, error));
  }

  flush() {
    if (typeof window === "undefined" || this.logs.length === 0) return;

    const logsToSend = this.logs;
    this.logs = [];

    try {
      if (navigator.sendBeacon) {
        const payload = new Blob([JSON.stringify(logsToSend)], {
          type: "application/json",
        });
        navigator.sendBeacon(LOGS_ENDPOINT, payload);
        return;
      }

      fetch(LOGS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logsToSend),
        keepalive: true,
      }).catch(() => {
        this.logs = logsToSend.concat(this.logs);
      });
    } catch {
      this.logs = logsToSend.concat(this.logs);
    }
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context: LogContext = {},
    error?: Error,
  ): BrowserLogEntry {
    const span = trace.getActiveSpan();
    const spanContext = span?.spanContext();

    const enrichedContext: LogContext = {
      ...context,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      traceId: spanContext?.traceId,
      spanId: spanContext?.spanId,
    };

    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: enrichedContext,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener("error", (event) => {
      this.enqueue(
        "error",
        `Unhandled error: ${event.message}`,
        {
          source: "window.onerror",
          sourceFile: event.filename,
          line: event.lineno,
          column: event.colno,
        },
        event.error ?? new Error(String(event.message)),
      );
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.enqueue(
        "error",
        "Unhandled promise rejection",
        { source: "window.onunhandledrejection" },
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
      );
    });
  }

  private generateSessionId() {
    return (
      "session_" +
      (Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2))
    );
  }
}

export const browserLogBuffer = new BrowserLogBuffer();

export const initializeBrowserLogging = () => {
  browserLogBuffer.initialize();
};
