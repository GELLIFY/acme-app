// biome-ignore lint/correctness/noUnusedImports: import is needed
import type { RouterOutput } from "~/server/api/trpc/routers/_app";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    // Add custom table properties here
    userId?: string | null;
  }

  interface ColumnMeta<_TData extends RowData, _TValue> {
    className?: string;
  }
}
