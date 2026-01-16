"use client";

import * as React from "react";
import { browserLogger as logger } from "@/shared/infrastructure/logger/browser-logger";

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: {
  timeout?: number;
  onCopy?: () => void;
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(
      () => {
        setIsCopied(true);

        if (onCopy) {
          onCopy();
        }

        if (timeout !== 0) {
          setTimeout(() => {
            setIsCopied(false);
          }, timeout);
        }
      },
      (error) => logger.error("Copy error", error),
    );
  };

  return { isCopied, copyToClipboard };
}
