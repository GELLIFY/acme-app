import { type PropsWithChildren } from "react";

import CreateTodoDialog from "@/components/todo/sheets/create-todo-dialog";

export default function AppLayout(props: PropsWithChildren) {
  return (
    <>
      {props.children}

      {/* Global Sheets here */}
      <CreateTodoDialog />
    </>
  );
}
