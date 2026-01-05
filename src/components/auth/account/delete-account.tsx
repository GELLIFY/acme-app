"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/shared/infrastructure/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

export function DeleteAccount() {
  const [value, setValue] = useState("");

  const t = useScopedI18n("account");

  const trpc = useTRPC();

  const deleteUserMutation = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: async () => {
        toast.info(
          "A confirmation email has been sent to your address. Please check your inbox to confirm account deletion.",
        );
      },
    }),
  );

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>{t("delete")}</CardTitle>
        <CardDescription>{t("delete.description")}</CardDescription>
      </CardHeader>
      <CardFooter className="border-t text-muted-foreground text-sm justify-between">
        <div />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="text-muted hover:bg-destructive"
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("delete.confirm_title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("delete.confirm_description")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-2 flex flex-col gap-2">
              <Label htmlFor="confirm-delete">
                Type <span className="font-medium">DELETE</span> to confirm.
              </Label>
              <Input
                id="confirm-delete"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("delete.confirm_cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteUserMutation.mutate()}
                disabled={value !== "DELETE"}
              >
                {deleteUserMutation.isPending ? (
                  <Spinner />
                ) : (
                  t("delete.confirm_continue")
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
