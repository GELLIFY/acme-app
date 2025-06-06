"use client";

import { Loader2Icon } from "lucide-react";

export function TodoListLoading() {
  return (
    <div className="flex justify-center py-4">
      <Loader2Icon className="h-6 w-6 animate-spin" />
    </div>
  );
}
