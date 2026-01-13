"use client";

import { metrics } from "@opentelemetry/api";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

const DEFAULT_SERVICE_NAME = "acme-app-web";

let isInitialized = false;

const getMetricsEndpoint = () =>
  process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ??
  "http://localhost:4318/v1/metrics";

export const initializeWebVitals = () => {
  if (typeof window === "undefined" || isInitialized) return;

  const resource = new Resource({
    [ATTR_SERVICE_NAME]:
      process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME ?? DEFAULT_SERVICE_NAME,
  });

  const reader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({ url: getMetricsEndpoint() }),
    exportIntervalMillis: 10000,
  });

  const meterProvider = new MeterProvider({ resource, readers: [reader] });
  metrics.setGlobalMeterProvider(meterProvider);
  const meter = metrics.getMeter("web-vitals");

  const lcp = meter.createHistogram("web_vitals_lcp", { unit: "ms" });
  const inp = meter.createHistogram("web_vitals_inp", { unit: "ms" });
  const fcp = meter.createHistogram("web_vitals_fcp", { unit: "ms" });
  const ttfb = meter.createHistogram("web_vitals_ttfb", { unit: "ms" });
  const cls = meter.createUpDownCounter("web_vitals_cls", { unit: "1" });

  const record = (metric: { name: string; value: number; rating: string }) => {
    const attrs = {
      page: window.location.pathname,
      rating: metric.rating,
    };

    switch (metric.name) {
      case "LCP":
        lcp.record(metric.value, attrs);
        break;
      case "INP":
        inp.record(metric.value, attrs);
        break;
      case "FCP":
        fcp.record(metric.value, attrs);
        break;
      case "TTFB":
        ttfb.record(metric.value, attrs);
        break;
      case "CLS":
        cls.add(metric.value, attrs);
        break;
    }
  };

  onLCP(record);
  onINP(record);
  onCLS(record);
  onFCP(record);
  onTTFB(record);

  isInitialized = true;
};
