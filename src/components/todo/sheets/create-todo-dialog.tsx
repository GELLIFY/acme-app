"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTodoParams } from "@/hooks/use-todo-params";
import { CreatePostForm } from "../create-todo-form";

export default function CreateTodoDialog() {
  const { params, setParams } = useTodoParams();

  const isOpen = !!params.createTodo;

  const onOpenChange = () => {
    void setParams(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-4">
        <div className="flex h-full flex-col">
          <DialogHeader className="mb-6">
            <DialogTitle>Crea Todo</DialogTitle>
            <DialogDescription>
              Aggiungi una nuova attività alla tua lista di cose da fare.
            </DialogDescription>
          </DialogHeader>

          <CreatePostForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
