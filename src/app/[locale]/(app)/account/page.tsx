import { KeyIcon, LockIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { ChangeEmail } from "@/components/auth/account/change-email";
import { DeleteAccount } from "@/components/auth/account/delete-account";
import { DisplayName } from "@/components/auth/account/display-name";
import { UserAvatar } from "@/components/auth/account/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getQueryClient, trpc } from "@/shared/helpers/trpc/server";

export const metadata: Metadata = {
  title: "Account | Acme",
};

export default async function AccountPage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.user.me.queryOptions());

  return (
    <Tabs
      defaultValue="tab-1"
      orientation="vertical"
      className="w-full flex-row"
    >
      <TabsList className="flex-col justify-start h-fit sticky top-[81px]">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger value="tab-1" className="p-3">
                  <UserIcon size={16} aria-hidden="true" />
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="px-2 py-1 text-xs">
              Account
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger value="tab-2" className="p-3">
                  <span className="relative">
                    <LockIcon size={16} aria-hidden="true" />
                  </span>
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="px-2 py-1 text-xs">
              Security
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger value="tab-3" className="p-3">
                  <KeyIcon size={16} aria-hidden="true" />
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="px-2 py-1 text-xs">
              Api Keys
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
      <div className="grow rounded-md  text-start">
        <TabsContent value="tab-1">
          <div className="pl-2 text-muted-foreground space-y-4">
            <UserAvatar />
            <DisplayName />
            <ChangeEmail />
          </div>
        </TabsContent>
        <TabsContent value="tab-2">
          <div className="pl-2 text-muted-foreground space-y-4">
            <DeleteAccount />
          </div>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="pl-2 text-muted-foreground space-y-4">
            Content for Tab 3
          </p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
