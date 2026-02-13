"use client";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import type * as React from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/libs/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function CopyButton({
  value,
  className,
  variant = "ghost",
  tooltip = "Copy to Clipboard",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
  tooltip?: string;
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="copy-button"
            data-copied={isCopied}
            size="icon"
            variant={variant}
            className={cn(
              "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
              className,
            )}
            onClick={() => {
              copyToClipboard(value);
            }}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
          </Button>
        }
      />
      <TooltipContent>{isCopied ? "Copied" : tooltip}</TooltipContent>
    </Tooltip>
  );
}
