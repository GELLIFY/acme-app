"use client";

import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

let metrics: Metric[] = [];
const flushInterval = 10000; // Flush every 10 seconds

export function initializeWebVitals() {
  if (typeof window === "undefined") return;

  setInterval(() => flush(), flushInterval);
  // Optional: Also flush when the page is hidden
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flush();
    }
  });

  const flush = () => {
    if (typeof window === "undefined" || metrics.length === 0) {
      return;
    }

    const metricsToSend = metrics;
    metrics = [];

    // Use navigator.sendBeacon if available for reliability,
    // especially on page unload.
    // Note: sendBeacon only supports POST and specific data types.
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(metricsToSend)], {
          type: "application/json",
        });
        navigator.sendBeacon("/api/otel/metrics", blob);
      } else {
        fetch("/api/otel/metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metricsToSend),
          keepalive: true, // Important for reliability
        });
      }
    } catch (error) {
      console.error("Failed to send browser metrics", error);
      // If sending fails, put metrics back in the queue
      metrics = metricsToSend.concat(metrics);
    }
  };

  // TODO: Sample metrics if your traffic is high
  const record = (metric: Metric) => {
    const metricEntry = {
      ...metric,
      page: window.location.pathname,
      context: {}, // Server will fill in trace context on the server side
    };

    switch (metric.name) {
      case "LCP": {
        metrics.push(metricEntry);
        break;
      }
      case "CLS": {
        metrics.push(metricEntry);
        break;
      }
      case "INP": {
        metrics.push(metricEntry);
        break;
      }
      case "TTFB": {
        metrics.push(metricEntry);
        break;
      }
      case "FCP": {
        metrics.push(metricEntry);
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
}
