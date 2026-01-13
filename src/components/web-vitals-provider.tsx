"use client";

import { useEffect } from "react";
import { initializeWebVitals } from "@/shared/infrastructure/metrics/web-vitals";

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeWebVitals();
  }, []);
  return <>{children}</>;
}
