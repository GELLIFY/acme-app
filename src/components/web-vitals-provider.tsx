"use client";

import { useEffect } from "react";

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void import("@/shared/infrastructure/metrics/web-vitals").then(
      ({ initializeWebVitals }) => {
        initializeWebVitals();
      },
    );
  }, []);
  return <>{children}</>;
}
