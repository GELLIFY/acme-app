"use client";

import { FingerprintIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { Button } from "../ui/button";

export function PasskeyButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  useEffect(() => {
    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess() {
          refetch();
          router.push("/");
        },
      },
    );
  }, [router, refetch]);

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess() {
            refetch();
            router.push("/");
          },
        })
      }
    >
      <FingerprintIcon />
      Use Passkey
    </Button>
  );
}
