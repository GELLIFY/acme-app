import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { browserLogger } from "@/shared/infrastructure/logger/browser-logger";
import { reportErrorStackTrace } from "@/shared/infrastructure/otel/report-error-stack-trace";

if (process.env.NODE_ENV === "production") {
  const provider = new WebTracerProvider({
    // sampling sempre al 100% lato FE
    // il sampling vero lo fa il BE / collector
    spanProcessors: [
      new BatchSpanProcessor({
        // ❌ NESSUN exporter
        export: () => Promise.resolve(),
        shutdown: () => Promise.resolve(),
        forceFlush: () => Promise.resolve(),
      }),
    ],
  });

  provider.register({
    // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
    contextManager: new ZoneContextManager(),
  });

  // Registering instrumentations / plugins
  registerInstrumentations({
    instrumentations: [new FetchInstrumentation()],
  });

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
}
