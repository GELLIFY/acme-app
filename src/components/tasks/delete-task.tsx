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

interface DialogProps {
  trigger: ReactElement;
  title: string;
  description?: string;
  onConfirmAction: () => void;
}

export function DeleteConfirmDialog({
  trigger,
  title,
  description,
  onConfirmAction,
}: DialogProps) {
  const t = useScopedI18n("tasks");
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onConfirmAction();
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
        <DialogFooter>
          <div className="flex flex-row justify-end gap-4">
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button onClick={handleDelete}>{t("confirm")}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
