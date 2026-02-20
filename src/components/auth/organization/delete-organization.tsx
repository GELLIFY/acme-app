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
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

export function DeleteOrganization() {
  const [value, setValue] = useState("");

  const t = useScopedI18n("organization");

  const trpc = useTRPC();

  const deleteOrganizationMutation = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: async () => {
        toast.info(t("delete.confirm_email"));
      },
    }),
  );

  const canDeleteOrganization = authClient.organization.hasPermission({
    permissions: {
      organization: ["delete"],
    },
  });

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>{t("delete.title")}</CardTitle>
        <CardDescription>{t("delete.description")}</CardDescription>
      </CardHeader>
      <CardFooter className="border-t text-muted-foreground text-sm justify-between">
        <div />

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" disabled={!canDeleteOrganization}>
                {t("delete.btn")}
              </Button>
            }
          ></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("delete.confirm_title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("delete.confirm_description")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-2 flex flex-col gap-2">
              <Label htmlFor="confirm-delete">{t("delete.confirm_type")}</Label>
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
                onClick={() => deleteOrganizationMutation.mutate()}
                disabled={value !== "DELETE"}
              >
                {deleteOrganizationMutation.isPending ? (
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
