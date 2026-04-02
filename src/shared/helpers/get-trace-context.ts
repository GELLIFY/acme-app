import { trace } from "@opentelemetry/api";

export const getTraceContext = () => {
  const span = trace.getActiveSpan();
  const ctx = span?.spanContext();

  return {
    traceId: ctx?.traceId,
    spanId: ctx?.spanId,
  };
};
