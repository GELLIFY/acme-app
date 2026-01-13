"use client";

import { metrics } from "@opentelemetry/api";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

let isInitialized = false;
export function initializeWebVitals() {
  if (typeof window === "undefined" || isInitialized) return;

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "acme-app-frontend",
  });

  const reader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `http://localhost:4318/v1/metrics`,
    }),
    // TODO: Reduce in production to lower overhead
    exportIntervalMillis: 10000,
  });

  const meterProvider = new MeterProvider({ resource, readers: [reader] });
  metrics.setGlobalMeterProvider(meterProvider);

  const meter = metrics.getMeter("web-vitals");
  const lcp = meter.createHistogram("web_vitals_lcp", { unit: "ms" });
  const inp = meter.createHistogram("web_vitals_inp", { unit: "ms" });
  const cls = meter.createObservableGauge("web_vitals_cls", { unit: "1" });
  const ttfb = meter.createHistogram("web_vitals_ttfb", { unit: "ms" });
  const fcp = meter.createHistogram("web_vitals_fcp", { unit: "ms" });

  // TODO: Sample metrics if your traffic is high
  const record = (metric: Metric) => {
    const attrs = {
      page: window.location.pathname,
      rating: metric.rating,
    };

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
        console.log("unexpected metric name");
      }
    }
  };

  onLCP(record);
  onINP(record);
  onCLS(record);
  onTTFB(record);
  onFCP(record);
  isInitialized = true;
}
