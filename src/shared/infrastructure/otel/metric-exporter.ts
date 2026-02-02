"server-only";

import { type Attributes, metrics } from "@opentelemetry/api";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import type { Metric } from "web-vitals";
import { env } from "@/env";
import { serverLogger } from "../logger/pino-logger";

let isInitialized = false;
let meterProvider: MeterProvider | null = null;

function createMeterProvider() {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.npm_package_name ?? "acme-app",
    [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? "1.0.0",
  });

  // Create a metric reader with OTLP exporter configured to send metrics to a local collector.
  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
    }),
  });

  // Initialize a MeterProvider with the above configurations.
  return new MeterProvider({
    resource,
    readers: [metricReader],
  });
}

export function initializeMetricsExporter() {
  if (isInitialized) return;

  meterProvider = createMeterProvider();
  metrics.setGlobalMeterProvider(meterProvider);
  isInitialized = true;
  console.log("✅ OpenTelemetry metrics exporter initialized");
}

export function exportMetricEntry(metric: Metric, attrs?: Attributes) {
  if (!isInitialized) initializeMetricsExporter();
  if (!meterProvider) return;

  const meter = metrics.getMeter("web-vitals");

  const lcp = meter.createHistogram("web_vitals_lcp", { unit: "ms" });
  const inp = meter.createHistogram("web_vitals_inp", { unit: "ms" });
  const cls = meter.createObservableGauge("web_vitals_cls", { unit: "1" });
  const ttfb = meter.createHistogram("web_vitals_ttfb", { unit: "ms" });
  const fcp = meter.createHistogram("web_vitals_fcp", { unit: "ms" });

  switch (metric.name) {
    case "LCP": {
      lcp.record(metric.value, attrs);
      break;
    }
    case "CLS": {
      cls.addCallback((result) => {
        result.observe(metric.value, attrs);
      });
      break;
    }
    case "INP": {
      inp.record(metric.value, attrs);
      break;
    }
    case "TTFB": {
      ttfb.record(metric.value, attrs);

      break;
    }
    case "FCP": {
      fcp.record(metric.value, attrs);
      break;
    }
    default: {
      serverLogger.warn("unexpected metric name", metric.name);
    }
  }
}

export function shutdownMetricsExporter() {
  return meterProvider?.shutdown() ?? Promise.resolve();
}
