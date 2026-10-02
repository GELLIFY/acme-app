// The admin module's part of TanStack Table's meta: its users table sets a
// class per column. The organization module declares its own part.
export {};

declare module "@tanstack/react-table" {
  // The same type parameters as TanStack's, or they would be added to them.
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}
