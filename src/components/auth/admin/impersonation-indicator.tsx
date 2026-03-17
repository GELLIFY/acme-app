"use client";

import { UserXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/libs/better-auth/auth-client";

export function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 motion-reduce:transition-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-200">
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
