"use client";

import { useEffect } from "react";

export function WebVitalsProvider() {
  useEffect(() => {
    void import("@/shared/infrastructure/metrics/web-vitals").then(
      ({ initializeWebVitals }) => {
        initializeWebVitals();
      },
    );
  }, []);

  return null;
}
