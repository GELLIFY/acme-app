"use client";

import { type ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useScopedI18n } from "@/shared/locales/client";
import UsersSelect from "../users/users-select";

interface DialogProps {
  trigger: ReactElement;
  title: string;
  description?: string;
  onConfirmAction: (userId: string) => void;
  currentUserId?: string;
}

export function AssignUserToTask({
  trigger,
  title,
  description,
  onConfirmAction,
  currentUserId = "",
}: DialogProps) {
  const t = useScopedI18n("tasks");
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(currentUserId);

  const handleAssign = () => {
    onConfirmAction(selectedUserId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="font-semibold">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 w-full">
          <UsersSelect
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            defaultValue={currentUserId}
          />
        </div>
        <DialogFooter>
          <div className="flex flex-row justify-end gap-4">
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button onClick={handleAssign}>{t("confirm")}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
