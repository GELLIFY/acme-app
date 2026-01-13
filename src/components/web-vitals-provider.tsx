"use client";

import { useEffect } from "react";
import { initializeWebVitals } from "@/lib/web-vitals";

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeWebVitals();
  }, []);
  return <>{children}</>;
}
