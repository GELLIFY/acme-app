"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCircleIcon } from "lucide-react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserQuery } from "@/hooks/use-user";
import { convertImageToBase64 } from "@/shared/helpers/image";
import { useTRPC } from "@/shared/infrastructure/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

export function UserAvatar() {
  const t = useScopedI18n("account");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useUserQuery();

  const updateUserMutation = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.user.me.queryKey(),
        });
      },
    }),
  );

  return (
    <Card>
      <CardHeader className="gap-x-6">
        <CardTitle>{t("avatar")}</CardTitle>
        <CardDescription>{t("avatar.description")}</CardDescription>
        <CardAction>
          <Avatar
            className="flex cursor-pointer items-center justify-center size-15"
            onClick={() => {
              if ("current" in fileInputRef && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <AvatarImage
                  className="size-15"
                  src={user.image ?? undefined}
                />
                <AvatarFallback>
                  <UserCircleIcon className="size-5" />
                </AvatarFallback>
              </>
            )}
            <Input
              id="image"
              accept="image/*"
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              multiple={false}
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                const image = file ? await convertImageToBase64(file) : "";
                updateUserMutation.mutate({ image });
              }}
            />
          </Avatar>
        </CardAction>
      </CardHeader>

      <CardFooter className="border-t text-muted-foreground text-sm">
        {t("avatar.message")}
      </CardFooter>
    </Card>
  );
}
