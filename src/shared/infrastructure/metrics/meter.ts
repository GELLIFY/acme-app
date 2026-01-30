import { trace } from "@opentelemetry/api";
import type { Metric } from "web-vitals";
import { exportMetricEntry } from "./metric-exporter";

export interface MetricContext {
  traceId?: string;
  spanId?: string;
  [key: string]: unknown;
}

// This interface is imported by logs-exporter.ts
export interface MetricEntry extends Metric {
  page?: string;
  context: MetricContext;
}

class Meter {
  private getTraceContext(): Pick<MetricContext, "traceId" | "spanId"> {
    const span = trace.getActiveSpan();
    if (!span) return {};
    const { traceId, spanId } = span.spanContext();
    return { traceId, spanId };
  }

  record(metric: Metric, context?: MetricContext) {
    const entry: MetricEntry = {
      ...metric,
      // page: "",
      context: { ...this.getTraceContext(), ...context },
    };

    if (typeof window === "undefined") {
      exportMetricEntry(entry);
    }
  }
}

export const meter = new Meter();
