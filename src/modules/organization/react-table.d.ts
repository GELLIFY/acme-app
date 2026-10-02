// The organization module's part of TanStack Table's meta: its members table
// knows the current user. The admin module declares its own part.
export {};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    userId?: string | null;
  }
}
