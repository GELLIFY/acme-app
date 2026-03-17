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
              "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none",
              className,
            )}
            onClick={() => {
              copyToClipboard(value);
            }}
            {...props}
          >
            <span className="sr-only">Copy</span>
            <span className="relative size-4">
              <CopyIcon
                className={cn(
                  "absolute inset-0 size-4 transition-[opacity,filter] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                  isCopied ? "opacity-0 blur-[2px]" : "opacity-100 blur-0",
                )}
              />
              <CopyCheckIcon
                className={cn(
                  "absolute inset-0 size-4 transition-[opacity,filter] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                  isCopied ? "opacity-100 blur-0" : "opacity-0 blur-[2px]",
                )}
              />
            </span>
          </Button>
        }
      />
      <TooltipContent>{isCopied ? "Copied" : tooltip}</TooltipContent>
    </Tooltip>
  );
}
