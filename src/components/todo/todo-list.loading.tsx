"use client";

import { Spinner } from "../ui/spinner";

export function TodoListLoading() {
  return (
    <div className="flex justify-center py-4">
      <Spinner />
    </div>
  );
}
