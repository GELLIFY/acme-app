import { reportErrorStackTrace } from "@/infrastructure/otel/report-error-stack-trace";
import { browserLogger } from "@/libs/logger/browser-logger";

// Set up error tracking
window.onerror = (message, source, lineno, colno, error) => {
  const err = error || new Error(message as string);
  reportErrorStackTrace(err);
  browserLogger.error(`Unhandled error: ${message}`, err, {
    source: "window.onerror",
    sourceFile: source,
    line: lineno,
    column: colno,
  });
};

window.onunhandledrejection = (event) => {
  const err = new Error(event.reason || "Unknown rejection reason");
  reportErrorStackTrace(err);
  browserLogger.error("Unhandled promise rejection", err, {
    source: "window.onunhandledrejection",
    event: event,
  });
};
