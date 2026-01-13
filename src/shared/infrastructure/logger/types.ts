export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown> & {
  traceId?: string;
  spanId?: string;
  source?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
};

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: Error;
};

export type BrowserLogError = {
  name: string;
  message: string;
  stack?: string;
};

export type BrowserLogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: BrowserLogError;
};
