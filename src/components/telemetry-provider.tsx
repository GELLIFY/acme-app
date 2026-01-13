"use client";

import { useEffect } from "react";
import { initializeBrowserLogging } from "@/shared/infrastructure/logger/browser-log-buffer";
import { initializeWebVitals } from "@/shared/infrastructure/otel/web-vitals";

export const TelemetryProvider = () => {
  useEffect(() => {
    initializeWebVitals();
    initializeBrowserLogging();
  }, []);

  return null;
};
