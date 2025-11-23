"use client";

import type { Session } from "better-auth";
import { LaptopIcon, SmartphoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";

export function SessionManagement({
  sessions,
  currentSession,
}: {
  sessions: Session[];
  currentSession: Session;
}) {
  const t = useScopedI18n("account");
  const router = useRouter();

  function revokeSession(session: Session) {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onError: (error) => {
          console.error(error);
          toast.error("Error revoking session");
        },
        onSuccess: () => {
          toast.success("Session revoked");
          router.refresh();
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("session")}</CardTitle>
        <CardDescription>{t("session.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions?.map((session) => {
          const userAgentInfo = session.userAgent
            ? UAParser(session.userAgent)
            : null;

          console.log(userAgentInfo, session.userAgent);
          return (
            <Item variant="outline" key={session.id}>
              <ItemMedia variant="icon">
                {userAgentInfo?.device.type === "mobile" ? (
                  <SmartphoneIcon />
                ) : (
                  <LaptopIcon />
                )}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {session.id !== currentSession.id
                    ? session.ipAddress
                    : t("session.current")}
                </ItemTitle>
                <ItemDescription>
                  {userAgentInfo?.browser.name
                    ? `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`
                    : userAgentInfo?.ua}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revokeSession(session)}
                >
                  {session.id === currentSession.id
                    ? t("session.logout")
                    : t("session.revoke")}
                </Button>
              </ItemActions>
            </Item>
          );
        })}
      </CardContent>
    </Card>
  );
}
