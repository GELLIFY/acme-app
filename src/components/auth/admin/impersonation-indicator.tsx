"use client";

import { UserXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/infrastructure/better-auth/auth-client";

export function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={() =>
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              refetch();
              router.push("/admin");
            },
          })
        }
        variant="destructive"
        size="icon"
      >
        <UserXIcon className="size-4" />
      </Button>
    </div>
  );
}
