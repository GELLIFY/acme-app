"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
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
import { useOrganizationQuery } from "@/hooks/use-organization";
import { browserLogger } from "@/infrastructure/logger/browser-logger";
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { convertImageToBase64 } from "@/shared/helpers/image";
import { useScopedI18n } from "@/shared/locales/client";

export function OrganizationLogo({
  canUpdateOrganization,
}: {
  canUpdateOrganization: boolean;
}) {
  const t = useScopedI18n("organization");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: organization, isLoading } = useOrganizationQuery();

  const updateOrganizationMutation = useMutation({
    mutationFn: async ({ logo }: { logo: string }) => {
      const { data, error } = await authClient.organization.update({
        data: { logo },
        organizationId: organization?.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onError: (error) => {
      toast.error(error.message);
      browserLogger.error(error.message, error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.organization.active.queryKey(),
      });
    },
  });

  return (
    <Card>
      <CardHeader className="gap-x-6">
        <CardTitle>{t("logo.title")}</CardTitle>
        <CardDescription>{t("logo.description")}</CardDescription>
        <CardAction>
          <Avatar
            className="group flex size-15 cursor-pointer items-center justify-center"
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
                  className="size-15 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-20"
                  src={organization?.logo ?? undefined}
                />
                <AvatarFallback className="transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:scale-95 [@media(hover:hover)_and_(pointer:fine)]:opacity-80 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100">
                  <UploadIcon className="size-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105" />
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
              disabled={!canUpdateOrganization}
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                const image = file ? await convertImageToBase64(file) : "";
                updateOrganizationMutation.mutate({ logo: image });
              }}
            />
          </Avatar>
        </CardAction>
      </CardHeader>

      <CardFooter className="border-t text-muted-foreground text-sm">
        {t("logo.message")}
      </CardFooter>
    </Card>
  );
}
