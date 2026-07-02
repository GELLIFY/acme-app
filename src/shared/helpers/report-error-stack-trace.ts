import type { ErrorInfo } from "react";

export function reportErrorStackTrace(error: Error, _info?: ErrorInfo): void {
  if (typeof window === "undefined") {
    return;
  }

  // Use navigator.sendBeacon if available for reliability,
  // especially on page unload.
  // Note: sendBeacon only supports POST and specific data types.
  try {
    const payload = JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/rum/errors", blob);
    } else {
      fetch("/api/rum/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        keepalive: true, // Important for reliability
      });
    }
  } catch (error) {
    console.error("Failed to send browser error", error);
    // TODO: If sending fails, put metrics back in the queue
  }
}
