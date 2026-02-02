"use client";

import { useReportWebVitals } from "next/web-vitals";
import { UAParser } from "ua-parser-js";

export function WebVitals() {
  const parser = new UAParser();
  const device = parser.getDevice().type ?? "desktop";

  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      metric,
      device,
      page: window.location.pathname,
    });
    const url = "/api/rum/vitals";

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: "POST", keepalive: true });
    }
  });

  return null;
}
