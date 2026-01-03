"use client";

import { Button } from "@/components/ui/button";

export function ErrorFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <div>
        <h2 className="text-md">Something went wrong</h2>
      </div>
      <Button onClick={() => window.location.reload()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
