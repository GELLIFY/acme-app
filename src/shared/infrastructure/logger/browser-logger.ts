"use client";

import { getTraceContext } from "../otel/get-trace-context";

type LogLevel = "debug" | "info" | "warn" | "error";

interface BrowserLogEntry {
  ts: string;
  level: LogLevel;
  message: string;
  traceId?: string;
  spanId?: string;
  sessionId: string;
  url: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  // custom attributes
  [key: string]: unknown;
}

const FLUSH_INTERVAL = 10_000;
const MAX_BUFFER_SIZE = 50;

class BrowserLogger {
  private buffer: BrowserLogEntry[] = [];
  private sessionId = crypto.randomUUID();

  constructor() {
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    setInterval(() => this.flush(), FLUSH_INTERVAL);

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });
  }

  private push(entry: BrowserLogEntry) {
    if (this.buffer.length >= MAX_BUFFER_SIZE) return;
    this.buffer.push(entry);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ) {
    const isProd = process.env.NODE_ENV === "production";

    // Console behavior (DX)
    if (!isProd) {
      if (error) console[level](message, error, { context });
      else console[level](message, { context });
      return;
    }

    const { traceId, spanId } = getTraceContext();

    this.push({
      ts: new Date().toISOString(),
      level,
      message,
      traceId,
      spanId,
      sessionId: this.sessionId,
      url: window.location.pathname,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  }
  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }
  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }
  error(message: string, error: Error, context?: Record<string, unknown>) {
    this.log("error", message, context, error);
  }

  private flush() {
    if (this.buffer.length === 0) return;

    const payload = this.buffer;
    this.buffer = [];

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/logs",
          new Blob([JSON.stringify(payload)], {
            type: "application/json",
          }),
        );
      } else {
        fetch("/api/logs", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        });
      }
    } catch (error) {
      // If sending fails, put logs back in the queue
      console.error("Failed to send browser logs", error);
      for (const entry of payload) this.push(entry);
    }
  }
}

export const browserLogger = new BrowserLogger();
